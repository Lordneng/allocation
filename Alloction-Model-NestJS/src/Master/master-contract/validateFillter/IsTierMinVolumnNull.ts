import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
  
@ValidatorConstraint({name: 'IsTierMinVolumnNullField', async: true})
export class IsTierMinVolumnNull implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'Volume Tier (Min) ห้ามว่าง';
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['tierTypeId'];
      
        if(id && !value) return false;

        return true
    }
}