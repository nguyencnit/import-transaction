import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig = require('../config/ormconfig');
function DatabaseOrmModule(): DynamicModule {
    return TypeOrmModule.forRootAsync({
        useFactory: ormconfig
    })
}

@Module({
    imports: [
        DatabaseOrmModule()
    ]
})
export class DatabaseModule {}
