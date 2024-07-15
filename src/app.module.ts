import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { PostModel } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { UserModel } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [PostModel, UserModel],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
  ],
})
export class AppModule {}
