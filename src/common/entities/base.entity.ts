import { Expose } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose({
    groups: ['user'],
  })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({
    groups: ['user'],
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
