import { Module, ValidationPipe } from '@nestjs/common';
import { ImportTransactionService } from './import-transaction.service';
import { ImportTransactionController } from './import-transaction.controller';
import {RabbitMQModule} from '../rabbit-mq/rabbit-mq.module';
import {ConfigService} from "../config/config.service";
@Module({
  imports: [RabbitMQModule],
  controllers: [ImportTransactionController],
  providers: [ImportTransactionService, ConfigService, ValidationPipe]
})
export class ImportTransactionModule {}
