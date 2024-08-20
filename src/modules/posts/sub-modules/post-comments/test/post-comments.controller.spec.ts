import { Test, TestingModule } from '@nestjs/testing';
import { PostCommentsController } from '../post-comments.controller';
import { PostCommentsService } from '../post-comments.service';
import { PostCommentsControllerMock } from './post-comments.controller.mock';
import { PostCommentsGateway } from '../post-comments.gateway';

describe('PostCommentsController', () => {
  let controller: PostCommentsController;
  let mockPostCommentsService: Partial<PostCommentsService>;
  let mockPostCommentsGateway: Partial<PostCommentsGateway>;

  beforeAll(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [PostCommentsControllerMock],
    }).compile();

    const postCommentsMock = mockModule.get<PostCommentsControllerMock>(
      PostCommentsControllerMock,
    );

    mockPostCommentsService = postCommentsMock.mockPostCommentsService;
    mockPostCommentsGateway = postCommentsMock.mockPostCommentsGateway;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentsController],
      providers: [
        {
          provide: PostCommentsService,
          useValue: mockPostCommentsService,
        },
        {
          provide: PostCommentsGateway,
          useValue: mockPostCommentsGateway,
        },
      ],
    }).compile();

    controller = module.get<PostCommentsController>(PostCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
