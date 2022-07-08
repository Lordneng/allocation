import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterCustomer } from '../entity';
  
@ValidatorConstraint({name: 'UpdateCustomerNameAlreadyExistField', async: true})
export class UpdateCustomerNameAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterCustomer>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'Customer Name $value มีในระบบแล้วแล้ว.';
    }

    async validate(value: String, validationArguments: ValidationArguments) {
        const id = validationArguments.object['id'];
        const customer = await this.dataModel.findOne({where: { id: id}});
        const valueTrim = value.trim();

        if(customer) {
            if(customer.name !== value){
                const check = await this.dataModel.createQueryBuilder()
                .where("LOWER(name) = LOWER(:name)")
                .setParameters({ name: valueTrim})
                .getOne();

                if(check) return false;
            }
        };

        return true
    }
}
