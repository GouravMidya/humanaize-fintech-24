# -*- coding: utf-8 -*-
"""
Created on Fri Jun  7 16:39:34 2024

@author: goura
"""
import PyPDF2
import re
import os

#%% extracting text from given pdf file path
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
    return text

#%% preprocessing the extracted text
def preprocess_text(text):
    # Remove excessive dots (.....)
    text = re.sub(r'\.{2,}', '', text)
    
    # Remove excessive whitespace (tabs, newlines, etc.)
    text = re.sub(r'\s+', ' ', text)
    
    # Normalize space around punctuation
    text = re.sub(r'\s*([.,;!?])\s*', r'\1 ', text)
    
    # Correct space around new sentences
    text = re.sub(r'(?<=[.?!])\s+(?=[a-zA-Z])', ' ', text)
    
    # Remove unwanted characters or patterns (e.g., table of contents numbers)
    text = re.sub(r'\d+\.\s+', '', text)
    
    # Remove trailing spaces
    text = text.strip()
    
    return text

#%% extracting text from data folder
def extract_texts_from_folder(folder_path):
    texts = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.pdf'):
            pdf_path = os.path.join(folder_path, filename)
            #print(pdf_path)
            try:
                text = extract_text_from_pdf(pdf_path)
                cleaned_text = preprocess_text(text)
                texts.append(cleaned_text)
            except Exception as e:
                print(f"Failed to process {filename}: {e}")
    return texts

#%% folder run
folder_path = 'data'
pdf_texts = extract_texts_from_folder(folder_path)

#%% Write preprocessed text to a text file
text_file_path = os.path.join(folder_path,"preprocessed_text.txt")
with open(text_file_path, 'w', encoding='utf-8') as file:
    for text in pdf_texts:
        file.write(text + '\n')


