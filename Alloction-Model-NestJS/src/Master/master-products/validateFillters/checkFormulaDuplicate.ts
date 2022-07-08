import { Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TOKENS } from "../../../constants";
import { Repository } from 'typeorm';
import { MasterProduct } from '../entity';
import { ProductFullCostFormulaCreateDto } from '../models/productFullCostFormulaCreateDto';
  
@ValidatorConstraint({name: 'CheckFormulaDuplicateField', async: true})
export class CheckFormulaDuplicate implements ValidatorConstraintInterface {

    defaultMessage(args: ValidationArguments) {
        return 'มีการทำรายการ เกรดผลิตภัณฑ์ Source และ Deliver Point ซ้ำกัน';
    }

    async validate(formulas: ProductFullCostFormulaCreateDto[], args: ValidationArguments) {

        const dataFilter = formulas;

        for(const formula of formulas){

            let checkValue : any = [];

            if(formula.productGradeId){
                checkValue = dataFilter.filter(x => x.productGradeId === formula.productGradeId &&
                    x.sourceId === formula.sourceId && x.deliveryPointId === formula.deliveryPointId)
            } else {
                checkValue = dataFilter.filter(x => 
                    x.sourceId === formula.sourceId && 
                    x.deliveryPointId === formula.deliveryPointId)
            }

            if(checkValue && checkValue.length > 0){
                return false;
            }
        }

        return true;   
    }
}
