#%%
import os
from dev.utils.file_mover import move_files
from dotenv import load_dotenv
import pandas as pd
import requests

load_dotenv()
folder_path = os.getenv("folder_path")
loading_folder_path = folder_path+"/data/active/csvs/questions/"

for filename in os.listdir(loading_folder_path):
    if filename.endswith('.csv'):
        csv_path = os.path.join(loading_folder_path, filename)
        df = pd.read_csv(csv_path)
        questions = df['Question']
        for question in questions:
            url = 'http://localhost:8000/api/query'
            payload = {'query': question, 'sessionId': "abc123"}
            headers = {'Content-Type': 'application/json'}  # Set the appropriate content type
            response = requests.post(url, json=payload, headers=headers)
            print(response)
            
move_files(folder_path+"/data/active/csvs/questions/",folder_path+"/data/archieve/csvs/questions/","csv")

                
            