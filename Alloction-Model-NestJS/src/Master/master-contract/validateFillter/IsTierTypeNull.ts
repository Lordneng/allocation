import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
  
@ValidatorConstraint({name: 'IsTierTypeNullField', async: true})
export class IsTierTypeNull implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'tier type ห้ามว่าง';
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['tierTypeId'];
      
        if(id && !value) return false;

        return true
    }
}