# app/utils/logging.py
# Contains utility functions for logging query information to CSV files.
import csv
from datetime import datetime
import os
from app.config import FOLDER_PATH
from app.utils.vector_db import add_csv_to_vectordb  # Ensure the import path is correct

def get_log_file_path():
    current_date = datetime.now().strftime("_%d_%m_%y")
    log_file_name = f"log{current_date}.csv"
    log_file_path = os.path.join(FOLDER_PATH, 'data', 'active', 'csvs', 'logs', log_file_name)
    return log_file_path

def log_query(question, response, time_taken, session_id):
    log_file_path = get_log_file_path()

    # Check if the file already exists
    if not os.path.exists(log_file_path):
        # Create the file with the header
        with open(log_file_path, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['question', 'response', 'time_taken', 'session_id'])

    # Log the query, answer, and time taken in a CSV file
    with open(log_file_path, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([question, response, time_taken, session_id])
    
    # After logging the query, add CSVs to vector database
    add_csv_to_vectordb()
