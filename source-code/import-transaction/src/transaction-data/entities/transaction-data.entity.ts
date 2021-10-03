import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('transaction_data')
export class TransactionDataEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "date", type: "datetime" })
    date: Date;

    @Column({ name: "content", type: "varchar", length: 200, nullable: true })
    content: string;

    @Column({ name: "amount", type: "decimal", precision: 13, scale: 3, nullable: true })
    amount: number;

    @Column({ name: "type", type: "varchar", length: 100, nullable: true })
    type: string;
}
