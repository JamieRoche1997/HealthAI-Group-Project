import json
from flask import Flask, jsonify, request
import tensorflow as tf
import numpy as np
import traceback

app = Flask(__name__)

# Load the pre-trained model
model = tf.saved_model.load('saved_model')


def predict(input_data):
    try:
        # Convert input data to a NumPy array with a format suitable for the model
        input_array = np.array(input_data, dtype=np.float32)

        # Make prediction
        predictions = model.predict(input_array)

        # Determine the predicted risk level
        predicted_class = np.argmax(predictions, axis=1)
        if predicted_class == 0:
            risk_level = "Low"
        elif predicted_class == 1:
            risk_level = "Medium"
        else:
            risk_level = "High"

        # Format the predictions
        result = {"predictions": predictions.tolist(), "predicted_risk_level": risk_level}

        return result

    except Exception as e:
        return {"error": str(e)}


@app.route('/predict', methods=['POST'])
def lambda_handler():
    try:
        # Get JSON data from the Flask 'request' object
        input_data = request.get_json().get("data")

        if input_data is None:
            return jsonify({"error": "No 'data' field found in the input event."})

        # Invoke the prediction function
        prediction_result = predict(input_data)

        return {
            'statusCode': 200,
            'body': json.dumps(prediction_result)
        }

    except Exception as e:
        print("Error occurred:", str(e))
        traceback.print_exc()
        return {
            'statusCode': 500,
            'body': json.dumps({"error": str(e)})
        }


if __name__ == '__main__':
    app.run(debug=True)
