import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { AuthenticatedUser } from '../common/decorators/authenticate-user.decorator';

import { UserModel } from '../users/entities/user.entity';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(
    @AuthenticatedUser() user: Pick<UserModel, 'id' | 'email'>,
    @Body() body: CreatePostDto,
  ) {
    const post = { ...body, authorId: user.id };

    return this.postsService.createPost(post);
  }

  @Get()
  getPostsAll() {
    return this.postsService.getPostsAll();
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  updatePostById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePostById(id, updatePostDto);
  }

  @Delete(':id')
  deletePostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePostById(id);
  }
}
