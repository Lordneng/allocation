import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterCustomer } from '../entity';
  
@ValidatorConstraint({name: 'IsCustomerIdAlreadyExistField', async: true})
export class IsCustomerIdAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterCustomer>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'ไม่พบ Customer นี้ในระบบ.';
    }

    async validate(value: any, args: ValidationArguments) {
        const customer = await this.dataModel.findOne({where: { id: value}});
      
        if(!customer) return false;

        return true
    }
}
