import os

class Config:
    """Base configuration"""
    DEBUG = False
    TESTING = False
    MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'demand_forecaster_model.pkl')
    
    FEATURE_ORDER = [
        'hour', 'day_of_week', 'month', 'warehouse_inventory_level',
        'shipping_costs', 'supplier_reliability_score', 'lead_time_days',
        'traffic_congestion_level', 'weather_condition_severity',
        'risk_classification'
    ]

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
