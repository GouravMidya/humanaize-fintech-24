import requests
from bs4 import BeautifulSoup

#%% fetching
url = "https://www.fidelity.com/learning-center/personal-finance/saving-and-budgeting-money"
response = requests.get(url)
print(response.status_code)
soup = BeautifulSoup(response.content, 'html.parser')
print(soup.prettify())


#%% arranging data
links = soup.find_all('div',class="pvd-grid__item pvd-grid__item--column-span-3 slider-tile")

print(links.length)


#%% investopedia

url = "https://www.investopedia.com/financial-advice-4427760"

response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')
print(soup)