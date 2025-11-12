import { Controller, Get, Post } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { Stock } from '../entities/Stock.entity';

@Controller('stocks')
export class StocksController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getStocks(): Promise<Stock[]> {
    return await this.databaseService.getStocks();
  }

  @Post('update-random')
  async updateRandomStockPrice(): Promise<Stock> {
    return await this.databaseService.updateRandomStockPrice();
  }
}