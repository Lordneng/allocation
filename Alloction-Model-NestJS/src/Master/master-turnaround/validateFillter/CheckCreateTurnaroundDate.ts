import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { Turnaround } from '../entity';
  
@ValidatorConstraint({name: 'CheckCreateTurnaroundDateField', async: true})
export class CheckCreateTurnaroundDate implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<Turnaround>) {
    }

    defaultMessage(validationArguments: ValidationArguments) {
        return `ไม่สามารถบันทึกข้อมูลได้เนื่องจากมีข้อมูลอื่นอยู่ในช่วงเวลาเดียวกับฉบับนี้`;
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const plantName = validationArguments.object['plantName'];
        const productName = validationArguments.object['productName'];
        const customerName = validationArguments.object['customerName'];
        const startDate = validationArguments.object['startTurnaroundDate'];
        const endDate = validationArguments.object['endTurnaroundDate'];
        const activeStatus = validationArguments.object['activeStatus'];

        // // ('activeStatus',activeStatus);

        // // ([productName, customerName, plantName, startDate, endDate]);

        if(activeStatus == 'Active'){

            const sql = `SELECT * FROM turnaround 
            WHERE productName = @0
            AND customerName = @1
            AND plantName = @2
            AND activeStatus = 'Active'
            AND ((CONVERT(varchar,@3,120) >= startTurnaroundDate AND CONVERT(varchar,@4,120) <= endTurnaroundDate)
            OR (CONVERT(varchar,@3,120) < startTurnaroundDate AND CONVERT(varchar,@4,120) >= startTurnaroundDate)
            OR (CONVERT(varchar,@3,120) >= startTurnaroundDate AND CONVERT(varchar,@3,120) <= endTurnaroundDate))`;

            const findData = await this.dataModel.query(sql, [productName, customerName, plantName, startDate, endDate]);

            if(findData && findData.length > 0) return false;

        }

        return true
    }
}
