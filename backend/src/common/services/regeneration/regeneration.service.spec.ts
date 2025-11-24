import { Test, TestingModule } from '@nestjs/testing';
import { RegenerationService } from './regeneration.service';

describe('RegenerationService', () => {
  let service: RegenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegenerationService],
    }).compile();

    service = module.get<RegenerationService>(RegenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
