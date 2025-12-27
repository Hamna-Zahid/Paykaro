from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import json
import time
import redis
from datetime import datetime, timedelta
from typing import List

import models, auth, database
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Paykaro Fintech Platform API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kafka Producer for Big Data Pipeline
try:
    from kafka import KafkaProducer
    producer = KafkaProducer(
        bootstrap_servers=[os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
except Exception as e:
    print(f"Kafka connection failed: {e}")
    producer = None

# Redis connection
try:
    r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, db=0, decode_responses=True)
    r.ping() # Test connection
except Exception as e:
    print(f"Redis connection failed: {e}")
    r = None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/")
def read_root():
    return {"message": "Welcome to Paykaro Fintech Platform"}

@app.post("/token", response_model=auth.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/register")
async def register_user(username: str, phone: str, full_name: str, password: str, pin: str, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.username == username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = auth.get_password_hash(password)
    # Note: PIN should also be hashed in production
    new_user = models.User(username=username, phone_number=phone, full_name=full_name, hashed_password=hashed_pwd, pin=pin)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create initial wallet
    new_wallet = models.Wallet(user_id=new_user.id, balance=5000.0) # Bonus for new users
    db.add(new_wallet)
    db.commit()
    
    return {"message": "User created successfully"}

@app.get("/users/me")
async def read_users_me(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # Simple decode and lookup
    try:
        from jose import jwt
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "username": user.username,
        "full_name": user.full_name,
        "phone": user.phone_number,
        "balance": user.wallet.balance
    }

@app.post("/wallet/transfer")
async def transfer_money(
    recipient_phone: str, 
    amount: float, 
    pin: str, 
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
    
    # Get Current User
    try:
        from jose import jwt
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    sender = db.query(models.User).filter(models.User.username == username).first()
    if not sender or sender.pin != pin:
        raise HTTPException(status_code=403, detail="Invalid Transaction PIN")
        
    if sender.wallet.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
        
    # Find Recipient
    recipient = db.query(models.User).filter(models.User.phone_number == recipient_phone).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
        
    # Transactional Update
    try:
        sender.wallet.balance -= amount
        recipient.wallet.balance += amount
        
        new_txn = models.Transaction(
            sender_id=sender.id,
            receiver_id=recipient.id,
            amount=amount,
            transaction_type="SEND"
        )
        db.add(new_txn)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Transaction failed")
    
    # Data Pipeline Logic
    txn_data = {
        "transaction_id": f"TXN-{int(time.time()*1000)}",
        "sender": sender.username,
        "receiver": recipient.username,
        "amount": amount,
        "type": "SEND_MONEY",
        "category": "Transfer",
        "location": "Mobile App",
        "timestamp": datetime.utcnow().isoformat()
    }
    
    if producer:
        producer.send('banking_transactions', txn_data)
    
    if r:
        latest = r.get(f"txns_{sender.username}")
        recent_list = json.loads(latest) if latest else []
        recent_list.insert(0, txn_data)
        r.set(f"txns_{sender.username}", json.dumps(recent_list[:10]))

    return {"status": "success", "message": f"Transferred Rs.{amount} to {recipient.full_name}"}

@app.get("/transactions/live")
async def get_live_transactions(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    try:
        from jose import jwt
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    if r:
        transactions = r.get(f"txns_{username}")
        if transactions:
            return {"status": "success", "data": json.loads(transactions)}
            
    # Fallback to DB if Redis is empty or failing
    user = db.query(models.User).filter(models.User.username == username).first()
    db_txns = db.query(models.Transaction).filter(
        (models.Transaction.sender_id == user.id) | (models.Transaction.receiver_id == user.id)
    ).order_by(models.Transaction.timestamp.desc()).limit(10).all()
    
    formatted = []
    for t in db_txns:
        formatted.append({
            "transaction_id": f"TXN-{t.id}",
            "amount": t.amount if t.receiver_id == user.id else -t.amount,
            "merchant_id": "Transfer" if t.transaction_type == "SEND" else "Received",
            "type": t.transaction_type,
            "timestamp": t.timestamp.isoformat()
        })
    return {"status": "success", "data": formatted}
