import { getMarketSummary } from './gemini';
import { webSocketService } from './websocket';
import { Stock, MutualFund, BotLog, OverlapResult, Index } from '../types';

// Start the real-time data feed simulation
webSocketService.connect();

// API base URL
const API_BASE_URL = 'http://localhost:3000';

// Helper function for API requests
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
};

// --- API Functions ---

export const getFunds = (): Promise<MutualFund[]> => apiRequest<MutualFund[]>('/funds');
export const getStocks = (): Promise<Stock[]> => apiRequest<Stock[]>('/stocks');
export const getIndices = (): Promise<Index[]> => apiRequest<Index[]>('/indices');

export const getHoldingsForStock = (stockId: string): Promise<{ fundName: string; amc: string; percentage: number }[]> => {
  return apiRequest<{ fundName: string; amc: string; percentage: number }[]>(`/funds/holdings/${stockId}`);
};

export const compareFunds = (fund1Id: string, fund2Id: string): Promise<OverlapResult> => {
  return apiRequest<OverlapResult>('/funds/compare', {
    method: 'POST',
    body: JSON.stringify({ fund1Id, fund2Id }),
  });
};

export const login = async (username: string, password: string): Promise<string> => {
  try {
    const response = await apiRequest<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return response.token;
  } catch (error) {
    throw new Error('Invalid username or password.');
  }
};

export const getBotLogs = (): Promise<{ logs: BotLog[]; lastUpdated: {[key: string]: string} }> => {
  return apiRequest<{ logs: BotLog[]; lastUpdated: {[key: string]: string} }>('/bots/logs');
};

export const runBot = async (botId: string, botName: string): Promise<BotLog> => {
  return apiRequest<BotLog>(`/bots/${botId}/run`, {
    method: 'POST',
    body: JSON.stringify({ botName }),
  });
};

export const uploadCsv = async (file: File): Promise<void> => {
  // In a real implementation, this would upload the file to the backend
  // For now, we'll simulate a successful upload
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file.name.endsWith('.csv')) {
        // In a real implementation, this would be handled by the backend
        resolve();
      } else {
        reject(new Error("Upload failed. Invalid file format."));
      }
    }, 1500);
  });
};
