import { Test, TestingModule } from '@nestjs/testing';
import { CrimesController } from './crimes.controller';

describe('CrimesController', () => {
  let controller: CrimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrimesController],
    }).compile();

    controller = module.get<CrimesController>(CrimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
