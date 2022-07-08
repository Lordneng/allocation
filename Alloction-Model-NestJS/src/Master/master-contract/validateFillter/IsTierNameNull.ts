import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
  
@ValidatorConstraint({name: 'IsTierNameNullField', async: true})
export class IsTierNameNull implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'tier name ห้ามว่าง';
    }

    async validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['tierTypeId'];
      
        if(id && !value) return false;

        return true
    }
}