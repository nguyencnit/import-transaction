import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { TransactionDataModule } from './transaction-data/transaction-data.module';

@Module({
  imports: [DatabaseModule, ConfigModule, TransactionDataModule],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
