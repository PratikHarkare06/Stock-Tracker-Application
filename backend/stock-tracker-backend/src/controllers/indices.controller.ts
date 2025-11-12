import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { Index } from '../entities/Index.entity';

@Controller('indices')
export class IndicesController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getIndices(): Promise<Index[]> {
    return await this.databaseService.getIndices();
  }
}