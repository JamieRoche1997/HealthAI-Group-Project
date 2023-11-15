from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the saved models
model_heart = joblib.load('model_heart.joblib')
model_lung = joblib.load('model_lung.joblib')
model_breast = joblib.load('model_breast.joblib')

# Sample feature names for breast cancer model, replace this with the correct order
feature_names_breast = ['radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean',
                        'smoothness_mean', 'compactness_mean', 'concavity_mean',
                        'concave_points_mean']

@app.route('/')
def home():
    return 'HealthAI Flask App'

# Define API endpoints for each model
@app.route('/predict_heart', methods=['POST'])
def predict_heart():
    data = request.get_json(force=True)
    prediction = model_heart.predict([data['data']])
    return jsonify({'prediction': int(prediction[0])})

@app.route('/predict_lung', methods=['POST'])
def predict_lung():
    data = request.get_json(force=True)
    prediction = model_lung.predict([data['data']])[0]
    return jsonify({'prediction': str(prediction[0])})

@app.route('/predict_breast', methods=['POST'])
def predict_breast():
    data = request.get_json(force=True)

    # Convert the input data into a DataFrame with specified feature names
    input_data = pd.DataFrame([data['data']], columns=feature_names_breast)

    # Make predictions
    prediction = model_breast.predict(input_data)

    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
