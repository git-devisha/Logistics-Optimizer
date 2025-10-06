import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os
from datetime import datetime

# --- Configuration ---
DATA_PATH = os.path.join('data', 'training_data.csv')
MODEL_PATH = os.path.join('models', 'demand_forecaster_model.pkl')
TARGET_COLUMN = 'historical_demand'
RANDOM_STATE = 42

def load_data(file_path):
    """Loads and preprocesses the data."""
    print("Loading data...")
    df = pd.read_csv(file_path)
    
    # 1. Convert timestamp to datetime and extract time-based features
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek # Monday=0, Sunday=6
    df['month'] = df['timestamp'].dt.month
    
    feature_cols = [
        'hour', 'day_of_week', 'month',
        'warehouse_inventory_level', 
        'shipping_costs', 
        'supplier_reliability_score', 
        'lead_time_days',
        'traffic_congestion_level', 
        'weather_condition_severity',
        'risk_classification' # Categorical feature
    ]
    
    X = df[feature_cols]
    y = df[TARGET_COLUMN]
    
    return X, y

def train_and_evaluate_model(X, y):
    """Trains, evaluates, and saves the Demand Forecasting model."""
    print("Preparing data and model pipeline...")
    
    # Identify categorical and numerical features
    categorical_features = ['risk_classification']
    numerical_features = [col for col in X.columns if col not in categorical_features]
    
    # Create preprocessing steps
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough' # Keep all other numerical columns as is
    )
    
    # Create the full pipeline: Preprocessing -> Model
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE, n_jobs=-1))
    ])
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_STATE)
    
    # Train the model
    print("Training Random Forest Regressor for Demand Forecasting...")
    model.fit(X_train, y_train)
    
    # Make predictions and evaluate
    y_pred = model.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print("\n--- Model Evaluation Results ---")
    print(f"R-squared (R^2): {r2:.4f}")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    
    # Save the model
    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved successfully to {MODEL_PATH}")

def predict_new_demand(model, prediction_input):
    """
    Predicts demand for a new data sample using the trained model.

    This function takes a dictionary of raw features, processes them to
    match the model's expected input format, and returns the prediction.

    Args:
        model: The trained model pipeline.
        prediction_input (dict): A dictionary containing all the raw features
                                 required for the prediction. Must include a
                                 'timestamp' field in a format that can be
                                 converted to a datetime object.

    Returns:
        float: The predicted demand.
    """
    print("\n--- Predicting New Demand ---")
    
    # Convert the dictionary to a DataFrame
    df_predict = pd.DataFrame([prediction_input])
    
    # --- Feature Engineering for Prediction ---
    # 1. Convert timestamp and extract time-based features
    if 'timestamp' in df_predict.columns:
        df_predict['timestamp'] = pd.to_datetime(df_predict['timestamp'])
        df_predict['hour'] = df_predict['timestamp'].dt.hour
        df_predict['day_of_week'] = df_predict['timestamp'].dt.dayofweek
        df_predict['month'] = df_predict['timestamp'].dt.month
    else:
        # Handle cases where a timestamp might not be provided, if applicable
        # For this model, 'timestamp' is essential for time-based features.
        raise ValueError("Prediction input must contain a 'timestamp' field.")

    # 2. Ensure all required feature columns are present
    # This step is crucial if the model was trained on specific columns
    # The pipeline's ColumnTransformer will handle the one-hot encoding
    
    predicted_demand = model.predict(df_predict)
    
    print(f"Input features: {prediction_input}")
    print(f"Predicted Historical Demand: {predicted_demand[0]:.2f} units")
    
    return predicted_demand[0]


if __name__ == '__main__':
    # Ensure the models directory exists
    os.makedirs('models', exist_ok=True)
    
    # 1. Load Data
    X, y = load_data(DATA_PATH)
    
    # 2. Train, Evaluate, and Save Model
    train_and_evaluate_model(X, y)
    
    # 3. Load the saved model and test a prediction
    if os.path.exists(MODEL_PATH):
        saved_model = joblib.load(MODEL_PATH)
        
        # --- Example of a New Prediction ---
        # In a real-world application, this data would come from an API,
        # a user input form, or another data source.
        new_prediction_data = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'warehouse_inventory_level': 600.0,
            'shipping_costs': 350.0,
            'supplier_reliability_score': 0.98,
            'lead_time_days': 4.0,
            'traffic_congestion_level': 1.5,
            'weather_condition_severity': 0.0,
            'risk_classification': 'Low Risk'
        }
        
        predict_new_demand(saved_model, new_prediction_data)
