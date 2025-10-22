import { Component, Output, EventEmitter, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import type { LogisticsInput } from "../../models/prediction.model"

@Component({
  selector: "app-prediction-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <h2>Enter Logistics Parameters</h2>
      
      <form (ngSubmit)="onSubmit()" class="form">
        <div class="form-grid">
          <!-- Time Parameters -->
          <div class="form-section">
            <h3>Time Parameters</h3>
            
            <div class="form-group">
              <label for="hour">Hour of Day (0-23)</label>
              <input 
                type="number" 
                id="hour"
                [(ngModel)]="formData.hour" 
                name="hour"
                min="0" 
                max="23"
                class="form-input">
              <span class="input-hint">{{ formData.hour }}</span>
            </div>

            <div class="form-group">
              <label for="day_of_week">Day of Week (0-6, 0=Monday)</label>
              <input 
                type="number" 
                id="day_of_week"
                [(ngModel)]="formData.day_of_week" 
                name="day_of_week"
                min="0" 
                max="6"
                class="form-input">
              <span class="input-hint">{{ getDayName(formData.day_of_week) }}</span>
            </div>

            <div class="form-group">
              <label for="month">Month (1-12)</label>
              <input 
                type="number" 
                id="month"
                [(ngModel)]="formData.month" 
                name="month"
                min="1" 
                max="12"
                class="form-input">
              <span class="input-hint">{{ getMonthName(formData.month) }}</span>
            </div>
          </div>

          <!-- Inventory & Costs -->
          <div class="form-section">
            <h3>Inventory & Costs</h3>
            
            <div class="form-group">
              <label for="warehouse_inventory">Warehouse Inventory Level</label>
              <input 
                type="number" 
                id="warehouse_inventory"
                [(ngModel)]="formData.warehouse_inventory_level" 
                name="warehouse_inventory_level"
                min="0"
                class="form-input">
              <span class="input-hint">Units: {{ formData.warehouse_inventory_level }}</span>
            </div>

            <div class="form-group">
              <label for="shipping_costs">Shipping Costs ($)</label>
              <input 
                type="number" 
                id="shipping_costs"
                [(ngModel)]="formData.shipping_costs" 
                name="shipping_costs"
                min="0"
                step="0.01"
                class="form-input">
              <span class="input-hint">{{ formData.shipping_costs.toFixed(2) }}</span>
            </div>

            <div class="form-group">
              <label for="lead_time">Lead Time (days)</label>
              <input 
                type="number" 
                id="lead_time"
                [(ngModel)]="formData.lead_time_days" 
                name="lead_time_days"
                min="0"
                class="form-input">
              <span class="input-hint">{{ formData.lead_time_days }} days</span>
            </div>
          </div>

          <!-- Reliability & Conditions -->
          <div class="form-section">
            <h3>Reliability & Conditions</h3>
            
            <div class="form-group">
              <label for="supplier_reliability">Supplier Reliability Score (0-1)</label>
              <input 
                type="number" 
                id="supplier_reliability"
                [(ngModel)]="formData.supplier_reliability_score" 
                name="supplier_reliability_score"
                min="0" 
                max="1"
                step="0.1"
                class="form-input">
              <span class="input-hint">{{ (formData.supplier_reliability_score * 100).toFixed(0) }}%</span>
            </div>

            <div class="form-group">
              <label for="traffic_congestion">Traffic Congestion Level (0-1)</label>
              <input 
                type="number" 
                id="traffic_congestion"
                [(ngModel)]="formData.traffic_congestion_level" 
                name="traffic_congestion_level"
                min="0" 
                max="1"
                step="0.1"
                class="form-input">
              <span class="input-hint">{{ (formData.traffic_congestion_level * 100).toFixed(0) }}%</span>
            </div>

            <div class="form-group">
              <label for="weather_severity">Weather Condition Severity (0-1)</label>
              <input 
                type="number" 
                id="weather_severity"
                [(ngModel)]="formData.weather_condition_severity" 
                name="weather_severity"
                min="0" 
                max="1"
                step="0.1"
                class="form-input">
              <span class="input-hint">{{ (formData.weather_condition_severity * 100).toFixed(0) }}%</span>
            </div>

            <div class="form-group">
              <label for="risk_classification">Risk Classification (0-3)</label>
              <input 
                type="number" 
                id="risk_classification"
                [(ngModel)]="formData.risk_classification" 
                name="risk_classification"
                min="0" 
                max="3"
                class="form-input">
              <span class="input-hint">{{ getRiskLevel(formData.risk_classification) }}</span>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          class="submit-btn"
          [disabled]="isLoading">
          {{ isLoading ? 'Predicting...' : 'Predict Demand & Costs' }}
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .form-container {
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
      }

      .form-container h2 {
        margin: 0 0 30px 0;
        color: #450920;
        font-size: 1.8rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-bottom: 30px;
      }

      .form-section h3 {
        margin: 0 0 20px 0;
        color: #450920;
        font-size: 1.1rem;
        border-bottom: 2px solid #667eea;
        padding-bottom: 10px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: #450920;
        font-weight: 500;
        font-size: 0.95rem;
      }

      .form-input {
        width: 100%;
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 6px;
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .form-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .input-hint {
        display: block;
        margin-top: 6px;
        font-size: 0.85rem;
        color: #999;
      }

      .submit-btn {
        width: 100%;
        padding: 14px;
        background: #720026;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
      }

      .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class PredictionFormComponent {
  @Output() onPredict = new EventEmitter<LogisticsInput>()
  @Input() isLoading = false

  formData: LogisticsInput = {
    hour: 12,
    day_of_week: 1,
    month: 6,
    warehouse_inventory_level: 500,
    shipping_costs: 250,
    supplier_reliability_score: 0.85,
    lead_time_days: 5,
    traffic_congestion_level: 0.4,
    weather_condition_severity: 0.2,
    risk_classification: 1,
  }

  onSubmit() {
    this.onPredict.emit(this.formData)
  }

  getDayName(day: number): string {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return days[day] || "Invalid"
  }

  getMonthName(month: number): string {
    const months = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[month] || "Invalid"
  }

  getRiskLevel(risk: number): string {
    const levels = ["Low", "Medium", "High", "Critical"]
    return levels[Math.floor(risk)] || "Unknown"
  }
}
