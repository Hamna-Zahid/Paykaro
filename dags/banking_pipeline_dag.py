from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2025, 12, 18),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'banking_pipeline',
    default_args=default_args,
    description='Orchestrate banking data pipeline',
    schedule_interval=timedelta(hours=1),
    catchup=False,
)

# Task to run silver layer processing
silver_task = BashOperator(
    task_id='silver_processing',
    bash_command='spark-submit /opt/spark-apps/silver_processing.py',
    dag=dag,
)

# Task to run gold layer processing
gold_task = BashOperator(
    task_id='gold_processing',
    bash_command='spark-submit /opt/spark-apps/gold_processing.py',
    dag=dag,
)

# Task for data validation
validation_task = BashOperator(
    task_id='data_validation',
    bash_command='python /opt/airflow/spark-apps/validation.py',
    dag=dag,
)

# Set dependencies
silver_task >> gold_task >> validation_task