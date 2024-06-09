import requests
from bs4 import BeautifulSoup
import pandas as pd
#%%
def scrape_investopedia():
    articles = []
    url = "https://www.investopedia.com/financial-advice-4427760"
    
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    print(soup)
#%%
    
    links = soup.find_all('a', class_='comp mntl-card-list-items mntl-document-card mntl-card card card--no-image')
    print(links)
    # Assuming articles are in <a> tags with a specific class
    for link in links:
        article_url = link.get('href')
        article_title = link.get_text(strip=True)
        article_response = requests.get(article_url)
        article_soup = BeautifulSoup(article_response.content, 'html.parser')
        article_content = " ".join(p.get_text(strip=True) for p in article_soup.find_all('p'))
        articles.append([article_title, article_content])
    
    return articles

def scrape_finra():
    articles = []
    url = "https://www.finra.org/investors"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Assuming articles are in <a> tags with a specific class
    for link in soup.find_all('a', class_='finra-article-link'):
        article_url = link.get('href')
        article_title = link.get_text(strip=True)
        article_response = requests.get(f"https://www.finra.org{article_url}")
        article_soup = BeautifulSoup(article_response.content, 'html.parser')
        article_content = " ".join(p.get_text(strip=True) for p in article_soup.find_all('p'))
        articles.append([article_title, article_content])
    
    return articles

def scrape_sec():
    articles = []
    url = "https://www.sec.gov/news/press-releases"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Assuming articles are in <a> tags with a specific class
    for link in soup.find_all('a', class_='article-link'):
        article_url = f"https://www.sec.gov{link.get('href')}"
        article_title = link.get_text(strip=True)
        article_response = requests.get(article_url)
        article_soup = BeautifulSoup(article_response.content, 'html.parser')
        article_content = " ".join(p.get_text(strip=True) for p in article_soup.find_all('p'))
        articles.append([article_title, article_content])
    
    return articles

def scrape_federal_reserve():
    articles = []
    url = "https://www.federalreserve.gov/newsevents/pressreleases.htm"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Assuming articles are in <a> tags with a specific class
    for link in soup.find_all('a', class_='article-link'):
        article_url = f"https://www.federalreserve.gov{link.get('href')}"
        article_title = link.get_text(strip=True)
        article_response = requests.get(article_url)
        article_soup = BeautifulSoup(article_response.content, 'html.parser')
        article_content = " ".join(p.get_text(strip=True) for p in article_soup.find_all('p'))
        articles.append([article_title, article_content])
    
    return articles
#%%
# Combine all articles
all_articles = []
all_articles.extend(scrape_investopedia())
# all_articles.extend(scrape_finra())
# all_articles.extend(scrape_sec())
# all_articles.extend(scrape_federal_reserve())

#%%
print(all_articles)
# Save to CSV
df = pd.DataFrame(all_articles, columns=['Title', 'Content'])
df.to_csv('data/financial_articles.csv', index=False)
