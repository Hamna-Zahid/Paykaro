import json
import os
from kafka import KafkaConsumer

OUTPUT_DIR = "data/bronze"
os.makedirs(OUTPUT_DIR, exist_ok=True)

consumer = KafkaConsumer(
    "bank_transactions",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    value_deserializer=lambda v: json.loads(v.decode("utf-8"))
)

batch = []
BATCH_SIZE = 10

for message in consumer:
    batch.append(message.value)

    if len(batch) >= BATCH_SIZE:
        filename = f"{OUTPUT_DIR}/transactions_{message.offset}.json"
        with open(filename, "w") as f:
            json.dump(batch, f)
        print(f"Wrote {len(batch)} records to {filename}")
        batch = []
