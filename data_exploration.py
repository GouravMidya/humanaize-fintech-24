# -*- coding: utf-8 -*-
"""
Created on Thu Jun  6 09:39:55 2024

@author: gourav
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
#%% Load the CSV file into a DataFrame
file_path = 'data\CountyMortgagesPercent-30-89DaysLate-thru-2023-03.csv'
df = pd.read_csv(file_path)
#%% Display the first few rows of the DataFrame
print("First 5 rows of the dataset:")
print(df.head())
head = df.head()
#%% Display general information about the DataFrame
print("\nGeneral Information:")
print(df.info())

# Display summary statistics for numerical columns
print("\nSummary Statistics:")
print(df.describe())
summary = df.describe()

# Check for missing values
print("\nMissing Values:")
print(df.isnull().sum())
#%% Visualize missing values using a heatmap
plt.figure(figsize=(10, 6))
sns.heatmap(df.isnull(), cbar=False, cmap='viridis')
plt.title('Missing Values Heatmap')
plt.show()
#%% Visualize the distribution of a numerical column (replace 'column_name' with an actual column name)
numerical_column = 'column_name'
plt.figure(figsize=(10, 6))
sns.histplot(df[numerical_column], kde=True)
plt.title(f'Distribution of {numerical_column}')
plt.xlabel(numerical_column)
plt.ylabel('Frequency')
plt.show()
#%% Visualize the distribution of a categorical column (replace 'column_name' with an actual column name)
categorical_column = 'column_name'
plt.figure(figsize=(10, 6))
sns.countplot(x=df[categorical_column])
plt.title(f'Distribution of {categorical_column}')
plt.xlabel(categorical_column)
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.show()
#%% Generate a correlation heatmap for numerical columns
plt.figure(figsize=(12, 8))
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', linewidths=0.5)
plt.title('Correlation Heatmap')
plt.show()
#%% Visualize relationships between numerical columns using pairplot
sns.pairplot(df.select_dtypes(include=['number']))
plt.show()

#%% Columns in the dataset
columns = df.columns