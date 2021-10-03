import {Controller, Post, UseInterceptors, UploadedFile} from '@nestjs/common';
import {ImportTransactionService} from './import-transaction.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {fileFilter} from 'src/shares/file-upload.utils';

@Controller('import-transaction')
export class ImportTransactionController {
    constructor(
        private readonly importTransactionService: ImportTransactionService,
    ) {
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: fileFilter,
    }))
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
            return this.importTransactionService.readFileBuffer(file.buffer);
    }
}
