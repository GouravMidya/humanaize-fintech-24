#%%
import os
from dev.utils.file_mover import move_files
from dotenv import load_dotenv
import pandas as pd
import requests
import shutil

load_dotenv()
folder_path = os.getenv("folder_path")
loading_folder_path = folder_path+"/data/active/csvs/questions/"

for filename in os.listdir(loading_folder_path):
    if filename.endswith('.csv'):
        print(f"Processing {filename}...")
        csv_path = os.path.join(loading_folder_path, filename)
        df = pd.read_csv(csv_path)
        questions = df['Question']
        for question in questions:
            url = 'http://localhost:8000/api/query'
            payload = {'query': question, 'sessionId': "abc123"}
            headers = {'Content-Type': 'application/json'}  # Set the appropriate content type
            response = requests.post(url, json=payload, headers=headers)
            print(response)
        shutil.move(folder_path+"/data/active/csvs/questions/"+filename, folder_path+"/data/archieve/csvs/questions/"+filename)
        print(f"{filename} processed succesffuly and moved to archieves")
            
            

                
            