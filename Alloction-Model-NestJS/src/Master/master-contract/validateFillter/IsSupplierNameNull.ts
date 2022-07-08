import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
  
@ValidatorConstraint({name: 'IsSupplierNameNullField', async: false})
export class IsSupplierNameNull implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'Supplier ห้ามว่าง';
    }

    validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['supplierId'];
      
        if(id && !value) return false;

        return true
    }
}