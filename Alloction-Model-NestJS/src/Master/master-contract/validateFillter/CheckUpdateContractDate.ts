import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { Contract } from '../entity';
import moment from 'moment';
  
@ValidatorConstraint({name: 'CheckUpdateContractDateField', async: true})
export class CheckUpdateContractDate implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<Contract>) {
    }

    defaultMessage(validationArguments: ValidationArguments) {
        return `ไม่สามารถบันทึกสัญญา ${validationArguments.object['name']} เนื่องจากมีสัญญาอื่นอยู่ในช่วงเวลาเดียวกับฉบับนี้`;
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const contractId : string = validationArguments.object['id'];
        const productName : string = validationArguments.object['productName'];
        const customerName :string = validationArguments.object['customerName'];
        const startDate  = validationArguments.object['startContractDate'];
        const endDate = validationArguments.object['endContractDate'];
        const plants = validationArguments.object['customerPlants'];
        
        const contract = await this.dataModel.findOne({where: {id: contractId }});        
        const startDateText = moment(contract.startContractDate).format('YYYY-MM-DD');
        const endDateText = moment(contract.startContractDate).format('YYYY-MM-DD');

        if(contract)
        {
            if(startDate !== startDateText || 
               endDate !== endDateText) {
                if(plants && plants.length > 0){
                    const sqlPlant = `SELECT * FROM contract
                    INNER JOIN contract_customer_plant on contract.id = contract_customer_plant.contractId
                    WHERE productName = @0 
                    AND customerName = @1
                    AND customerPlantName = @4
                    AND contract.id != @5
                    AND ((CONVERT(DATE,@2,120) >= startContractDate AND CONVERT(DATE,@3,120) <= endContractDate) 
                    OR (CONVERT(DATE,@2,120) <= startContractDate AND CONVERT(DATE,@3,120) >= startContractDate) 
                    OR (CONVERT(DATE,@2,120) >= startContractDate AND CONVERT(DATE,@2,120) <= endContractDate))`;
        
                    for(const plant of plants){
                        const customer = await this.dataModel.query(sqlPlant, 
                            [productName, customerName, startDate, endDate, plant.customerPlantName, contractId]);
            
                        if(customer && customer.length > 0) return false;
                    }
                } 
            }
        }

        

        return true
    }
}