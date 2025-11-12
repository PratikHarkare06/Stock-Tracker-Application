import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { BotLog } from '../entities/BotLog.entity';

@Controller('bots')
export class BotsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('logs')
  async getBotLogs(): Promise<{ logs: BotLog[]; lastUpdated: { [key: string]: string } }> {
    const logs = await this.databaseService.getLogs();
    const lastUpdated: { [key: string]: string } = {};
    const botRuns: { [key: string]: BotLog } = {};

    logs
      .filter((log) => log.status === 'Success')
      .forEach((log) => {
        if (
          !botRuns[log.bot_name] ||
          new Date(log.timestamp) > new Date(botRuns[log.bot_name].timestamp)
        ) {
          botRuns[log.bot_name] = log;
        }
      });

    Object.values(botRuns).forEach((log) => {
      const botId = log.bot_name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace('information-bot', 'bot')
        .replace('disclosure-bot', 'bot');
      lastUpdated[botId] = new Date(log.timestamp).toLocaleString();
    });

    const sortedLogs = logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return { logs: sortedLogs, lastUpdated };
  }

  @Post(':id/run')
  async runBot(
    @Param('id') botId: string,
    @Body() body: { botName: string },
  ): Promise<BotLog> {
    const { botName } = body;
    const startTime = Date.now();

    try {
      let resultText = 'Bot run completed successfully.';

      // In a real implementation, this would trigger actual scraping scripts
      // For now, we'll simulate the behavior
      const executionTime = Math.random() * 10 + 2; // 2-12 seconds
      await new Promise((resolve) => setTimeout(resolve, executionTime * 1000));

      const isSuccess = Math.random() > 0.2; // 80% success rate
      if (!isSuccess) throw new Error('Bot run failed due to an error.');

      // Update database based on bot type
      if (botId === 'nse-bot') await this.databaseService.addOrUpdateStock();
      if (botId === 'amc-bot')
        await this.databaseService.addFundAndHoldings();
      if (botId === 'indices-bot')
        await this.databaseService.updateAllIndices();

      const endTime = Date.now();
      const executionTimeSeconds = (endTime - startTime) / 1000;
      const newLog = new BotLog();
      newLog.id = `log${Date.now()}`;
      newLog.bot_name = botName;
      newLog.status = 'Success';
      newLog.execution_time = parseFloat(executionTimeSeconds.toFixed(2));
      newLog.timestamp = new Date();
      newLog.result = resultText;

      return await this.databaseService.addLog(newLog);
    } catch (error: any) {
      const endTime = Date.now();
      const executionTimeSeconds = (endTime - startTime) / 1000;
      const newLog = new BotLog();
      newLog.id = `log${Date.now()}`;
      newLog.bot_name = botName;
      newLog.status = 'Failure';
      newLog.execution_time = parseFloat(executionTimeSeconds.toFixed(2));
      newLog.timestamp = new Date();
      newLog.result = error.message;

      await this.databaseService.addLog(newLog);
      throw error;
    }
  }
}