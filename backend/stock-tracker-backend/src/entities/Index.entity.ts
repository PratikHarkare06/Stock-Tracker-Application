import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('indices')
export class Index {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 12, scale: 2 })
  value: number;

  @Column('decimal', { precision: 12, scale: 2 })
  change: number;

  @Column('decimal', { precision: 5, scale: 2 })
  percent_change: number;
}