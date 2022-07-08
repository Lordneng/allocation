import { Inject } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TOKENS } from "../../../constants";
import { Repository } from "typeorm";
import { MasterProduct } from "../entity";

@ValidatorConstraint({name: 'isProductCodeIsExist', async: true})
export class ProductCodeIsExist implements ValidatorConstraintInterface {
  
    constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterProduct>,
      ) { }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'รหัสผลิตภัณฑ์ $value มีในระบบแล้ว.';
    }

    async validate(value: string, validationArguments?: ValidationArguments) {
        const valueTrim = value.trim();
        const product = await this.dataModel.createQueryBuilder()
        .where("LOWER(productCode) = LOWER(:productCode)")
        .setParameters({ productCode: valueTrim })
        .getOne();
      
        if(product) return false;

        return true
    }
}