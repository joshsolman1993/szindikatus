import { Test, TestingModule } from '@nestjs/testing';
import { TalentsController } from './talents.controller';

describe('TalentsController', () => {
  let controller: TalentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalentsController],
    }).compile();

    controller = module.get<TalentsController>(TalentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
