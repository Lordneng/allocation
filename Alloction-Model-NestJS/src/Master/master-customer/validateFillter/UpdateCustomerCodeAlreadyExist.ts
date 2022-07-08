import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterCustomer } from '../entity';
  
@ValidatorConstraint({name: 'UpdateCustomerCodeAlreadyExistField', async: true})
export class UpdateCustomerCodeAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterCustomer>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'Customer Code $value มีในระบบแล้วแล้ว.';
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const valueTrim = value.trim();
        const id = validationArguments.object['id'];
        const customer = await this.dataModel.findOne({where: { id: id}});
        
        if(customer) {
            if(customer.code !== value){
                // (value);
                const check = await this.dataModel.createQueryBuilder()
                .where("LOWER(code) = LOWER(:code)")
                .setParameters({ code: valueTrim})
                .getOne();

                if(check) return false;
            }
        };

        return true
    }
}
