from pyspark.sql import SparkSession
from pyspark.sql.functions import col

# Initialize Spark session
spark = SparkSession.builder \
    .appName("DataValidation") \
    .getOrCreate()

# Validate Bronze layer (JSON files)
import os
bronze_path = "/opt/data/bronze"
json_files = [f for f in os.listdir(bronze_path) if f.endswith('.json')]
bronze_count = 0
for f in json_files:
    df = spark.read.json(os.path.join(bronze_path, f))
    bronze_count += df.count()

print(f"Bronze layer records: {bronze_count}")

# Validate Silver layer
silver_df = spark.read.json("/opt/data/silver")
silver_count = silver_df.count()
print(f"Silver layer records: {silver_count}")

# Validate Gold layers
aggregates_df = spark.read.json("/opt/data/gold/daily_aggregates")
fraud_df = spark.read.json("/opt/data/gold/fraud_features")

print(f"Gold aggregates records: {aggregates_df.count()}")
print(f"Gold fraud features records: {fraud_df.count()}")

# Basic quality checks
null_amounts = silver_df.filter(col("amount").isNull()).count()
print(f"Null amounts in silver: {null_amounts}")

if bronze_count > 0 and silver_count > 0:
    print("Data validation passed")
else:
    print("Data validation failed")
    raise Exception("Validation failed")