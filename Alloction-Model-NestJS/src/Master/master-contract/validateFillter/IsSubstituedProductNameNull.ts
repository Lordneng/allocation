import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
  
@ValidatorConstraint({name: 'IsSubstituedProductNameNullField', async: false})
export class IsSubstituedProductNameNull implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'Ssubstitued Product ห้ามว่าง';
    }

    validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['substituedProductId'];
      
        if(id && !value) return false;

        return true
    }
}