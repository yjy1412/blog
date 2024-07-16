import { CreatePostDto } from '../dto/create-post.dto';
import { PostModel } from '../entities/post.entity';
import { UserModel } from '../../users/entities/user.entity';
import { PostsService } from '../posts.service';
import { UpdatePostDto } from '../dto/update-post.dto';

export class PostsMock {
  public readonly mockCreatePostDto: CreatePostDto = {
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
    authorId: 1,
  };

  public readonly mockUpadatePostDto: UpdatePostDto = {
    title: 'Test Update Post',
    content: 'Test Update Content',
  };

  public readonly mockUser: UserModel = {
    id: 1,
    email: 'tester@test.com',
    password: 'testPassword',
    name: {
      first: 'Hong',
      last: 'Gil-Dong',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };

  public readonly mockPost: PostModel = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: this.mockUser,
  };

  public readonly mockPostsService: Partial<PostsService> = {
    createPost: jest.fn().mockResolvedValue(this.mockPost),
    getPostsAll: jest.fn().mockResolvedValue([this.mockPost]),
    getPostById: jest.fn().mockResolvedValue(this.mockPost),
    updatePostById: jest.fn().mockResolvedValue(this.mockPost),
    deletePostById: jest.fn().mockResolvedValue(true),
  };
}
