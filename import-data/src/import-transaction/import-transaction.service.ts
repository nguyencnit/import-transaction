import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import {RabbitMQService} from '../rabbit-mq/rabbit-mq.service';
import {validate} from 'class-validator';
import {ConfigService} from '../config/config.service';
import {plainToClass} from 'class-transformer';
import {TransactionDto} from './dto/transaction.dto';
import {TranrsactionRo} from './ro/tranrsaction.ro';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import {utils, read} from 'xlsx';

@Injectable()
export class ImportTransactionService {

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly configService: ConfigService,
    ) {
    }
    async readFileBuffer( buffer: Buffer) {
       const data = read(buffer, {type:'buffer', cellDates:true, dateNF:'DD/MM/YYYY HH:mm:ss'});
        const transactionList: TransactionDto[] = [];
        const response = new TranrsactionRo();
        let rowIndex = 0;
        const sheetData = utils.sheet_to_json(data.Sheets[data.SheetNames[0]]);
        console.log(sheetData.length);
        if (sheetData.length == 0) {
            throw new HttpException(
                {
                    errorCode: 'ERROR.NOT_FOUND',
                    errorMessage: 'File Not Found',
                },
                HttpStatus.NOT_FOUND,
            );
        }
        const promise = new Promise((resolve) => {
                sheetData.forEach(async row => {
                    const rowData = {
                        date: moment(row['date'], "DD/MM/YYYY HH:mm:ss", true).toISOString(),
                        content: row['content'],
                        amount: row['amount'].toString(),
                        type: row['type']
                    }
                    // create TransactionDto
                    const transaction = plainToClass(
                        TransactionDto,
                        rowData,
                    );

                    // validate data
                    validate(transaction).then(error => {
                        if (error.length > 0) {
                            response.errorList.push({errorIndex: rowIndex, errorMessage: error});
                            console.log(`Invalid [row=${JSON.stringify(row)}] [reason=${error}]`);
                        } else {
                            response.totalIsValid++;
                            transactionList.push(transaction);

                        }
                        rowIndex++
                        if (rowIndex == sheetData.length - 1) {
                            resolve();
                        }
                    })

                })
            }
        );

        await promise.then(async () => {
                // get item size in message
                const size = this.configService.get('ITEM_SIZE');
                console.log(transactionList.length);
                const totalMessage = Math.ceil(transactionList.length / size);
                for (let i = 0; i < totalMessage; i++) {
                    // send message
                    this.rabbitMQService.send('rabbit-mq-producer', transactionList.slice(i * size, i * size + size));
                }
            }
        )
        response.totalRow = sheetData.length;
        // console.log(response);
        return response;
    }
}
