import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { AuthenticatedUser } from '../common/decorators/authenticate-user.decorator';

import { UserModel } from '../users/entities/user.entity';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { GetPostsQueryDto } from './dtos/get-posts-query.dto';
import { Public } from '../common/decorators/public.decorator';

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

  @Public()
  @Get()
  getPosts(@Query() query: GetPostsQueryDto) {
    return this.postsService.getPosts(query);
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

  /**
   * [ 테스트용 ] 랜덤 게시글 생성
   */
  @Post('random')
  async createRandomPosts(@Body('howMany') howMany: number) {
    await this.postsService.createRandomPosts(howMany);

    return true;
  }
}
