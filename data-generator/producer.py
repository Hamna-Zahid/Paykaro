import json
import time
import random
from datetime import datetime
from kafka import KafkaProducer

def json_serializer(data):
    return json.dumps(data).encode("utf-8")

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'], # Change to 'kafka:9092' if running in docker
    value_serializer=json_serializer
)

transaction_types = ['PAYMENT', 'TRANSFER', 'WITHDRAWAL', 'DEPOSIT']
merchants = ['Amazon', 'Starbucks', 'Walmart', 'Apple', 'Netflix', 'Uber', 'Shell']

def generate_transaction():
    return {
        'transaction_id': f"TXN-{random.randint(10000, 99999)}",
        'account_id': f"ACC-{random.randint(100, 999)}",
        'customer_id': f"CUST-{random.randint(1000, 9999)}",
        'amount': round(random.uniform(10.0, 5000.0), 2),
        'currency': 'USD',
        'transaction_type': random.choice(transaction_types),
        'merchant_id': random.choice(merchants),
        'location': 'New York, USA',
        'timestamp': datetime.now().isoformat()
    }

if __name__ == "__main__":
    print("Starting transaction generation...")
    while True:
        transaction = generate_transaction()
        print(f"Producing: {transaction}")
        producer.send('banking_transactions', transaction)
        time.sleep(random.uniform(0.5, 2.0))
