import json
import time
import uuid
import random
from datetime import datetime
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

# Retry connection to Kafka
max_retries = 10
retry_count = 0
producer = None

while retry_count < max_retries:
    try:
        producer = KafkaProducer(
            bootstrap_servers='localhost:9092',
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8')
        )
        print("Connected to Kafka")
        break
    except NoBrokersAvailable:
        print(f"Kafka not ready, retrying in 5 seconds... ({retry_count + 1}/{max_retries})")
        time.sleep(5)
        retry_count += 1

if producer is None:
    raise Exception("Could not connect to Kafka after retries")

locations = ["Karachi", "Lahore", "Islamabad", "Faisalabad"]
merchants = ["Daraz", "Foodpanda", "Amazon", "LocalMart"]

def generate_transaction():
    return {
        "transaction_id": str(uuid.uuid4()),
        "account_id": f"acc_{random.randint(1000, 9999)}",
        "customer_id": f"cust_{random.randint(100, 999)}",
        "amount": round(random.uniform(100, 50000), 2),
        "currency": "PKR",
        "transaction_type": random.choice(["debit", "credit"]),
        "merchant_id": random.choice(merchants),
        "location": random.choice(locations),
        "timestamp": datetime.utcnow().isoformat()
    }

while True:
    txn = generate_transaction()
    producer.send(
        topic="bank_transactions",
        key=txn["transaction_id"],
        value=txn
    )
    print("Sent:", txn)
    time.sleep(random.uniform(0.2, 0.6))
