import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDataController } from './transaction-data.controller';
import { TransactionDataService } from './transaction-data.service';

describe('TransactionDataController', () => {
  let controller: TransactionDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionDataController],
      providers: [TransactionDataService],
    }).compile();

    controller = module.get<TransactionDataController>(TransactionDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
