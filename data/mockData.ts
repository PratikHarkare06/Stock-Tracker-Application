
import { Stock, MutualFund, FundHolding, Index, BotLog } from '../types';

export const STOCKS: Stock[] = [
  { id: 's1', symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.50, market_cap: 1928000, sector: 'Energy' },
  { id: 's2', symbol: 'TCS', name: 'Tata Consultancy Services', price: 3850.75, market_cap: 1395000, sector: 'Technology' },
  { id: 's3', symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1680.20, market_cap: 1280000, sector: 'Finance' },
  { id: 's4', symbol: 'INFY', name: 'Infosys', price: 1650.00, market_cap: 685000, sector: 'Technology' },
  { id: 's5', symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1150.45, market_cap: 805000, sector: 'Finance' },
  { id: 's6', symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1380.10, market_cap: 780000, sector: 'Telecommunication' },
  { id: 's7', symbol: 'SBIN', name: 'State Bank of India', price: 835.60, market_cap: 745000, sector: 'Finance' },
  { id: 's8', symbol: 'LICI', name: 'Life Insurance Corporation', price: 980.00, market_cap: 620000, sector: 'Finance' },
  { id: 's9', symbol: 'ITC', name: 'ITC Limited', price: 430.25, market_cap: 537000, sector: 'Consumer Goods' },
  { id: 's10', symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2550.80, market_cap: 600000, sector: 'Consumer Goods' },
];

export const MUTUAL_FUNDS: MutualFund[] = [
  { id: 'mf1', name: 'SBI Bluechip Fund', amc: 'SBI', category: 'Large Cap' },
  { id: 'mf2', name: 'HDFC Flexi Cap Fund', amc: 'HDFC', category: 'Flexi Cap' },
  { id: 'mf3', name: 'ICICI Pru Bluechip Fund', amc: 'ICICI', category: 'Large Cap' },
  { id: 'mf4', name: 'Axis Long Term Equity', amc: 'Axis', category: 'ELSS' },
];

export const FUND_HOLDINGS: FundHolding[] = [
  // SBI Bluechip Fund
  { fund_id: 'mf1', stock_id: 's3', percentage: 9.5 },
  { fund_id: 'mf1', stock_id: 's5', percentage: 8.2 },
  { fund_id: 'mf1', stock_id: 's1', percentage: 7.1 },
  { fund_id: 'mf1', stock_id: 's4', percentage: 6.5 },
  { fund_id: 'mf1', stock_id: 's7', percentage: 4.3 },

  // HDFC Flexi Cap Fund
  { fund_id: 'mf2', stock_id: 's3', percentage: 8.8 },
  { fund_id: 'mf2', stock_id: 's5', percentage: 7.9 },
  { fund_id: 'mf2', stock_id: 's7', percentage: 6.2 },
  { fund_id: 'mf2', stock_id: 's2', percentage: 5.5 },
  { fund_id: 'mf2', stock_id: 's6', percentage: 5.1 },

  // ICICI Pru Bluechip Fund
  { fund_id: 'mf3', stock_id: 's5', percentage: 10.1 },
  { fund_id: 'mf3', stock_id: 's1', percentage: 9.2 },
  { fund_id: 'mf3', stock_id: 's4', percentage: 8.5 },
  { fund_id: 'mf3', stock_id: 's2', percentage: 7.3 },
  { fund_id: 'mf3', stock_id: 's6', percentage: 4.8 },

  // Axis Long Term Equity
  { fund_id: 'mf4', stock_id: 's2', percentage: 9.8 },
  { fund_id: 'mf4', stock_id: 's3', percentage: 8.1 },
  { fund_id: 'mf4', stock_id: 's4', percentage: 7.6 },
  { fund_id: 'mf4', stock_id: 's10', percentage: 6.2 },
  { fund_id: 'mf4', stock_id: 's9', percentage: 5.4 },
];

export const INDICES: Index[] = [
  { id: 'idx1', name: 'NIFTY 50', value: 23501.10, change: 183.45, percent_change: 0.79 },
  { id: 'idx2', name: 'SENSEX', value: 77209.90, change: -270.97, percent_change: -0.35 },
  { id: 'idx3', name: 'NIFTY BANK', value: 50002.00, change: 450.80, percent_change: 0.91 },
  { id: 'idx4', name: 'NIFTY IT', value: 35467.55, change: -120.10, percent_change: -0.34 },
];

export const BOT_LOGS: BotLog[] = [
  {
    id: 'log1',
    botName: 'NSE Stock Information Bot',
    status: 'Success',
    executionTime: 125.5,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'log2',
    botName: 'AMC Portfolio Disclosure Bot',
    status: 'Success',
    executionTime: 3600.2,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'log3',
    botName: 'Indices Data Bot',
    status: 'Failure',
    executionTime: 30.1,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
];
