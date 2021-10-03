import { IsDateString, IsNotEmpty, IsNumberString, MaxLength, IsNumber, IsDate } from 'class-validator';
export class TransactionDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @MaxLength(200)
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsNumberString()
    amount: number;

    @MaxLength(100)
    type: string;

    constructor(date,content,amount,type) {
        this.date = date;
        this.content= content;
        this.amount = amount;
        this.type = type;
    }
}
