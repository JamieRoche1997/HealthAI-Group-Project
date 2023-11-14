import requests

# Define the URL of your Flask API
url = 'http://127.0.0.1:5000/predict_heart'  # Replace with the actual URL

# Define the JSON data you want to send
data = {"data": [52, 1, 0, 125, 212, 0, 1, 168, 0, 1, 2, 2, 3]}

# Send a POST request with the JSON data
response = requests.post(url, json=data)

# Print the response
print(response.status_code)
print(response.json())
