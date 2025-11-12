import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('stocks')
export class Stock {
  @PrimaryColumn()
  id: string;

  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('bigint')
  market_cap: number;

  @Column()
  sector: string;

  @Column({ nullable: true })
  price_change_direction: 'up' | 'down' | 'none';
}