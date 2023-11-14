import pandas as pd

# Load the breast cancer dataset
df_breast = pd.read_csv('breast.csv')

# Display the count of NaN values in each column before cleaning
print("Number of NaN values in each column before cleaning:")
print(df_breast.isna().sum())

# Exclude non-numeric columns before filling NaN values
numeric_columns = df_breast.select_dtypes(include='number').columns
df_breast_cleaned = df_breast.copy()
df_breast_cleaned[numeric_columns] = df_breast[numeric_columns].fillna(df_breast[numeric_columns].mean())

# Display the count of NaN values in each column after cleaning
print("\nNumber of NaN values in each column after cleaning:")
print(df_breast_cleaned.isna().sum())

# Save the cleaned dataset to a new CSV file
df_breast_cleaned.to_csv('breast_cleaned.csv', index=False)

# Display the first few rows of the cleaned dataset
print("\nFirst few rows of the cleaned dataset:")
print(df_breast_cleaned.head())
