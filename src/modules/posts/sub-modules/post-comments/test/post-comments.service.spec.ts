import { Test, TestingModule } from '@nestjs/testing';
import { PostCommentsService } from '../post-comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostCommentModel } from '../entities/post-comments.entity';
import { Repository } from 'typeorm';
import { PostModel } from '../../../entities/posts.entity';

describe('PostCommentsService', () => {
  let service: PostCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCommentsService,
        {
          provide: getRepositoryToken(PostCommentModel),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PostModel),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostCommentsService>(PostCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
