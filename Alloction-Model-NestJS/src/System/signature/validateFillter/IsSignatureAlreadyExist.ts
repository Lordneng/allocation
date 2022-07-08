import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    notContains,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Not, Repository } from 'typeorm';
import { Signature } from '../entity';
import { v4 as uuid } from 'uuid';
  
@ValidatorConstraint({name: 'IsSignatureAlreadyExistField', async: true})
export class IsSignatureAlreadyExist implements ValidatorConstraintInterface {
    constructor(
        @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<Signature>) {
    }

    defaultMessage(args: ValidationArguments) {
        const lastName = args.object['lastName'];
        return '$value ' + lastName + ' มีผู้ใช้งานแล้ว.';
    }

    async validate(firstName: any, args: ValidationArguments) {

        let id = args.object['id'];

        if(!id){id = uuid();}
        
        const lastName = args.object['lastName'];

        const signature = await this.dataModel.findOne({where: { id: Not(id), firstName: firstName.trim(), lastName: lastName.trim(),}});
      
        if(signature) return false;

        return true
    }
}

