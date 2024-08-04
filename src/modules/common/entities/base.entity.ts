import { Expose } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ValidationPipeExposeGroupEnum } from '../enums/validation-pipe.enum';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose({
    groups: [ValidationPipeExposeGroupEnum.PUBLIC],
  })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({
    groups: [ValidationPipeExposeGroupEnum.PUBLIC],
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
