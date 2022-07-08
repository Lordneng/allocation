import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

  
@ValidatorConstraint({name: 'IsTierMaxVolumnNullField', async: false})
export class IsTierMaxVolumnNull implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'Volume Tier (Max) ห้ามว่าง';
    }

    validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['tierTypeId'];
      
        if(id && !value) return false;

        return true
    }
}