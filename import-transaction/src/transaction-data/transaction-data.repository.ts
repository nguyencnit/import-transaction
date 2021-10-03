import { EntityRepository, Repository } from "typeorm";
import { TransactionDataEntity } from "./entities/transaction-data.entity";

@EntityRepository(TransactionDataEntity)
export class TransactionDataRepository extends Repository<TransactionDataEntity> {
    constructor() {
        super();
    }

}
