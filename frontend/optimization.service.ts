import { Injectable } from "@angular/core"
import type { LogisticsInput } from "../models/prediction.model"

@Injectable({
  providedIn: "root",
})
export class OptimizationService {
  constructor() {}

  generateOptimizations(prediction: number, input: LogisticsInput): any[] {
    const optimizations = []

    // Inventory optimization
    if (input.warehouse_inventory_level > 1000) {
      optimizations.push({
        id: "inventory-reduction",
        category: "Inventory Management",
        title: "Reduce Warehouse Inventory",
        description: "Your warehouse inventory is high. Consider implementing just-in-time inventory management.",
        suggestion: "Reduce warehouse inventory levels to decrease storage costs",
        potentialSavings: (input.warehouse_inventory_level - 800) * 0.5,
        priority: "high",
        impact: "Reduces storage costs and improves cash flow",
        implementation: "Coordinate with suppliers for more frequent, smaller shipments",
      })
    }

    // Shipping cost optimization
    if (input.shipping_costs > 500) {
      optimizations.push({
        id: "shipping-negotiation",
        category: "Shipping Optimization",
        title: "Negotiate Better Shipping Rates",
        description: "Your shipping costs are high. Consolidate shipments or negotiate with carriers.",
        suggestion: "Consolidate shipments or negotiate better rates with carriers",
        potentialSavings: input.shipping_costs * 0.15,
        priority: "high",
        impact: "Direct reduction in transportation costs",
        implementation: "Contact carriers for volume discounts or consolidate with other shippers",
      })
    }

    // Supplier reliability
    if (input.supplier_reliability_score < 0.7) {
      optimizations.push({
        id: "supplier-diversification",
        category: "Supplier Management",
        title: "Diversify Suppliers",
        description: "Low supplier reliability increases risk. Diversify your supplier base.",
        suggestion: "Diversify suppliers to improve reliability and reduce risk",
        potentialSavings: prediction * 0.1,
        priority: "medium",
        impact: "Reduces supply chain disruption risk",
        implementation: "Identify and qualify alternative suppliers in your region",
      })
    }

    // Lead time optimization
    if (input.lead_time_days > 7) {
      optimizations.push({
        id: "lead-time-reduction",
        category: "Lead Time Reduction",
        title: "Implement Just-in-Time Inventory",
        description: "Long lead times increase carrying costs. Reduce lead time through better planning.",
        suggestion: "Implement just-in-time inventory to reduce lead time",
        potentialSavings: input.lead_time_days * 50,
        priority: "medium",
        impact: "Reduces inventory holding costs",
        implementation: "Work with suppliers to establish faster delivery schedules",
      })
    }

    // Traffic and weather considerations
    if (input.traffic_congestion_level > 0.6 || input.weather_condition_severity > 0.5) {
      optimizations.push({
        id: "route-optimization",
        category: "Route Optimization",
        title: "Use AI-Powered Route Planning",
        description: "High traffic or weather impact. Use advanced route planning tools.",
        suggestion: "Use AI-powered route planning to avoid congestion and weather delays",
        potentialSavings: prediction * 0.08,
        priority: "low",
        impact: "Reduces delivery time and fuel costs",
        implementation: "Implement real-time traffic and weather monitoring systems",
      })
    }

    return optimizations
  }

  calculateROI(savings: number, implementationCost: number): number {
    if (implementationCost === 0) return 0
    return ((savings - implementationCost) / implementationCost) * 100
  }

  prioritizeOptimizations(optimizations: any[]): any[] {
    const priorityOrder = { high: 1, medium: 2, low: 3 }
    return optimizations.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.potentialSavings - a.potentialSavings
    })
  }
}
