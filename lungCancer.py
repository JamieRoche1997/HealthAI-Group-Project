import pandas as pd
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Load the dataset without a header
data = pd.read_csv('cancer patient data sets.csv', header=None)

# Exclude the first two columns
X = data.iloc[:, 2:-1]

# Assign numerical values to 'Low,' 'Medium,' and 'High'
# You can assign 0, 1, and 2, respectively, to these classes
data['Level'] = data.iloc[:, -1].map({'Low': 0, 'Medium': 1, 'High': 2})

# The 'Level' column now contains numerical values
y = data['Level']

# Define and compile the neural network model
model = Sequential()
model.add(Dense(12, input_dim=X.shape[1], activation='relu'))
model.add(Dense(8, activation='relu'))
model.add(Dense(3, activation='softmax'))  # Use softmax activation for multiclass classification
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Train the model
model.fit(X, y, epochs=50, batch_size=10)
loss, accuracy = model.evaluate(X, y)
print(f'Test Loss: {loss:.4f}')
print(f'Test Accuracy: {accuracy:.4f}')
model.save('C:\\Users\\danie\\OneDrive - mycit.ie\\Year 3\\Group Project\\')