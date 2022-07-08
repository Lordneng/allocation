import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({name: 'IsUnitNullField', async: false})
export class IsUnitNull implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'unit name ห้ามว่าง';
    }

    validate(value: any, validationArguments: ValidationArguments) {
        const id = validationArguments.object['unitId'];
      
        if(id && !value) return false;

        return true
    }
}