import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { Turnaround } from '../entity';
  
@ValidatorConstraint({name: 'CheckUpdateTurnaroundDateField', async: true})
export class CheckUpdateTurnaroundDate implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<Turnaround>) {
    }

    defaultMessage(validationArguments: ValidationArguments) {
        return `ไม่สามารถบันทึกข้อมูลได้เนื่องจากมีข้อมูลอื่นอยู่ในช่วงเวลาเดียวกับฉบับนี้`;
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const turnaroundId = validationArguments.object['id'];
        const productName = validationArguments.object['productName'];
        const customerName = validationArguments.object['customerName'];
        const plantName = validationArguments.object['plantName'];
        const startDate = validationArguments.object['startTurnaroundDate'];
        const endDate = validationArguments.object['endTurnaroundDate'];
        const activeStatus = validationArguments.object['activeStatus'];
        const turnaround = await this.dataModel.findOne({where: {id: turnaroundId }});

        // // ('activeStatus',activeStatus);

        // // ([productName, customerName, startDate, endDate, plantName, turnaroundId]);

        if(turnaround && activeStatus == 'Active')
        {
            if(startDate != turnaround.startTurnaroundDate || endDate != turnaround.endTurnaroundDate) {

                const sql = `SELECT * FROM turnaround 
                WHERE productName = @0 
                AND customerName = @1 
                AND plantName = @4 
                AND id != @5 
                AND activeStatus = 'Active'
                AND ((CONVERT(varchar,@2,120) >= startTurnaroundDate AND CONVERT(varchar,@3,120) <= endTurnaroundDate) 
                OR (CONVERT(varchar,@2,120) < startTurnaroundDate AND CONVERT(varchar,@3,120) >= startTurnaroundDate) 
                OR (CONVERT(varchar,@2,120) >= startTurnaroundDate AND CONVERT(varchar,@2,120) <= endTurnaroundDate))`;
    
                const findData = await this.dataModel.query(sql, [productName, customerName, startDate, endDate, plantName, turnaroundId]);
    
                if(findData && findData.length > 0) return false;
            }
        }

        

        return true
    }
}