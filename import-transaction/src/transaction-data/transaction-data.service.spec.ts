import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDataService } from './transaction-data.service';

describe('TransactionDataService', () => {
  let service: TransactionDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionDataService],
    }).compile();

    service = module.get<TransactionDataService>(TransactionDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
