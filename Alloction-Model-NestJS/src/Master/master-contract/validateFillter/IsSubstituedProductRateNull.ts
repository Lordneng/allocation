import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

  
@ValidatorConstraint({name: 'IsSubstituedProductRateNullField', async: false})
export class IsSubstituedProductRateNull implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'Ssubstitued Product Rate ห้ามว่าง';
    }

    validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['substituedProductId'];
      
        if(id && !value) return false;

        return true
    }
}