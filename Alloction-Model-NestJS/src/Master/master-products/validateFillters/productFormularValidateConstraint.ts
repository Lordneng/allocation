import { Inject } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TOKENS } from "../../../constants";
import { Repository } from "typeorm";
import { MasterProductFullCostFormula } from "../entity";


@ValidatorConstraint({name: 'isEqualProductGradeIdField', async: true})
export class ProductFormularValidateConstraint implements ValidatorConstraintInterface {
    message: string;

    constructor(@Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<MasterProductFullCostFormula>,
      ) { }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return this.message;
    }

    async validate(value: any, validationArguments?: ValidationArguments) {

        const productId = validationArguments.object['productId'];
        const sourceId = validationArguments.object['sourceId'];
        const source = validationArguments.object['source'];
        const gradeValue = validationArguments.object['productGrade'];
        const deliveryPointId = validationArguments.object['deliveryPointId'];
        const deliveryPoint = validationArguments.object['deliveryPoint'];

        if(value){
            const productGrade = await this.dataModel.findOne(
                {where: { 
                    productId: productId,
                    productGradeId: value, 
                    sourceId: sourceId,
                    deliveryPointId: deliveryPointId 
                }})
            
            if(productGrade){
                this.message = `เกรดผลิตภัณฑ์ ${gradeValue} Source ${source} และ Delivery Point ${deliveryPoint} มีในระบบแล้ว`
                return false;
            }
        }
        else{
            const productGrade = await this.dataModel.findOne({where: { 
                productId: productId,
                sourceId: sourceId, 
                deliveryPointId: deliveryPointId 
            }})

            if(productGrade){
                this.message = `Source ${source} และ Delivery Point ${deliveryPoint} มีในระบบแล้ว`
                return false;
            }
        }

        return true;
    }
}