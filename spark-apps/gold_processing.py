from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum, count, avg, stddev, window, lag, when, abs
from pyspark.sql.window import Window

# Initialize Spark session
spark = SparkSession.builder \
    .appName("GoldLayerProcessing") \
    .getOrCreate()

# Read from Silver JSON
silver_df = spark.read.json("/opt/data/silver")

# Aggregates: Daily transaction summaries
daily_aggregates = silver_df \
    .groupBy(window(col("timestamp"), "1 day"), col("sender")) \
    .agg(
        sum("amount").alias("total_amount"),
        count("*").alias("transaction_count"),
        avg("amount").alias("avg_amount")
    )

# Fraud features: Unusual patterns
window_spec = Window.partitionBy("sender").orderBy("timestamp")

fraud_features = silver_df \
    .withColumn("prev_amount", lag("amount").over(window_spec)) \
    .withColumn("amount_diff", abs(col("amount") - col("prev_amount"))) \
    .withColumn("is_large_transaction", when(col("amount") > 50000, 1).otherwise(0)) \
    .select("transaction_id", "sender", "amount", "amount_diff", "is_large_transaction", "timestamp")

# Write to Gold as JSON
daily_aggregates.write.mode("overwrite").json("/opt/data/gold/daily_aggregates")
fraud_features.write.mode("overwrite").json("/opt/data/gold/fraud_features")

print("Gold layer processing completed")