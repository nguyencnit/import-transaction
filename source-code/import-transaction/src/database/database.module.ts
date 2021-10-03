import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig = require('../config/ormconfig');
function DatabaseOrmModule(): DynamicModule {
    // we could load the configuration from dotEnv here,
    // but typeORM cli would not be able to find the configuration file.
    // return TypeOrmModule.forRoot(ormconfig);
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
