import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { Contract } from '../entity';
  
@ValidatorConstraint({name: 'IsContractCodeAlreadyExistField', async: true})
export class IsContractCodeAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<Contract>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'Contract Code $value มีในระบบแล้วแล้ว.';
    }

    async validate(value: any, args: ValidationArguments) {
        const contract = await this.dataModel.findOne({where:{code: value}});
      
        if(contract) return false;

        return true
    }
}