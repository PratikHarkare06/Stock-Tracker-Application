import { Stock } from '../types';
import { db } from './database';

type WebSocketListener = (data: Stock) => void;

class WebSocketService {
  private listeners: Set<WebSocketListener> = new Set();
  private intervalId: number | null = null;
  private updateInterval = 3000; // 3 seconds

  public connect() {
    if (this.intervalId) {
      return; // Already connected
    }
    console.log('WebSocket service connected.');
    this.intervalId = window.setInterval(() => {
      const updatedStock = db.updateRandomStockPrice();
      this.notifyListeners(updatedStock);
    }, this.updateInterval);
  }

  public disconnect() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('WebSocket service disconnected.');
    }
  }

  public subscribe(callback: WebSocketListener) {
    this.listeners.add(callback);
  }

  public unsubscribe(callback: WebSocketListener) {
    this.listeners.delete(callback);
  }

  private notifyListeners(data: Stock) {
    this.listeners.forEach(listener => listener(data));
  }
}

export const webSocketService = new WebSocketService();
