#%%
import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt

def get_market_data():
    indices = ['^GSPC', '^DJI', '^IXIC', '^FTSE', '^N225', '^GDAXI','NSEI']
    # Fetch data for the last 5 days
    data = yf.download(indices, period="5d")
    return data['Close']

def calculate_daily_change(data):
    # Calculate percentage change between the last two available days
    return ((data.iloc[-1] - data.iloc[-2]) / data.iloc[-2]) * 100

def perform_sentiment_analysis(changes):
    sentiments = {}
    for index, change in changes.items():
        if change > 1:  # 1% increase
            sentiment = 'positive'
        elif change < -1:  # 1% decrease
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        sentiments[index] = sentiment
    return sentiments

def visualize_results(changes, sentiments):
    plt.figure(figsize=(12, 6))
    plt.bar(changes.index, changes)
    plt.title('Daily Changes in Major Stock Indices')
    plt.xlabel('Index')
    plt.ylabel('Percentage Change')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

    for index, change in changes.items():
        sentiment = sentiments[index]
        print(f"{index}: {change:.2f}% - {sentiment}")

#%%
data = get_market_data()
#%%
changes = calculate_daily_change(data)
#%%
sentiments = perform_sentiment_analysis(changes)
#%%
visualize_results(changes, sentiments)
