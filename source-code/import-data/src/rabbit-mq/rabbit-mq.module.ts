import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbit-mq.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'rabbit-mq-module',
                transport: Transport.RMQ,
                options: {
                    urls: [
                        'amqps://nmikojfi:j402fWy-TnbZ1HipXjR9OztHTL5AgKqE@cougar.rmq.cloudamqp.com/nmikojfi',
                    ],
                    queue: 'rabbit-mq-nest-js',
                },
            },
        ]),
    ],
    controllers: [],
    providers: [RabbitMQService],
    exports: [RabbitMQService],
})
export class RabbitMQModule {}
