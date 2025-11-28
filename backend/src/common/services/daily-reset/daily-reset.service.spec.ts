import { Test, TestingModule } from '@nestjs/testing';
import { DailyResetService } from './daily-reset.service';

describe('DailyResetService', () => {
  let service: DailyResetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyResetService],
    }).compile();

    service = module.get<DailyResetService>(DailyResetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
