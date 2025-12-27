from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, schema_of_json
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType

# Initialize Spark session with Delta Lake support
spark = SparkSession.builder \
    .appName("BankingStreamingPipeline") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
    .getOrCreate()

# Define schema for transactions
transaction_schema = StructType([
    StructField("transaction_id", StringType(), True),
    StructField("sender", StringType(), True),
    StructField("receiver", StringType(), True),
    StructField("amount", DoubleType(), True),
    StructField("type", StringType(), True),
    StructField("category", StringType(), True),
    StructField("location", StringType(), True),
    StructField("timestamp", StringType(), True)
])

# Read from Kafka
kafka_df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "banking_transactions") \
    .option("startingOffsets", "earliest") \
    .load()

# Parse JSON value
parsed_df = kafka_df \
    .select(from_json(col("value").cast("string"), transaction_schema).alias("data")) \
    .select("data.*")

# Write to Delta Lake Bronze layer
query = parsed_df \
    .writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "/opt/data/checkpoints/bronze") \
    .start("/opt/data/bronze")

query.awaitTermination()