import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { RevenuesController } from './revenues.controller';
import { RevenuesService } from './revenues.service';
import { RevenueProvider, RevenueVersionProvider } from './revenues.provider';
@Module({
    imports: [DatabaseModule],
    controllers: [RevenuesController],
    providers: [...RevenueProvider, ...RevenueVersionProvider , RevenuesService],
    exports: [RevenuesService],
})
export class RevenuesModule { }
