import pandas as pd
from typing import Dict, List

def validate_input(data: Dict) -> tuple[bool, str]:
    """Validate input data"""
    required_fields = [
        'hour', 'day_of_week', 'month', 'warehouse_inventory_level',
        'shipping_costs', 'supplier_reliability_score', 'lead_time_days',
        'traffic_congestion_level', 'weather_condition_severity',
        'risk_classification'
    ]
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Validate ranges
    if not (0 <= data['hour'] <= 23):
        return False, "Hour must be between 0 and 23"
    
    if not (0 <= data['day_of_week'] <= 6):
        return False, "Day of week must be between 0 and 6"
    
    if not (1 <= data['month'] <= 12):
        return False, "Month must be between 1 and 12"
    
    if data['warehouse_inventory_level'] < 0:
        return False, "Warehouse inventory level cannot be negative"
    
    if data['shipping_costs'] < 0:
        return False, "Shipping costs cannot be negative"
    
    if not (0 <= data['supplier_reliability_score'] <= 1):
        return False, "Supplier reliability score must be between 0 and 1"
    
    if data['lead_time_days'] < 0:
        return False, "Lead time days cannot be negative"
    
    if not (0 <= data['traffic_congestion_level'] <= 1):
        return False, "Traffic congestion level must be between 0 and 1"
    
    if not (0 <= data['weather_condition_severity'] <= 1):
        return False, "Weather condition severity must be between 0 and 1"
    
    if not (0 <= data['risk_classification'] <= 3):
        return False, "Risk classification must be between 0 and 3"
    
    return True, "Valid"

def prepare_prediction_data(data: Dict, feature_order: List[str]) -> pd.DataFrame:
    """Prepare data for prediction"""
    df = pd.DataFrame([data])
    return df[feature_order]

def calculate_cost_impact(prediction: float, input_data: Dict) -> Dict:
    """Calculate cost impact based on prediction"""
    base_cost = input_data['shipping_costs']
    inventory_cost = input_data['warehouse_inventory_level'] * 0.5
    lead_time_cost = input_data['lead_time_days'] * 50
    
    total_cost = base_cost + inventory_cost + lead_time_cost
    cost_per_unit = total_cost / max(prediction, 1)
    
    return {
        'base_cost': round(base_cost, 2),
        'inventory_cost': round(inventory_cost, 2),
        'lead_time_cost': round(lead_time_cost, 2),
        'total_cost': round(total_cost, 2),
        'cost_per_unit': round(cost_per_unit, 2)
    }
