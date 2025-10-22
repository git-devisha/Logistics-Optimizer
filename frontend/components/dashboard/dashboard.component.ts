import { Component, type OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PredictionFormComponent } from "../prediction-form/prediction-form.component";
import { ResultsComponent } from "../results/results.component";
import { LogisticsService } from "../../services/logistics.service";
import { LogisticsInput, PredictionResponse } from "../../models/prediction.model";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, PredictionFormComponent, ResultsComponent],
  template: `
    <div class="dashboard">
      <header class="header glass">
        <div class="header-content">
          <h1>Logistics Cost Optimizer</h1>
          <p>AI-powered insights to predict and optimize your logistics costs</p>
          <div class="status" [class.connected]="apiConnected" [class.disconnected]="!apiConnected">
            <span class="status-dot"></span>
            {{ apiConnected ? 'Backend Connected' : 'Backend Disconnected' }}
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="container glass card-3d">
          <app-prediction-form
            (onPredict)="handlePrediction($event)"
            [isLoading]="isLoading">
          </app-prediction-form>

          @if (prediction) {
            <app-results
              [prediction]="prediction"
              [input]="lastInput"
              [suggestions]="suggestions">
            </app-results>
          }

          @if (error) {
            <div class="error-message card-3d">
              <strong>Error:</strong> {{ error }}
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      /* ===== Background Layer ===== */
      .dashboard {
        min-height: 100vh;
        background: linear-gradient(#fbb1bd, #FFA5AB , #DA627D, #fbb1bd);
        display: flex;
        flex-direction: column;
        align-items: center;
        perspective: 1200px;
        overflow-x: hidden;
      }

      /* ===== Glassmorphism ===== */
      .glass {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(50px) saturate(150%);
        -webkit-backdrop-filter: blur(20px) saturate(150%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
        border-radius: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      /* ===== Header ===== */
      .header {
        width: 90%;
        margin-top: 40px;
        padding: 10px 20px;
        color: #450920;
        text-align: center;
        transform: translateZ(0);
      }

      .header-content h1 {
        margin: 0 0 10px 0;
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }

      .header-content p {
        font-size: 1.1rem;
        opacity: 0.9;
        margin-bottom: 20px;
      }

      .status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 20px;
        background: #FFA5AB;
        font-size: 0.95rem;
        box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.1);
      }

      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ff6b6b;
        box-shadow: 0 0 8px rgba(255, 107, 107, 0.7);
      }

      .status.connected .status-dot {
        background: #450920;
        box-shadow: 0 0 10px rgba(81, 207, 102, 0.9);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.2); }
      }

      /* ===== Main Container ===== */
      .main-content {
        width: 90%;
        max-width: 1300px;
        padding: 40px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        transform-style: preserve-3d;
      }

      .container {
        width: 100%;
        padding: 30px;
        margin-top: 20px;
      }

      /* ===== 3D Card Effect ===== */
      .card-3d {
        transform: translateZ(0);
        transition: transform 0.4s ease, box-shadow 0.4s ease;
      }


      /* ===== Error Message ===== */
      .error-message {
        background: rgba(255, 107, 107, 0.2);
        color: #fff;
        border: 1px solid rgba(255, 107, 107, 0.3);
        padding: 20px;
        border-radius: 16px;
        margin-top: 20px;
        animation: slideIn 0.4s ease-out;
        text-align: center;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* ===== Responsive ===== */
      @media (max-width: 768px) {
        .header-content h1 {
          font-size: 2rem;
        }
        .container {
          padding: 20px;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  prediction: number | null = null;
  lastInput: LogisticsInput | null = null;
  suggestions: any[] = [];
  isLoading = false;
  error: string | null = null;
  apiConnected = false;

  constructor(private logisticsService: LogisticsService) {}

  ngOnInit() {
    this.checkApiConnection();
  }

  checkApiConnection() {
    this.logisticsService.checkApiStatus().subscribe({
      next: () => {
        this.apiConnected = true;
      },
      error: () => {
        this.apiConnected = false;
        this.error = "Backend API is not running. Please start the Flask server.";
      },
    });
  }

  handlePrediction(input: LogisticsInput) {
    this.isLoading = true;
    this.error = null;

    this.logisticsService.predictDemand(input).subscribe({
      next: (response: PredictionResponse) => {
        this.prediction = response.predicted_demand;
        this.lastInput = input;
        this.suggestions = this.logisticsService.generateOptimizationSuggestions(
          response.predicted_demand,
          input
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      },
    });
  }
}
