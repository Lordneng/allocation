import { Module } from '@nestjs/common';
import { OptimizationsModule } from '../../optimization/optimizations.module';
import { DatabaseModule } from '../../common/providers';
import { SummaryReportController } from './summary-report.controller';
import { SummaryReportService } from './summary-report.service';
import { CalMarginModule } from '../../cal-margin/cal-margin.modules';
import { ReferencePricesModule } from '../../reference-prices/reference-prices.module';


@Module({
    imports: [DatabaseModule,
        OptimizationsModule,
        CalMarginModule,
        ReferencePricesModule
    ],
    controllers: [SummaryReportController],
    providers: [SummaryReportService],
    exports: [SummaryReportService],
})
export class SummaryReportModule { }