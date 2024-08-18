import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamptz',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    select: false,
    nullable: true,
  })
  deletedAt: Date | null;
}
