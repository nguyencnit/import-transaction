import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile} from '@nestjs/common';
import {ImportTransactionService} from './import-transaction.service';
import {RabbitMQService} from "../rabbit-mq/rabbit-mq.service";
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {editFileName, fileFilter} from 'src/shares/file-upload.utils';
import {extname} from "path";

@Controller('import-transaction')
export class ImportTransactionController {
    constructor(
        private readonly importTransactionService: ImportTransactionService,
        private readonly rabbitMQService: RabbitMQService
    ) {
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',
            filename: editFileName,
        }),
        fileFilter: fileFilter,
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        // this.rabbitMQService.send('rabbit-mq-producer', {filename: file.filename});
        const fileExtName = extname(file.originalname);
        if (fileExtName ==='.csv') {
            return this.importTransactionService.readCsvFile(file.filename);
        } else
        {
            return this.importTransactionService.readExcelFile(file.filename);
        }
    }
}
