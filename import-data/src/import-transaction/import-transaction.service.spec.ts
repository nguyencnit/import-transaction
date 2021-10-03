import {Test, TestingModule} from '@nestjs/testing';
import {ImportTransactionService} from './import-transaction.service';
import {ConfigService} from "../config/config.service";
import {RabbitMQService} from "../rabbit-mq/rabbit-mq.service";
import {RabbitMQModule} from "../rabbit-mq/rabbit-mq.module";
import {HttpException, HttpStatus} from '@nestjs/common';

jest.mock('../rabbit-mq/rabbit-mq.service');

describe('ImportTransactionService', () => {
    let service: ImportTransactionService;
    let configService: ConfigService;
    let rabbitMQService: RabbitMQService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [RabbitMQModule],
            providers: [ImportTransactionService, ConfigService, RabbitMQService],
        }).compile();

        service = module.get<ImportTransactionService>(ImportTransactionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // it('read excel file success', async () => {
    //     const returnData = {
    //         totalRow: 2,
    //         totalIsValid: 2,
    //         errorList: [],
    //     };
    //     expect(await service.readExcelFile('case1.xlsx')).toEqual(returnData);
    // });
    //
    // it('read excel file: one row data is error', async () => {
    //     const returnData = {
    //         totalRow: 3,
    //         totalIsValid: 2,
    //         errorList: [],
    //     };
    //     const result = await service.readExcelFile('case2.xlsx');
    //     expect(result.totalIsValid).toEqual(returnData.totalIsValid);
    //     expect(result.errorList.length).toBeGreaterThan(0);
    // });
    //
    // it('read excel file: all row data is error', async () => {
    //     const returnData = {
    //         totalRow: 3,
    //         totalIsValid: 0,
    //         errorList: [],
    //     };
    //     const result = await service.readExcelFile('case3.xlsx');
    //     expect(result.totalIsValid).toEqual(returnData.totalIsValid);
    //     expect(result.errorList.length).toEqual(returnData.totalRow);
    // });
    //
    // it('read excel file: is empty data', async () => {
    //     expect(async () => await service.readExcelFile('case4.xlsx')).rejects.toThrowError(HttpException);
    // });

    // it('read excel file: file not found', async () => {
    //     expect(async () => await service.readFileBuffer('case5.xlsx')).rejects.toThrowError(HttpException);
    // });
});
