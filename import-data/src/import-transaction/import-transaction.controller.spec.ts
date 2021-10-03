import { Test, TestingModule } from '@nestjs/testing';
import { ImportTransactionController } from './import-transaction.controller';
import { ImportTransactionService } from './import-transaction.service';
import {RabbitMQModule} from "../rabbit-mq/rabbit-mq.module";
import {ConfigService} from "../config/config.service";

describe('ImportTransactionController', () => {
  let controller: ImportTransactionController;
  let service: ImportTransactionService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[RabbitMQModule],
      controllers: [ImportTransactionController],
      providers: [ImportTransactionService, ConfigService],
    }).compile();

    controller = module.get<ImportTransactionController>(ImportTransactionController);
    service = module.get<ImportTransactionService>(ImportTransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
