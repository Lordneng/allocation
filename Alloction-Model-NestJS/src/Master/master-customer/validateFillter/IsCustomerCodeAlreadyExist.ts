import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterCustomer } from '../entity';
  
@ValidatorConstraint({name: 'IsCustomerCodeAlreadyExistField', async: true})
export class IsCustomerCodeAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterCustomer>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'Customer Code $value มีในระบบแล้วแล้ว.';
    }

    async validate(value: String, args: ValidationArguments) {
        const valueTrim = value.trim();
        const customer = await this.dataModel.createQueryBuilder()
            .where("LOWER(code) = LOWER(:code)")
            .setParameters({ code: valueTrim})
            .getOne();
      
        if(customer) return false;

        return true
    }
}
