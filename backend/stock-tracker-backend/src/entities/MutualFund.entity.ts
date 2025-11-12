import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('mutual_funds')
export class MutualFund {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  amc: string;

  @Column()
  category: string;
}