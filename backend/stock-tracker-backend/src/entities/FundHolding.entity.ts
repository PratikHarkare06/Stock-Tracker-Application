import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('fund_holdings')
export class FundHolding {
  @PrimaryColumn()
  fund_id: string;

  @PrimaryColumn()
  stock_id: string;

  @Column('decimal', { precision: 5, scale: 2 })
  percentage: number;
}