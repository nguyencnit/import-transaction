export class CreateTransactionDataDto {
    // @IsDate()
    date: Date;

    // @IsNotEmpty()
    content: string;

    // @IsNotEmpty()
    // @IsNumber()
    amount: number;

    type: string;
}
