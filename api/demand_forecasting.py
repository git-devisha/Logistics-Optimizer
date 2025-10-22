import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Create sample training data
np.random.seed(42)
n_samples = 1000

data = {
    'hour': np.random.randint(0, 24, n_samples),
    'day_of_week': np.random.randint(0, 7, n_samples),
    'month': np.random.randint(1, 13, n_samples),
    'warehouse_inventory_level': np.random.randint(100, 2000, n_samples),
    'shipping_costs': np.random.uniform(50, 1000, n_samples),
    'supplier_reliability_score': np.random.uniform(0.5, 1.0, n_samples),
    'lead_time_days': np.random.randint(1, 15, n_samples),
    'traffic_congestion_level': np.random.uniform(0, 1, n_samples),
    'weather_condition_severity': np.random.uniform(0, 1, n_samples),
    'risk_classification': np.random.randint(0, 4, n_samples),
}

df = pd.DataFrame(data)

# Generate target variable (demand) based on features
df['demand'] = (
    df['hour'] * 10 +
    df['day_of_week'] * 15 +
    df['month'] * 5 +
    df['warehouse_inventory_level'] * 0.5 +
    df['shipping_costs'] * 0.3 +
    df['supplier_reliability_score'] * 100 +
    df['lead_time_days'] * 20 +
    df['traffic_congestion_level'] * 50 +
    df['weather_condition_severity'] * 30 +
    df['risk_classification'] * 25 +
    np.random.normal(0, 50, n_samples)
)

# Prepare features and target
feature_columns = [
    'hour', 'day_of_week', 'month', 'warehouse_inventory_level',
    'shipping_costs', 'supplier_reliability_score', 'lead_time_days',
    'traffic_congestion_level', 'weather_condition_severity',
    'risk_classification'
]

X = df[feature_columns]
y = df['demand']

# Train model
print("Training Random Forest model...")
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X, y)

# Save model
models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
os.makedirs(models_dir, exist_ok=True)

model_path = os.path.join(models_dir, 'demand_forecaster_model.pkl')
joblib.dump(model, model_path)

print(f"Model trained and saved to: {model_path}")
print(f"Model R² Score: {model.score(X, y):.4f}")
print(f"Feature Importance:")
for feature, importance in zip(feature_columns, model.feature_importances_):
    print(f"  {feature}: {importance:.4f}")
