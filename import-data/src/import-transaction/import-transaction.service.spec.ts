import {Test, TestingModule} from '@nestjs/testing';
import {ImportTransactionService} from './import-transaction.service';
import {ConfigService} from "../config/config.service";
import {RabbitMQService} from "../rabbit-mq/rabbit-mq.service";
import {RabbitMQModule} from "../rabbit-mq/rabbit-mq.module";
import {HttpException} from '@nestjs/common';
import * as fs from 'fs';
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

    it('read excel file success', async () => {
        const returnData = {
            totalRow: 2,
            totalIsValid: 2,
            errorList: [],
        };
       const buffer = fs.readFileSync(__dirname+'/../../files/case1.xlsx');
        expect(await service.readFileBuffer(buffer)).toEqual(returnData);
    });

    it('read excel file: one row data is error', async () => {
        const returnData = {
            totalRow: 3,
            totalIsValid: 2,
            errorList: [],
        };
        const buffer = fs.readFileSync(__dirname+'/../../files/case2.xlsx');
        const result = await service.readFileBuffer(buffer);
        expect(result.totalIsValid).toEqual(returnData.totalIsValid);
        expect(result.errorList.length).toBeGreaterThan(0);
    });

    it('read excel file: all row data is error', async () => {
        const returnData = {
            totalRow: 3,
            totalIsValid: 0,
            errorList: [],
        };
        const buffer = fs.readFileSync(__dirname+'/../../files/case3.xlsx')
        const result = await service.readFileBuffer(buffer);
        expect(result.totalIsValid).toEqual(returnData.totalIsValid);
        expect(result.errorList.length).toEqual(returnData.totalRow);
    });

    it('read excel file: is empty data', async () => {
        const buffer = fs.readFileSync(__dirname+'/../../files/case4.xlsx');
        expect(async () => await service.readFileBuffer(buffer)).rejects.toThrowError(HttpException);
    });

    it('read excel file: file no header || no data', async () => {
        const buffer = fs.readFileSync(__dirname+'/../../files/case5.xlsx');
        expect(async () => await service.readFileBuffer(buffer)).rejects.toThrowError(HttpException);
    });

    it('read csv file success', async () => {
        const returnData = {
            totalRow: 2,
            totalIsValid: 2,
            errorList: [],
        };
        const buffer = fs.readFileSync(__dirname+'/../../files/case1.csv');
        expect(await service.readFileBuffer(buffer)).toEqual(returnData);
    });

    it('read csv file: one row data is error', async () => {
        const returnData = {
            totalRow: 3,
            totalIsValid: 2,
            errorList: [],
        };
        const buffer = fs.readFileSync(__dirname+'/../../files/case2.csv');
        const result = await service.readFileBuffer(buffer);
        expect(result.totalIsValid).toEqual(returnData.totalIsValid);
        expect(result.errorList.length).toBeGreaterThan(0);
    });

    it('read csv file: all row data is error', async () => {
        const returnData = {
            totalRow: 3,
            totalIsValid: 0,
            errorList: [],
        };
        const buffer = fs.readFileSync(__dirname+'/../../files/case3.csv')
        const result = await service.readFileBuffer(buffer);
        expect(result.totalIsValid).toEqual(returnData.totalIsValid);
        expect(result.errorList.length).toEqual(returnData.totalRow);
    });

    it('read csv file: is empty data', async () => {
        const buffer = fs.readFileSync(__dirname+'/../../files/case4.csv');
        expect(async () => await service.readFileBuffer(buffer)).rejects.toThrowError(HttpException);
    });

    it('read csv file: file no header || no data', async () => {
        const buffer = fs.readFileSync(__dirname+'/../../files/case5.csv');
        expect(async () => await service.readFileBuffer(buffer)).rejects.toThrowError(HttpException);
    });
});
