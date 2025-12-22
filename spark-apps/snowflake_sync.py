# Note: This requires Snowflake account and snowflake-connector-python
# Install with: pip install snowflake-connector-python

import snowflake.connector
from pyspark.sql import SparkSession

# Snowflake connection parameters (replace with your credentials)
SNOWFLAKE_ACCOUNT = 'your_account'
SNOWFLAKE_USER = 'your_user'
SNOWFLAKE_PASSWORD = 'your_password'
SNOWFLAKE_DATABASE = 'BANKING_DB'
SNOWFLAKE_SCHEMA = 'ANALYTICS'

# Initialize Spark session
spark = SparkSession.builder \
    .appName("SnowflakeSync") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
    .getOrCreate()

# Read Gold tables
aggregates_df = spark.read.format("delta").load("/opt/data/gold/daily_aggregates")
fraud_df = spark.read.format("delta").load("/opt/data/gold/fraud_features")

# Convert to Pandas for Snowflake upload
aggregates_pd = aggregates_df.toPandas()
fraud_pd = fraud_df.toPandas()

# Connect to Snowflake
conn = snowflake.connector.connect(
    account=SNOWFLAKE_ACCOUNT,
    user=SNOWFLAKE_USER,
    password=SNOWFLAKE_PASSWORD,
    database=SNOWFLAKE_DATABASE,
    schema=SNOWFLAKE_SCHEMA
)

# Create tables if not exist and insert data
cursor = conn.cursor()

# For aggregates
cursor.execute("""
CREATE OR REPLACE TABLE DAILY_AGGREGATES (
    window STRUCT,
    account_id STRING,
    total_amount FLOAT,
    transaction_count INT,
    avg_amount FLOAT
)
""")

# Insert data (simplified - in practice use batch insert)
for _, row in aggregates_pd.iterrows():
    cursor.execute("""
    INSERT INTO DAILY_AGGREGATES VALUES (%s, %s, %s, %s, %s)
    """, (str(row['window']), row['account_id'], row['total_amount'], row['transaction_count'], row['avg_amount']))

# Similarly for fraud features
cursor.execute("""
CREATE OR REPLACE TABLE FRAUD_FEATURES (
    transaction_id STRING,
    account_id STRING,
    amount FLOAT,
    amount_diff FLOAT,
    is_large_transaction INT,
    is_unusual_location INT,
    timestamp TIMESTAMP
)
""")

for _, row in fraud_pd.iterrows():
    cursor.execute("""
    INSERT INTO FRAUD_FEATURES VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (row['transaction_id'], row['account_id'], row['amount'], row['amount_diff'], row['is_large_transaction'], row['is_unusual_location'], row['timestamp']))

conn.commit()
cursor.close()
conn.close()

print("Gold tables synced to Snowflake")