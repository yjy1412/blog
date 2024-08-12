import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UsersControllerMock } from './users.controller.mock';

describe('UsersController', () => {
  let controller: UsersController;

  let mockUsersService: Partial<UsersService>;

  beforeAll(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [UsersControllerMock],
    }).compile();

    const usersControllerMock =
      mockModule.get<UsersControllerMock>(UsersControllerMock);

    mockUsersService = usersControllerMock.mockUsersService;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
