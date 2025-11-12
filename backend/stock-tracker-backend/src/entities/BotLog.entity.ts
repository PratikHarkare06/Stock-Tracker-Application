import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('bot_logs')
export class BotLog {
  @PrimaryColumn()
  id: string;

  @Column()
  bot_name: string;

  @Column()
  status: 'Success' | 'Failure' | 'In Progress';

  @Column('decimal', { precision: 10, scale: 2 })
  execution_time: number;

  @Column('timestamp')
  timestamp: Date;

  @Column({ nullable: true, type: 'text' })
  result: string;
}