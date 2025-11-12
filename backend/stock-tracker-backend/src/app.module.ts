import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundsController } from './controllers/funds.controller';
import { StocksController } from './controllers/stocks.controller';
import { IndicesController } from './controllers/indices.controller';
import { BotsController } from './controllers/bots.controller';
import { AuthController } from './controllers/auth.controller';
import { DatabaseService } from './services/database.service';
import { Stock } from './entities/Stock.entity';
import { MutualFund } from './entities/MutualFund.entity';
import { FundHolding } from './entities/FundHolding.entity';
import { Index } from './entities/Index.entity';
import { BotLog } from './entities/BotLog.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'stocktracker',
      password: 'stocktracker',
      database: 'stocktracker',
      entities: [Stock, MutualFund, FundHolding, Index, BotLog],
      synchronize: true, // Only for development
      logging: false,
    }),
    TypeOrmModule.forFeature([Stock, MutualFund, FundHolding, Index, BotLog]),
  ],
  controllers: [
    FundsController,
    StocksController,
    IndicesController,
    BotsController,
    AuthController,
  ],
  providers: [DatabaseService],
})
export class AppModule {}
