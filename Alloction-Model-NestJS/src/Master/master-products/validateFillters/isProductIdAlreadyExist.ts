import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterProduct } from '../entity';
  
@ValidatorConstraint({name: 'IsProductIdAlreadyExistField', async: true})
export class IsProductIdAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterProduct>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'ไม่พบ ผลิตภัณฑ์ นี้ในระบบ.';
    }

    async validate(value: any, args: ValidationArguments) {
        const product = await this.dataModel.findOne({where: { id: value}});
      
        if(!product) return false;

        return true
    }
}
