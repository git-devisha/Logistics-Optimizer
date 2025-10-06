import subprocess
import os

def run_script(script_path):
    """Executes a Python script using the subprocess module."""
    print(f"\n=======================================================")
    print(f"EXECUTING: {script_path}")
    print(f"=======================================================")
    
    # Execute the script and capture the output
    try:
        # Use python to execute the script
        result = subprocess.run(
            ['python', script_path], 
            capture_output=True, 
            text=True, 
            check=True
        )
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"ERROR: Script failed with return code {e.returncode}")
        print(f"STDOUT:\n{e.stdout}")
        print(f"STDERR:\n{e.stderr}")
    except FileNotFoundError:
        print(f"ERROR: Python interpreter not found. Ensure Python is in your PATH.")


if __name__ == '__main__':
    # --- Logistics Optimization Project ---
    
    # 1. Demand Forecasting (Inventory Management & Planning)
    demand_script = os.path.join('scripts', 'demand_forecasting.py')
    run_script(demand_script)
    
    # 2. Risk Classification (Supply Chain Management) - Placeholder
    # You would create a similar script here, e.g., 'risk_prediction.py', 
    # to predict 'risk_classification' using a RandomForestClassifier.
    # run_script('scripts/risk_prediction.py')
    
    # 3. Cost/Efficiency Prediction (Cost Reduction) - Placeholder
    # You would create a similar script here, e.g., 'cost_prediction.py', 
    # to predict 'shipping_costs' using a LinearRegression or GradientBoostingRegressor.
    # run_script('scripts/cost_prediction.py')
    
    print("\n--- Project Execution Complete ---")
    print("The trained model 'demand_forecaster_model.pkl' is saved in the 'models/' directory.")