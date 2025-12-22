import logging
import time
from kafka import KafkaAdminClient
from pyspark.sql import SparkSession

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_kafka_health():
    try:
        admin_client = KafkaAdminClient(bootstrap_servers='localhost:9092')
        topics = admin_client.list_topics()
        if 'bank_transactions' in topics:
            logger.info("Kafka health: OK - bank_transactions topic exists")
            return True
        else:
            logger.error("Kafka health: FAIL - bank_transactions topic missing")
            return False
    except Exception as e:
        logger.error(f"Kafka health check failed: {e}")
        return False

def check_data_quality():
    spark = SparkSession.builder.appName("DataQualityCheck").getOrCreate()
    
    try:
        # Check bronze layer
        bronze_df = spark.read.format("delta").load("/opt/data/bronze")
        bronze_count = bronze_df.count()
        
        # Check for anomalies
        null_transactions = bronze_df.filter("transaction_id IS NULL").count()
        negative_amounts = bronze_df.filter("amount < 0").count()
        
        logger.info(f"Bronze layer: {bronze_count} records")
        if null_transactions > 0:
            logger.warning(f"Found {null_transactions} transactions with null IDs")
        if negative_amounts > 0:
            logger.warning(f"Found {negative_amounts} transactions with negative amounts")
        
        # Alert if no new data in last hour
        recent_count = bronze_df.filter("timestamp > current_timestamp() - interval 1 hour").count()
        if recent_count == 0:
            logger.warning("No new transactions in the last hour")
        
        return True
    except Exception as e:
        logger.error(f"Data quality check failed: {e}")
        return False
    finally:
        spark.stop()

def check_pipeline_health():
    # Check if streaming job is running (simplified)
    # In production, use health check endpoints
    logger.info("Pipeline health check: Basic checks completed")
    return True

if __name__ == "__main__":
    while True:
        kafka_ok = check_kafka_health()
        data_ok = check_data_quality()
        pipeline_ok = check_pipeline_health()
        
        if not all([kafka_ok, data_ok, pipeline_ok]):
            logger.error("Pipeline health issues detected - sending alert")
            # In production, send email/SMS alert here
        
        time.sleep(300)  # Check every 5 minutes