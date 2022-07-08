import { Inject } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TOKENS } from "../../../constants";
import { Repository } from "typeorm";
import { MasterProduct } from "../entity";


@ValidatorConstraint({name: 'UpdateProductCodeField', async: true})
export class UpdateProductCodeExist implements ValidatorConstraintInterface {

    constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterProduct>,
      ) { }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'รหัสผลิตภัณฑ์ $value มีในระบบแล้ว.';
    }

    async validate(value: any, validationArguments?: ValidationArguments) {
        const valueTrim = value.trim();
        const id = validationArguments.object['id'];

        if(value){
            const product = await this.dataModel.findOne({where: { id: id }});

            if(product){
                if( product.productCode !== value) {
                    
                    const grade = await this.dataModel.createQueryBuilder()
                    .where("LOWER(productCode) = LOWER(:productCode)")
                    .setParameters({ productCode: valueTrim })
                    .getOne();
                    
                    if(grade){          
                        return false;
                    }
                }
            } 
        }

        return true;
    }
}