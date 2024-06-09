# -*- coding: utf-8 -*-
"""
Created on Fri Jun  7 10:14:45 2024

@author: goura
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_wikipedia(url):
    # Send a request to the Wikipedia page
    response = requests.get(url)
    
    # Parse the page content
    soup = BeautifulSoup(response.content, 'html.parser')
    
    print(soup)
    # Extract the title of the page
    title = soup.find('h1', {'id': 'firstHeading'}).get_text()
    
    # Extract the main content of the page
    content = []
    for paragraph in soup.find_all('p'):
        content.append(paragraph.get_text())
    
    # Join the content into a single string
    content_text = '\n'.join(content)
    
    return title, content_text

# URL of the Wikipedia page
url = "https://en.wikipedia.org/wiki/Personal_finance"

# Scrape the Wikipedia page
title, content = scrape_wikipedia(url)

# Save the content to a CSV file
df = pd.DataFrame({'Title': [title], 'Content': [content]})
df.to_csv('data/wikipedia_personal_finance.csv', index=False)

print(f"Scraped content from '{title}' and saved to 'wikipedia_personal_finance.csv'")
