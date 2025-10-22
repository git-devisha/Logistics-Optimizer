import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"

export interface PredictionHistory {
  timestamp: Date
  prediction: number
  inputData: any
  suggestions: number
}

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  private history = new BehaviorSubject<PredictionHistory[]>([])
  public history$ = this.history.asObservable()

  constructor() {
    this.loadHistory()
  }

  addPrediction(prediction: number, inputData: any, suggestionsCount: number) {
    const current = this.history.value
    const newEntry: PredictionHistory = {
      timestamp: new Date(),
      prediction,
      inputData,
      suggestions: suggestionsCount,
    }

    const updated = [newEntry, ...current].slice(0, 50) // Keep last 50
    this.history.next(updated)
    this.saveHistory(updated)
  }

  getHistory(): Observable<PredictionHistory[]> {
    return this.history$
  }

  clearHistory() {
    this.history.next([])
    localStorage.removeItem("predictionHistory")
  }

  private saveHistory(history: PredictionHistory[]) {
    localStorage.setItem("predictionHistory", JSON.stringify(history))
  }

  private loadHistory() {
    const saved = localStorage.getItem("predictionHistory")
    if (saved) {
      try {
        this.history.next(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load history:", e)
      }
    }
  }

  getAverageOptimizationPotential(): number {
    const history = this.history.value
    if (history.length === 0) return 0
    const total = history.reduce((sum, h) => sum + h.suggestions, 0)
    return total / history.length
  }

  getTotalPredictions(): number {
    return this.history.value.length
  }
}
