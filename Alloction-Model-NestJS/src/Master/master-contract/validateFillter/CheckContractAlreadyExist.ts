import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { Contract } from '../entity';
  
@ValidatorConstraint({name: 'CheckContractAlreadyExistField', async: true})
export class CheckContractAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<Contract>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'ไม่พบสัญญาฉบับนี้ในระบบ.';
    }

    async validate(value: any, args: ValidationArguments) {
        const contract = await this.dataModel.findOne({where:{id: value}});
      
        if(!contract) return false;

        return true
    }
}