import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterCustomerPlant } from '../entity';
  
@ValidatorConstraint({name: 'UpdateCustomerNameAlreadyExistField', async: true})
export class UpdateCustomerPlantNameAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<MasterCustomerPlant>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'Customer Plant Name $value มีในระบบแล้วแล้ว.';
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['id'];
        const customer = await this.dataModel.findOne({where: { id: id}});
      
        if(customer) {
            if(customer.name !== value){
                const check = await this.dataModel.findOne({where: { name: value}});

                if(check) return false;
            }
        };

        return true
    }
}