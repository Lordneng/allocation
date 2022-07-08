import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterContract } from '../entity';
  
@ValidatorConstraint({name: 'CheckCreateContractDateField', async: true})
export class CheckCreateContractDate implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<MasterContract>) {
    }

    defaultMessage(validationArguments: ValidationArguments) {
        return `ไม่สามารถบันทึกสัญญา ${validationArguments.object['name']} เนื่องจากมีสัญญาอื่นอยู่ในช่วงเวลาเดียวกับฉบับนี้`;
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const productName = validationArguments.object['productName'];
        const customerName = validationArguments.object['customerName'];
        const startDate = validationArguments.object['startContractDate'];
        const endDate = validationArguments.object['endContractDate'];
        const plants = validationArguments.object['customerPlants'];     

        if(plants && plants.length > 0){
            const sqlPlant = `SELECT * FROM contract
            INNER JOIN contract_customer_plant on contract.id = contract_customer_plant.contractId
            WHERE productName = @0 
            AND customerName = @1
            AND customerPlantName = @4
            AND ((CONVERT(DATE,@2,120) >= startContractDate AND CONVERT(DATE,@3,120) <= endContractDate) 
            OR (CONVERT(DATE,@2,120) <= startContractDate AND CONVERT(DATE,@3,120) >= startContractDate) 
            OR (CONVERT(DATE,@2,120) >= startContractDate AND CONVERT(DATE,@2,120) <= endContractDate))`;

            for(const plant of plants){
                
                const customer = await this.dataModel.query(sqlPlant, [productName, customerName, startDate, endDate, plant.customerPlantName]);
    
                if(customer && customer.length > 0) return false;
            }
        } else {

            const sql = `SELECT * FROM contract
            INNER JOIN contract_customer_plant on contract.id = contract_customer_plant.contractId
            WHERE productName = @0 
            AND customerName = @1
            AND ((CONVERT(DATETIME,@2,120) >= startContractDate AND CONVERT(DATETIME,@3,120) <= endContractDate) 
            OR (CONVERT(DATETIME,@2,120) < startContractDate AND CONVERT(DATETIME,@3,120) >= startContractDate) 
            OR (CONVERT(DATETIME,@2,120) >= startContractDate AND CONVERT(DATETIME,@2,120) <= endContractDate))`;

            const customer = await this.dataModel.query(sql, [productName, customerName, startDate, endDate]);
    
            if(customer && customer.length > 0) return false;            
        }

        return true
    }
}
