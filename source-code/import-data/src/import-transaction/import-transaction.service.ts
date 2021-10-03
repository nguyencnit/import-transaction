import {Injectable} from '@nestjs/common';
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
import {readFile, utils} from 'xlsx';

@Injectable()
export class ImportTransactionService {

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly configService: ConfigService,
    ) {
    }

    async readCsvFile(fileName: string) {
        const transactionList: TransactionDto[] = [];
        const response = new TranrsactionRo();
        let rowIndex = 0;
        return new Promise((resolve) => {
            fs.createReadStream(path.resolve(__dirname, '../..', 'files', fileName))
                .pipe(csv.parse({headers: true, ignoreEmpty: true}))
                .on('error', (error) => {
                    console.error(error);
                    resolve(error.message);
                })
                .on('data', (row) => {

                    // convert datetime
                    row.date = moment(row.date, "DD/MM/YYYY HH:mm:ss", true).toISOString()

                    // create TransactionDto
                    const transaction = plainToClass(
                        TransactionDto,
                        row,
                    );

                    // validate data
                    validate(transaction).then(error => {
                        if (error.length > 0) {
                            response.errorList.push({errorIndex: rowIndex, errorMessage: error});
                            // console.log(`Invalid [row=${JSON.stringify(row)}] [reason=${error}]`);
                        } else {
                            response.totalIsValid++;
                            transactionList.push(transaction);
                        }
                        rowIndex++
                    });

                })
                .on('end', (rowCount: number) => {
                    response.totalRow = rowCount;

                    // get item size in message
                    const size = this.configService.get('ITEM_SIZE');
                    const totalMessage = Math.ceil(transactionList.length / size);
                    for (let i = 0; i < totalMessage; i++) {
                        // send message
                        this.rabbitMQService.send('rabbit-mq-producer', transactionList.slice(i * size, i * size + size));
                    }
                    resolve(response);
                });
        });
    }

    async readExcelFile(fileName: string) {
        const file = readFile(path.resolve(__dirname, '../..', 'files', fileName));
        const transactionList: TransactionDto[] = [];
        const response = new TranrsactionRo();
        let rowIndex = 0;
        const sheet = file.SheetNames;
        const sheetData = utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
        const promise = new Promise((resolve) => {
            sheetData.forEach( async row => {
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
                        if (rowIndex == sheetData.length-1)
                        {
                            resolve();
                        }
                    })

                })
            }
        );

         await promise.then(async () => {
                // get item size in message
                const size = this.configService.get('ITEM_SIZE');
                const totalMessage = Math.ceil(transactionList.length / size);
                console.log(totalMessage);
                for (let i = 0; i < totalMessage; i++) {
                    // send message
                    this.rabbitMQService.send('rabbit-mq-producer', transactionList.slice(i * size, i * size + size));
                }
            }
        )
        response.totalRow = sheetData.length;
        return response;
    }
}
