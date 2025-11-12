export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  market_cap: number;
  sector: string;
  price_change_direction?: 'up' | 'down' | 'none';
}

export interface MutualFund {
  id: string;
  name: string;
  amc: string;
  category: string;
}

export interface FundHolding {
  fund_id: string;
  stock_id: string;
  percentage: number;
}

export interface Index {
  id: string;
  name: string;
  value: number;
  change: number;
  percent_change: number;
}

export interface OverlapResult {
  overlappingStocks: {
    stock: Stock;
    percentage1: number;
    percentage2: number;
  }[];
  totalOverlapPercentage1: number;
  totalOverlapPercentage2: number;
  fund1Name: string;
  fund2Name: string;
}

export interface BotLog {
  id: string;
  botName: string;
  status: 'Success' | 'Failure' | 'In Progress';
  executionTime: number; // in seconds
  timestamp: string; // ISO string
  result?: string; // Optional field for API responses
}
