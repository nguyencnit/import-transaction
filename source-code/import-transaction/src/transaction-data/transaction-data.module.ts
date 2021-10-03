import { Module } from '@nestjs/common';
import { TransactionDataService } from './transaction-data.service';
import { TransactionDataController } from './transaction-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDataRepository } from './transaction-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionDataRepository])],
  controllers: [TransactionDataController],
  providers: [TransactionDataService],
  exports: [TransactionDataService, TypeOrmModule],
})
export class TransactionDataModule {}
