import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../entities/Stock.entity';
import { MutualFund } from '../entities/MutualFund.entity';
import { FundHolding } from '../entities/FundHolding.entity';
import { Index } from '../entities/Index.entity';
import { BotLog } from '../entities/BotLog.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(MutualFund)
    private mutualFundRepository: Repository<MutualFund>,
    @InjectRepository(FundHolding)
    private fundHoldingRepository: Repository<FundHolding>,
    @InjectRepository(Index)
    private indexRepository: Repository<Index>,
    @InjectRepository(BotLog)
    private botLogRepository: Repository<BotLog>,
  ) {}

  async getFunds(): Promise<MutualFund[]> {
    return await this.mutualFundRepository.find();
  }

  async getStocks(): Promise<Stock[]> {
    return await this.stockRepository.find();
  }

  async getIndices(): Promise<Index[]> {
    return await this.indexRepository.find();
  }

  async getHoldings(): Promise<FundHolding[]> {
    return await this.fundHoldingRepository.find();
  }

  async getLogs(): Promise<BotLog[]> {
    return await this.botLogRepository.find({
      order: {
        timestamp: 'DESC',
      },
    });
  }

  async addLog(log: BotLog): Promise<BotLog> {
    return await this.botLogRepository.save(log);
  }

  async addOrUpdateStock(): Promise<void> {
    // Check if NEWCO stock exists
    const existingNewCo = await this.stockRepository.findOne({
      where: { symbol: 'NEWCO' },
    });

    if (!existingNewCo) {
      const newStock = new Stock();
      newStock.id = `s${Date.now()}`;
      newStock.symbol = 'NEWCO';
      newStock.name = 'Newly Scraped Co';
      newStock.price = 500.0;
      newStock.market_cap = 100000;
      newStock.sector = 'Technology';
      await this.stockRepository.save(newStock);
    }

    // Update a random stock price
    const stocks = await this.stockRepository.find();
    if (stocks.length > 0) {
      const randomIndex = Math.floor(Math.random() * stocks.length);
      const stockToUpdate = stocks[randomIndex];
      stockToUpdate.price = parseFloat(
        (stockToUpdate.price * (1 + (Math.random() - 0.5) / 10)).toFixed(2),
      );
      await this.stockRepository.save(stockToUpdate);
    }
  }

  async addFundAndHoldings(): Promise<void> {
    // Check if New Vision Growth Fund exists
    const existingFund = await this.mutualFundRepository.findOne({
      where: { name: 'New Vision Growth Fund' },
    });

    if (!existingFund) {
      // Create new fund
      const newFund = new MutualFund();
      newFund.id = `mf${Date.now()}`;
      newFund.name = 'New Vision Growth Fund';
      newFund.amc = 'New AMC';
      newFund.category = 'Flexi Cap';
      await this.mutualFundRepository.save(newFund);

      // Add holdings for the new fund
      const holdingsToAdd = [
        { fund_id: newFund.id, stock_id: 's1', percentage: 8.0 },
        { fund_id: newFund.id, stock_id: 's2', percentage: 7.5 },
      ];

      for (const holding of holdingsToAdd) {
        const fundHolding = new FundHolding();
        fundHolding.fund_id = holding.fund_id;
        fundHolding.stock_id = holding.stock_id;
        fundHolding.percentage = holding.percentage;
        await this.fundHoldingRepository.save(fundHolding);
      }
    }
  }

  async updateAllIndices(): Promise<void> {
    const indices = await this.indexRepository.find();
    const updatedIndices = indices.map((index) => {
      const change = (Math.random() - 0.5) * 100;
      const percent_change = (change / index.value) * 100;
      return {
        ...index,
        value: parseFloat((index.value + change).toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        percent_change: parseFloat(percent_change.toFixed(2)),
      };
    });

    await this.indexRepository.save(updatedIndices);
  }

  async updateRandomStockPrice(): Promise<Stock> {
    const stocks = await this.stockRepository.find();
    if (stocks.length === 0) {
      throw new Error('No stocks found in database');
    }

    const randomIndex = Math.floor(Math.random() * stocks.length);
    const stockToUpdate = stocks[randomIndex];
    const oldPrice = stockToUpdate.price;
    const newPrice = parseFloat(
      (oldPrice * (1 + (Math.random() - 0.5) / 20)).toFixed(2),
    );

    stockToUpdate.price = newPrice;
    stockToUpdate.price_change_direction =
      newPrice > oldPrice ? 'up' : newPrice < oldPrice ? 'down' : 'none';

    await this.stockRepository.save(stockToUpdate);
    return stockToUpdate;
  }
}