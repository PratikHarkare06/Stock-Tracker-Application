import { STOCKS, MUTUAL_FUNDS, FUND_HOLDINGS, INDICES, BOT_LOGS } from '../data/mockData';
import { Stock, MutualFund, FundHolding, Index, BotLog } from '../types';

// Simulate a database with in-memory data, initialized from mocks
let stocksDB: Stock[] = JSON.parse(JSON.stringify(STOCKS));
let fundsDB: MutualFund[] = JSON.parse(JSON.stringify(MUTUAL_FUNDS));
let holdingsDB: FundHolding[] = JSON.parse(JSON.stringify(FUND_HOLDINGS));
let indicesDB: Index[] = JSON.parse(JSON.stringify(INDICES));
let logsDB: BotLog[] = JSON.parse(JSON.stringify(BOT_LOGS));


// --- Data Access and Manipulation Functions ---

export const db = {
  getFunds: (): MutualFund[] => fundsDB,
  getStocks: (): Stock[] => stocksDB,
  getIndices: (): Index[] => indicesDB,
  getHoldings: (): FundHolding[] => holdingsDB,
  getLogs: (): BotLog[] => logsDB,

  addLog: (log: BotLog): void => {
    logsDB = [log, ...logsDB];
  },

  addOrUpdateStock: (): void => {
    const existingNewCo = stocksDB.find(s => s.symbol === 'NEWCO');
    if (!existingNewCo) {
        stocksDB.push({ id: `s${Date.now()}`, symbol: 'NEWCO', name: 'Newly Scraped Co', price: 500.00, market_cap: 100000, sector: 'Technology' });
    }
    const randomIndex = Math.floor(Math.random() * stocksDB.length);
    stocksDB[randomIndex].price = parseFloat((stocksDB[randomIndex].price * (1 + (Math.random() - 0.5) / 10)).toFixed(2));
  },

  addFundAndHoldings: (): void => {
    const existingFund = fundsDB.find(f => f.name === 'New Vision Growth Fund');
    if (!existingFund) {
        const newFundId = `mf${Date.now()}`;
        fundsDB.push({ id: newFundId, name: 'New Vision Growth Fund', amc: 'New AMC', category: 'Flexi Cap' });
        holdingsDB.push({ fund_id: newFundId, stock_id: 's1', percentage: 8.0 });
        holdingsDB.push({ fund_id: newFundId, stock_id: 's2', percentage: 7.5 });
    }
  },

  updateAllIndices: (): void => {
    indicesDB = indicesDB.map(index => {
        const change = (Math.random() - 0.5) * 100;
        const percent_change = (change / index.value) * 100;
        return {
            ...index,
            value: parseFloat((index.value + change).toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            percent_change: parseFloat(percent_change.toFixed(2)),
        }
    });
  },

  updateRandomStockPrice: (): Stock => {
    const randomIndex = Math.floor(Math.random() * stocksDB.length);
    const stockToUpdate = stocksDB[randomIndex];
    const oldPrice = stockToUpdate.price;
    const newPrice = parseFloat((oldPrice * (1 + (Math.random() - 0.5) / 20)).toFixed(2));
    
    stockToUpdate.price = newPrice;
    stockToUpdate.price_change_direction = newPrice > oldPrice ? 'up' : (newPrice < oldPrice ? 'down' : 'none');
    
    // Reset other stocks' direction to ensure only the updated one flashes
    stocksDB.forEach(stock => {
      if (stock.id !== stockToUpdate.id) {
        delete stock.price_change_direction;
      }
    });
    
    return stockToUpdate;
  }
};
