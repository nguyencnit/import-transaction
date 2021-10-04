import { IsDateString, IsNotEmpty, IsNumberString, MaxLength} from 'class-validator';
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
}
