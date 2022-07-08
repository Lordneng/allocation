import { Inject } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TOKENS } from "../../../constants";
import { Repository } from "typeorm";
import { MasterProductFullCostFormula } from "../entity";


@ValidatorConstraint({name: 'UpdateProductFormulaField', async: true})
export class UpdateProductFormula implements ValidatorConstraintInterface {
    message: string;

    constructor(@Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<MasterProductFullCostFormula>,
      ) { }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return this.message;
    }

    async validate(value: any, validationArguments?: ValidationArguments) {

        const id = validationArguments.object['id'];
        const productId = validationArguments.object['productId'];
        const sourceId = validationArguments.object['sourceId'];
        const source = validationArguments.object['source'];
        const gradeValue = validationArguments.object['productGrade'];
        const deliveryPointId = validationArguments.object['deliveryPointId'];
        const deliveryPoint = validationArguments.object['deliveryPoint'];

        if(value){
            const productGrade = await this.dataModel.findOne({where: { id: id }});

            if(productGrade){
                if( productGrade.productGradeId !== value ||
                    productGrade.sourceId !== sourceId ||
                    productGrade.deliveryPointId !== deliveryPointId){
                    
                    const grade = await this.dataModel.findOne({where: { 
                        productId: productId,
                        productGradeId: value, 
                        sourceId: sourceId, 
                        deliveryPointId: deliveryPointId 
                    }})
                    
                    if(grade){
                        this.message = `เกรดผลิตภัณฑ์ ${gradeValue} Source ${source} และ Delivery Point ${deliveryPoint} มีในระบบแล้ว`
                        return false;
                    }
                }
            } else{
                const productGrade = await this.dataModel.findOne({where: { 
                    productId: productId,
                    productGradeId: value, 
                    sourceId: sourceId, 
                    deliveryPointId: deliveryPointId }})
            
                if(productGrade){
                    this.message = `เกรดผลิตภัณฑ์ ${value} Source ${source} และ Delivery Point ${deliveryPoint} มีในระบบแล้ว`
                    return false;
                }
            }

            
        }
        else{
            // const productGrade = await this.dataModel.findOne({where: { id: id }});

            // if(productGrade){
            //     if(productGrade.sourceId !== sourceId || productGrade.deliveryPointId !== deliveryPointId){
                
            //         const grade = await this.dataModel.findOne({where: { sourceId: sourceId, deliveryPointId: deliveryPointId }})
                    
            //         if(grade){
            //             this.message = `Source ${sourceId} และ Delivery Point ${deliveryPointId} มีในระบบแล้ว`
            //             return false;
            //         }
            //     }
            // } else {
            //     const productGrade = await this.dataModel.findOne({where: { sourceId: sourceId, deliveryPointId: deliveryPointId }})

            //     if(productGrade){
            //         this.message = `Source ${sourceId} และ Delivery Point ${deliveryPointId} มีในระบบแล้ว`
            //         return false;
            //     }
            // }

            
        }

        return true;
    }
}