export interface LogisticsInput {
  hour: number
  day_of_week: number
  month: number
  warehouse_inventory_level: number
  shipping_costs: number
  supplier_reliability_score: number
  lead_time_days: number
  traffic_congestion_level: number
  weather_condition_severity: number
  risk_classification: number
}

export interface PredictionResponse {
  predicted_demand: number
  status: string
  error?: string
}

export interface OptimizationSuggestion {
  category: string
  suggestion: string
  potentialSavings: number
  priority: "high" | "medium" | "low"
}
