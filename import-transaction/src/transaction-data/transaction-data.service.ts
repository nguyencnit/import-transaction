import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import {CreateTransactionDataDto} from './dto/create-transaction-data.dto';
import {TransactionDataEntity} from './entities/transaction-data.entity';
import {getConnection} from "typeorm";
import {RmqContext} from "@nestjs/microservices";

@Injectable()
export class TransactionDataService {

    async create(data: CreateTransactionDataDto[], context: RmqContext) {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        const listTransaction:TransactionDataEntity[] = [];
          data.forEach( item => {
            const transaction = new TransactionDataEntity();
            transaction.amount = item.amount;
            transaction.content = item.content;
            transaction.date = item.date;
            transaction.type = item.type;
            listTransaction.push(transaction);
          });
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(TransactionDataEntity)
                .values(listTransaction)
                .execute();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            channel.nack(orginalMessage);
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        } finally {
            await queryRunner.release();
            channel.ack(orginalMessage);
        }
        return 'This action adds a new transactionData';
    }
}
