import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { LRByLegalController } from './lr-by-legal.controller';
import { LRByLegalService } from './lr-by-legal.service';
import { LRByLegalProvider, LRByLegalVersionProvider, LRByLegalFormProvider, LRByLegalFormHistoryProvider, LRByLegalHistoryProvider } from './lr-by-legal.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [LRByLegalController],
    providers: [...LRByLegalProvider, ...LRByLegalVersionProvider, ...LRByLegalFormProvider,...LRByLegalFormHistoryProvider,...LRByLegalHistoryProvider, LRByLegalService],
    exports: [LRByLegalService],
})
export class LRByLegalModule { }
