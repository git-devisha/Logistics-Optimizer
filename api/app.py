import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# --- Configuration ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'demand_forecaster_model.pkl')

FEATURE_ORDER = [
    'hour', 'day_of_week', 'month', 'warehouse_inventory_level', 
    'shipping_costs', 'supplier_reliability_score', 'lead_time_days',
    'traffic_congestion_level', 'weather_condition_severity',
    'risk_classification'
]

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)

# --- Model Loading ---
try:
    model = joblib.load(MODEL_PATH)
    print(f"Model loaded successfully from: {MODEL_PATH}")
except FileNotFoundError:
    print(f"ERROR: Model file not found at {MODEL_PATH}. Run demand_forecasting.py first.")
    model = None
except Exception as e:
    print(f"An error occurred loading the model: {e}")
    model = None

@app.route('/api/predict_demand', methods=['POST'])
def predict_demand():
    """Accepts logistics features and returns predicted demand."""
    if model is None:
        return jsonify({'error': 'Model not loaded.'}), 500

    try:
        data = request.get_json(force=True)
        input_df = pd.DataFrame([data])
        input_df = input_df[FEATURE_ORDER] 
        prediction = model.predict(input_df)

        return jsonify({
            'predicted_demand': round(float(prediction[0]), 2),
            'status': 'success'
        })

    except KeyError as e:
        return jsonify({'error': f'Missing required feature: {e}. Check feature names.'}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {e}'}), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Simple endpoint to check API status."""
    return jsonify({'status': 'API is running', 'model_loaded': model is not None})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
