import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterCustomer, MasterCustomerPlant } from '../entity';
  
@ValidatorConstraint({name: 'IsCustomerPlantNameAlreadyExistField', async: true})
export class IsCustomerPlantNameAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<MasterCustomerPlant>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'Customer Plant Name $value มีในระบบแล้วแล้ว.';
    }

    async validate(value: String, args: ValidationArguments) {
        const valueTrim = value.trim();
        const customerPlant = await this.dataModel.createQueryBuilder()
            .where("LOWER(name) = LOWER(:name)")
            .setParameters({ name: valueTrim})
            .getOne();
      
        if(customerPlant) return false;

        return true
    }
}
