import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { Stock } from '../entities/Stock.entity';
import { MutualFund } from '../entities/MutualFund.entity';

@Controller('funds')
export class FundsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getFunds(): Promise<MutualFund[]> {
    return await this.databaseService.getFunds();
  }

  @Get('holdings/:stockId')
  async getHoldingsForStock(
    @Param('stockId') stockId: string,
  ): Promise<{ fundName: string; amc: string; percentage: number }[]> {
    const holdings = await this.databaseService.getHoldings();
    const funds = await this.databaseService.getFunds();

    const holdingInfo = holdings
      .filter((h) => h.stock_id === stockId)
      .map((holding) => {
        const fund = funds.find((f) => f.id === holding.fund_id);
        return {
          fundName: fund?.name || 'Unknown Fund',
          amc: fund?.amc || 'Unknown AMC',
          percentage: holding.percentage,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    return holdingInfo;
  }

  @Post('compare')
  async compareFunds(
    @Body() body: { fund1Id: string; fund2Id: string },
  ): Promise<any> {
    const { fund1Id, fund2Id } = body;
    const funds = await this.databaseService.getFunds();
    const holdings = await this.databaseService.getHoldings();
    const stocks = await this.databaseService.getStocks();

    const fund1 = funds.find((f) => f.id === fund1Id);
    const fund2 = funds.find((f) => f.id === fund2Id);

    if (!fund1 || !fund2) {
      throw new Error('One or both funds not found.');
    }

    const fund1Holdings = holdings.filter((h) => h.fund_id === fund1Id);
    const fund2Holdings = holdings.filter((h) => h.fund_id === fund2Id);

    const fund1StockMap = new Map(
      fund1Holdings.map((h) => [h.stock_id, h.percentage]),
    );
    const fund2StockMap = new Map(
      fund2Holdings.map((h) => [h.stock_id, h.percentage]),
    );

    const overlappingStocksData: any[] = [];
    let totalOverlapPercentage1 = 0;
    let totalOverlapPercentage2 = 0;

    fund1StockMap.forEach((percentage1, stockId) => {
      if (fund2StockMap.has(stockId)) {
        const stock = stocks.find((s) => s.id === stockId);
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

    return result;
  }
}