import { Test, TestingModule } from '@nestjs/testing';
import { CrimesService } from './crimes.service';

describe('CrimesService', () => {
  let service: CrimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrimesService],
    }).compile();

    service = module.get<CrimesService>(CrimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
