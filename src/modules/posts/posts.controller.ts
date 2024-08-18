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

import { UserModel } from '../users/entities/users.entity';

import { PostsService } from './posts.service';
import { PostsCreatePostDto } from './dtos/posts.create-post.dto';
import { PostsUpdatePostDto } from './dtos/posts.update-post.dto';
import { PostsPaginatePostsDto } from './dtos/posts.paginate-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(
    @AuthenticatedUser() user: Pick<UserModel, 'id' | 'email'>,
    @Body() body: PostsCreatePostDto,
  ) {
    if (body.images && body.images.length > 0) {
      const savedImages = await this.postsService.savePostImages(body.images);

      body.images = savedImages;
    }

    return this.postsService.createPost(user.id, body);
  }

  @Get('pages')
  paginatePosts(@Query() query: PostsPaginatePostsDto) {
    return this.postsService.paginatePosts(query);
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  updatePostById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PostsUpdatePostDto,
  ) {
    return this.postsService.updatePostById(id, body);
  }

  @Delete(':id')
  deletePostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePostById(id);
  }
}
