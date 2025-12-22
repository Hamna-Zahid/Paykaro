from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when, regexp_replace, to_timestamp
import os

# Initialize Spark session
spark = SparkSession.builder \
    .appName("SilverLayerProcessing") \
    .getOrCreate()

# Read all JSON files from bronze
bronze_path = "/opt/data/bronze"
json_files = [os.path.join(bronze_path, f) for f in os.listdir(bronze_path) if f.endswith('.json')]

bronze_df = spark.read.json(json_files)

# Data cleaning and enrichment
silver_df = bronze_df \
    .withColumn("amount", col("amount").cast("double")) \
    .withColumn("timestamp", to_timestamp(col("timestamp"))) \
    .withColumn("location", regexp_replace(col("location"), "[^a-zA-Z ]", "")) \
    .withColumn("merchant_category", 
                when(col("merchant_id") == "Daraz", "E-commerce")
                .when(col("merchant_id") == "Foodpanda", "Food Delivery")
                .when(col("merchant_id") == "Amazon", "E-commerce")
                .when(col("merchant_id") == "LocalMart", "Retail")
                .otherwise("Other")) \
    .filter(col("amount").isNotNull() & (col("amount") > 0)) \
    .dropDuplicates(["transaction_id"])

# Write to Silver as JSON for simplicity (or Delta if fixed)
silver_df.write.mode("overwrite").json("/opt/data/silver")

print("Silver layer processing completed")