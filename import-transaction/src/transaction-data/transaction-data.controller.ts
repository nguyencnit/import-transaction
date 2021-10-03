import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RmqContext} from '@nestjs/microservices';
import { TransactionDataService } from './transaction-data.service';
import { CreateTransactionDataDto } from './dto/create-transaction-data.dto';

@Controller()
export class TransactionDataController {
  constructor(private readonly transactionDataService: TransactionDataService) {}

  @MessagePattern('rabbit-mq-producer')
  create(@Payload() data: CreateTransactionDataDto[], @Ctx() context: RmqContext) {

    return this.transactionDataService.create(data, context);
  }
}
