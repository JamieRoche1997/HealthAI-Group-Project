import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# Load datasets
# Replace 'heart.csv', 'lung.csv', and 'breast_cleaned.csv' with your actual file names
df_heart = pd.read_csv('heart.csv')
df_lung = pd.read_csv('lung.csv')
df_breast = pd.read_csv('breast.csv')  # Use the cleaned dataset

# Train RandomForestClassifier for heart disease
X_heart = df_heart.drop('target', axis=1)
y_heart = df_heart['target']
X_train_heart, X_test_heart, y_train_heart, y_test_heart = train_test_split(X_heart, y_heart, test_size=0.2,
                                                                            random_state=42)
model_heart = RandomForestClassifier(random_state=42)
model_heart.fit(X_train_heart, y_train_heart)
y_pred_heart = model_heart.predict(X_test_heart)
accuracy_heart = accuracy_score(y_test_heart, y_pred_heart)
print("RandomForestClassifier for heart disease trained successfully.")
print(f"Heart Disease Accuracy: {accuracy_heart:.2f}")

# Save the trained heart disease model
joblib.dump(model_heart, 'model_heart.joblib')

# Train RandomForestClassifier for lung cancer
X_lung = df_lung.drop('Level', axis=1)
y_lung = df_lung['Level']
X_train_lung, X_test_lung, y_train_lung, y_test_lung = train_test_split(X_lung, y_lung, test_size=0.2, random_state=42)
model_lung = RandomForestClassifier(random_state=42)
model_lung.fit(X_train_lung, y_train_lung)
y_pred_lung = model_lung.predict(X_test_lung)
accuracy_lung = accuracy_score(y_test_lung, y_pred_lung)
print("RandomForestClassifier for lung cancer trained successfully.")
print(f"Lung Cancer Accuracy: {accuracy_lung:.2f}")

# Save the trained lung cancer model
joblib.dump(model_lung, 'model_lung.joblib')

# Train RandomForestClassifier for breast cancer
X_breast = df_breast.drop(['id', 'diagnosis', 'Unnamed: 32'], axis=1)
y_breast = df_breast['diagnosis'].map({'M': 1, 'B': 0})
X_train_breast, X_test_breast, y_train_breast, y_test_breast = train_test_split(X_breast, y_breast, test_size=0.2,
                                                                                random_state=42)

print("Feature names:", X_train_breast.columns)

# Identify numeric and categorical columns
numeric_cols = X_train_breast.select_dtypes(include=['number']).columns
categorical_cols = X_train_breast.select_dtypes(include=['object']).columns

# Create transformers
numeric_transformer = SimpleImputer(strategy='mean')
categorical_transformer = SimpleImputer(strategy='most_frequent')

# Combine transformers into a preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_cols),
        ('cat', categorical_transformer, categorical_cols)
    ])

# Create and train the model pipeline
model_breast = Pipeline(steps=[('preprocessor', preprocessor),
                               ('classifier', RandomForestClassifier(random_state=42))])

model_breast.fit(X_train_breast, y_train_breast)
y_pred_breast = model_breast.predict(X_test_breast)
accuracy_breast = accuracy_score(y_test_breast, y_pred_breast)
print("RandomForestClassifier for breast cancer trained successfully.")
print(f"Breast Cancer Accuracy: {accuracy_breast:.2f}")

# Save the trained breast cancer model
joblib.dump(model_breast, 'model_breast.joblib')
