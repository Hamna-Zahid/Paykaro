from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    pin = Column(String) # Encrypted 4-digit PIN for transfers
    
    wallet = relationship("Wallet", back_populates="owner", uselist=False)

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    balance = Column(Float, default=0.0)
    currency = Column(String, default="PKR")

    owner = relationship("User", back_populates="wallet")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    transaction_type = Column(String) # SEND, RECEIVE, TOPUP, BILL_PAY
    status = Column(String, default="COMPLETED")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
