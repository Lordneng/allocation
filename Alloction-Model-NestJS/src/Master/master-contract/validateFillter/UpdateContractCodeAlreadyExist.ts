import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { Contract } from '../entity';
  
@ValidatorConstraint({name: 'UpdateCustomerCodeAlreadyExistField', async: true})
export class UpdateContractCodeAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<Contract>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'Customer Code $value มีในระบบแล้วแล้ว.';
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['id'];
        const contract = await this.dataModel.findOne({where: { id: id}});
      
        if(contract) {
            if(contract.code !== value){
                const check = await this.dataModel.findOne({where: { code: value}});

                if(check) return false;
            }
        };

        return true
    }
}