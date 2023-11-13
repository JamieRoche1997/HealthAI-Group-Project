import requests

# Define the URL of your Flask API
url = 'http://127.0.0.1:5000/predict'  # Replace with the actual URL

# Define the JSON data you want to send
data = {"data": [[27,2,3,1,4,2,3,2,3,3,2,2,4,2,2,2,3,4,1,5,2,6,2]]}

# Send a POST request with the JSON data
response = requests.post(url, json=data)

# Print the response
print(response.status_code)
print(response.json())
