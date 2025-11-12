import { db } from './database';
import { getMarketSummary } from './gemini';
import { webSocketService } from './websocket';
import { Stock, MutualFund, BotLog, OverlapResult, Index } from '../types';

const SIMULATED_LATENCY = 500; // ms

// Start the real-time data feed simulation
webSocketService.connect();

const withLatency = <T>(data: T, latency: number = SIMULATED_LATENCY): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), latency);
    });
};

// --- API Functions ---

export const getFunds = (): Promise<MutualFund[]> => withLatency(db.getFunds());
export const getStocks = (): Promise<Stock[]> => withLatency(db.getStocks());
export const getIndices = (): Promise<Index[]> => withLatency(db.getIndices());

export const getHoldingsForStock = (stockId: string): Promise<{ fundName: string; amc: string; percentage: number }[]> => {
    const holdings = db.getHoldings();
    const funds = db.getFunds();
    
    const holdingInfo = holdings
        .filter(h => h.stock_id === stockId)
        .map(holding => {
            const fund = funds.find(f => f.id === holding.fund_id);
            return {
                fundName: fund?.name || 'Unknown Fund',
                amc: fund?.amc || 'Unknown AMC',
                percentage: holding.percentage,
            };
        })
        .sort((a, b) => b.percentage - a.percentage);
    
    return withLatency(holdingInfo);
};

export const compareFunds = (fund1Id: string, fund2Id: string): Promise<OverlapResult> => {
    const funds = db.getFunds();
    const holdings = db.getHoldings();
    const stocks = db.getStocks();
  
    const fund1 = funds.find(f => f.id === fund1Id);
    const fund2 = funds.find(f => f.id === fund2Id);

    if (!fund1 || !fund2) {
      return Promise.reject(new Error("One or both funds not found."));
    }

    const fund1Holdings = holdings.filter(h => h.fund_id === fund1Id);
    const fund2Holdings = holdings.filter(h => h.fund_id === fund2Id);
    
    const fund1StockMap = new Map(fund1Holdings.map(h => [h.stock_id, h.percentage]));
    const fund2StockMap = new Map(fund2Holdings.map(h => [h.stock_id, h.percentage]));

    const overlappingStocksData: OverlapResult['overlappingStocks'] = [];
    let totalOverlapPercentage1 = 0;
    let totalOverlapPercentage2 = 0;

    fund1StockMap.forEach((percentage1, stockId) => {
      if (fund2StockMap.has(stockId)) {
        const stock = stocks.find(s => s.id === stockId);
        if (stock) {
          const percentage2 = fund2StockMap.get(stockId)!;
          overlappingStocksData.push({ stock, percentage1, percentage2 });
          totalOverlapPercentage1 += percentage1;
          totalOverlapPercentage2 += percentage2;
        }
      }
    });

    const result = {
      overlappingStocks: overlappingStocksData,
      totalOverlapPercentage1: parseFloat(totalOverlapPercentage1.toFixed(2)),
      totalOverlapPercentage2: parseFloat(totalOverlapPercentage2.toFixed(2)),
      fund1Name: fund1.name,
      fund2Name: fund2.name,
    };
    
    return withLatency(result, SIMULATED_LATENCY + 500);
};

export const login = (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'password') {
                resolve();
            } else {
                reject(new Error('Invalid username or password.'));
            }
        }, SIMULATED_LATENCY);
    });
};

export const getBotLogs = (): Promise<{ logs: BotLog[]; lastUpdated: {[key: string]: string} }> => {
    const logs = db.getLogs();
    const lastUpdated: {[key: string]: string} = {};
    const botRuns: {[key: string]: BotLog} = {};

    logs.filter(log => log.status === 'Success')
        .forEach(log => {
            if (!botRuns[log.botName] || new Date(log.timestamp) > new Date(botRuns[log.botName].timestamp)) {
                botRuns[log.botName] = log;
            }
        });
    
    Object.values(botRuns).forEach(log => {
        const botId = log.botName.toLowerCase().replace(/ /g, '-').replace('information-bot', 'bot').replace('disclosure-bot', 'bot');
        lastUpdated[botId] = new Date(log.timestamp).toLocaleString();
    });

    const sortedLogs = logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return withLatency({ logs: sortedLogs, lastUpdated });
};

export const runBot = async (botId: string, botName: string): Promise<BotLog> => {
    const startTime = Date.now();

    try {
        let resultText = 'Simulated run completed successfully.';
        
        if (botId === 'firecrawl-bot') {
            resultText = await getMarketSummary();
        } else {
            // Simulate other bots
            const executionTime = Math.random() * 10 + 2; // 2-12 seconds
            await new Promise(resolve => setTimeout(resolve, executionTime * 1000));
            
            const isSuccess = Math.random() > 0.2; // 80% success rate
            if (!isSuccess) throw new Error('Simulated run failed due to a random error.');

            // Update database based on bot type
            if (botId === 'nse-bot') db.addOrUpdateStock();
            if (botId === 'amc-bot') db.addFundAndHoldings();
            if (botId === 'indices-bot') db.updateAllIndices();
        }

        const endTime = Date.now();
        const executionTime = (endTime - startTime) / 1000;
        const newLog: BotLog = {
            id: `log${Date.now()}`,
            botName,
            status: 'Success',
            executionTime: parseFloat(executionTime.toFixed(2)),
            timestamp: new Date().toISOString(),
            result: resultText,
        };
        db.addLog(newLog);
        return newLog;

    } catch (error: any) {
        const endTime = Date.now();
        const executionTime = (endTime - startTime) / 1000;
        const newLog: BotLog = {
            id: `log${Date.now()}`,
            botName,
            status: 'Failure',
            executionTime: parseFloat(executionTime.toFixed(2)),
            timestamp: new Date().toISOString(),
            result: error.message,
        };
        db.addLog(newLog);
        throw error;
    }
};

export const uploadCsv = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (file.name.endsWith('.csv') && Math.random() > 0.2) {
                const newLog: BotLog = {
                    id: `log${Date.now()}`,
                    botName: `Manual Upload: ${file.name}`,
                    status: 'Success',
                    executionTime: 1.5,
                    timestamp: new Date().toISOString(),
                    result: `File ${file.name} processed and data ingested.`
                };
                db.addLog(newLog);
                resolve();
            } else {
                reject(new Error("Upload failed. Invalid file or processing error."));
            }
        }, 2000);
    });
};
