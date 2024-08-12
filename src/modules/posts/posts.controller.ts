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
    @Body() PostsUpdatePostDto: PostsUpdatePostDto,
  ) {
    return this.postsService.updatePostById(id, PostsUpdatePostDto);
  }

  @Delete(':id')
  deletePostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePostById(id);
  }

  /**
   * [ 테스트용 ] 랜덤 게시글 생성
   * TODO: 테스트용 코드이므로 실제 서비스에서는 제거해야 합니다.
   */
  @Post('random')
  async createRandomPosts(@Body('howMany') howMany: number) {
    await this.postsService.createRandomPosts(howMany);

    return true;
  }
}
