import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { LogisticsInput } from "../../models/prediction.model"

@Component({
  selector: "app-results",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <div class="prediction-card">
        <h2>Prediction Results</h2>
        <div class="prediction-value">
          <span class="label">Predicted Demand</span>
          <span class="value">{{ prediction }} units</span>
        </div>
        <div class="prediction-details">
          <div class="detail-item">
            <span class="detail-label">Estimated Cost Impact</span>
            <!-- removed escaped quote from class attribute -->
            <span class="detail-value">{{ prediction * 0.8 }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Optimization Potential</span>
            <span class="detail-value">{{ calculateOptimizationPotential() }}%</span>
          </div>
        </div>
      </div>

      <div class="suggestions-container">
        <h2>Optimization Suggestions</h2>
        <!-- updated to use Angular 20 @if syntax -->
        <ng-container *ngIf="suggestions.length > 0; else noSuggestions">
          <div class="suggestions-grid">
            <!-- updated to use Angular 20 @for syntax -->
            <div *ngFor="let suggestion of suggestions; trackBy: trackByCategory" class="suggestion-card"
                 [ngClass]="{'high': suggestion.priority === 'high', 'medium': suggestion.priority === 'medium', 'low': suggestion.priority === 'low'}">
              <div class="suggestion-header">
                <h3>{{ suggestion.category }}</h3>
                <span class="priority-badge" [ngClass]="suggestion.priority">
                  {{ suggestion.priority.toUpperCase() }}
                </span>
              </div>
              <p class="suggestion-text">{{ suggestion.suggestion }}</p>
              <div class="suggestion-savings">
                <span class="savings-label">Potential Savings:</span>
                <!-- removed escaped quote from class attribute -->
                <span class="savings-value">{{ suggestion.potentialSavings }}</span>
              </div>
            </div>
          </div>
        </ng-container>
        <ng-template #noSuggestions>
          <div class="no-suggestions">
            <p>Your logistics parameters are already optimized!</p>
          </div>
        </ng-template>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Warehouse Inventory</span>
          <span class="metric-value">{{ input?.warehouse_inventory_level }}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Shipping Costs</span>
          <!-- removed escaped quote from class attribute -->
          <span class="metric-value">{{ input?.shipping_costs }}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Lead Time</span>
          <span class="metric-value">{{ input?.lead_time_days }} days</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Supplier Reliability</span>
          <span class="metric-value">{{ ((input?.supplier_reliability_score || 0) * 100) }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .results-container {
        animation: fadeIn 0.5s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .prediction-card {
        background: white;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border-left: 5px solid #450920;
      }

      .prediction-card h2 {
        margin: 0 0 20px 0;
        color: #450920;
        font-size: 1.5rem;
      }

      .prediction-value {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: #720026;
        border-radius: 8px;
        color: white;
        margin-bottom: 20px;
      }

      .prediction-value .label {
        font-size: 1rem;
        opacity: 0.9;
      }

      .prediction-value .value {
        font-size: 2rem;
        font-weight: 700;
      }

      .prediction-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 6px;
      }

      .detail-label {
        color: #720026;
        font-weight: 500;
      }

      .detail-value {
        color: #720026;
        font-weight: 700;
        font-size: 1.1rem;
      }

      .suggestions-container {
        margin-bottom: 30px;
      }

      .suggestions-container h2 {
        color: #720026;
        font-size: 1.5rem;
        margin-bottom: 20px;
      }

      .suggestions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .suggestion-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border-left: 5px solid #720026;
        transition: all 0.3s ease;
      }

      .suggestion-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
      }

      .suggestion-card.high {
        border-left-color: #450920;
      }

      .suggestion-card.medium {
        border-left-color: #DA627D;
      }

      .suggestion-card.low {
        border-left-color: #FFA5AB;
      }

      .suggestion-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .suggestion-header h3 {
        margin: 0;
        color: #450920;
        font-size: 1.1rem;
      }

      .priority-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
      }

      .priority-badge.high {
        background: #ff6b6b;
      }

      .priority-badge.medium {
        background: #ffd93d;
        color: #333;
      }

      .priority-badge.low {
        background: #51cf66;
      }

      .suggestion-text {
        color: black;
        margin: 0 0 15px 0;
        line-height: 1.5;
      }

      .suggestion-savings {
        display: flex;
        justify-content: space-between;
        padding-top: 15px;
        border-top: 1px solid #eee;
      }

      .savings-label {
        color: #999;
        font-size: 0.9rem;
      }

      .savings-value {
        color: #51cf66;
        font-weight: 700;
        font-size: 1.1rem;
      }

      .no-suggestions {
        background: white;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      }

      .no-suggestions p {
        color: #666;
        font-size: 1.1rem;
        margin: 0;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .metric-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .metric-label {
        color: #999;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .metric-value {
        color: #450920;
        font-size: 1.5rem;
        font-weight: 700;
      }
    `,
  ],
})
export class ResultsComponent {
  @Input() prediction = 0
  @Input() input: LogisticsInput | null = null
  @Input() suggestions: any[] = []

  calculateOptimizationPotential(): number {
    if (!this.input) return 0

    let potential = 0

    if (this.input.warehouse_inventory_level > 1000) potential += 15
    if (this.input.shipping_costs > 500) potential += 15
    if (this.input.supplier_reliability_score < 0.7) potential += 10
    if (this.input.lead_time_days > 7) potential += 10
    if (this.input.traffic_congestion_level > 0.6) potential += 10

    return Math.min(potential, 100)
  }

  trackByCategory(index: number, suggestion: any): string {
    return suggestion.category
  }
}
