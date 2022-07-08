import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { User } from '../entity';
  
@ValidatorConstraint({name: 'IsUserAlreadyExistField', async: true})
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<User>) {
    }

    defaultMessage(args: ValidationArguments) {
        return 'Username $value มีผู้ใช้งานแล้ว.';
    }

    async validate(userName: any, args: ValidationArguments) {
        const user = await this.dataModel.findOne({where: {userName: userName}});
      
        if(user) return false;

        return true
    }
}

