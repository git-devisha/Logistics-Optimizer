import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import  { LogisticsInput, PredictionResponse } from "../models/prediction.model"

@Injectable({
  providedIn: "root",
})
export class LogisticsService {
  private apiUrl = "http://localhost:5000/api"

  constructor(private http: HttpClient) {}

  predictDemand(input: LogisticsInput): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${this.apiUrl}/predict_demand`, input).pipe(
      catchError((error) => {
        console.error("Prediction error:", error)
        return throwError(() => new Error("Failed to get prediction. Ensure the backend is running."))
      }),
    )
  }

  checkApiStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`).pipe(
      catchError((error) => {
        console.error("Status check error:", error)
        return throwError(() => new Error("Backend API is not available"))
      }),
    )
  }

  generateOptimizationSuggestions(prediction: number, input: LogisticsInput): any[] {
    const suggestions = []

    // Inventory optimization
    if (input.warehouse_inventory_level > 1000) {
      suggestions.push({
        category: "Inventory Management",
        suggestion: "Reduce warehouse inventory levels to decrease storage costs",
        potentialSavings: (input.warehouse_inventory_level - 800) * 0.5,
        priority: "high",
      })
    }

    // Shipping cost optimization
    if (input.shipping_costs > 500) {
      suggestions.push({
        category: "Shipping Optimization",
        suggestion: "Consolidate shipments or negotiate better rates with carriers",
        potentialSavings: input.shipping_costs * 0.15,
        priority: "high",
      })
    }

    // Supplier reliability
    if (input.supplier_reliability_score < 0.7) {
      suggestions.push({
        category: "Supplier Management",
        suggestion: "Diversify suppliers to improve reliability and reduce risk",
        potentialSavings: prediction * 0.1,
        priority: "medium",
      })
    }

    // Lead time optimization
    if (input.lead_time_days > 7) {
      suggestions.push({
        category: "Lead Time Reduction",
        suggestion: "Implement just-in-time inventory to reduce lead time",
        potentialSavings: input.lead_time_days * 50,
        priority: "medium",
      })
    }

    // Traffic and weather considerations
    if (input.traffic_congestion_level > 0.6 || input.weather_condition_severity > 0.5) {
      suggestions.push({
        category: "Route Optimization",
        suggestion: "Use AI-powered route planning to avoid congestion and weather delays",
        potentialSavings: prediction * 0.08,
        priority: "low",
      })
    }

    return suggestions
  }
}
