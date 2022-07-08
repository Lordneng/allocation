import { Inject } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TOKENS } from "../../../constants";
import { Repository } from "typeorm";
import { MasterProduct } from "../entity";

@ValidatorConstraint({name: 'isProductNameIsExist', async: true})
export class ProductNameIsExist implements ValidatorConstraintInterface {
  
    constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterProduct>,
      ) { }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'ผลิตภัณฑ์ $value มีในระบบแล้ว.';
    }

    async validate(value: string, validationArguments?: ValidationArguments) {
        const valueTrim = value.trim();
        const product = await this.dataModel.createQueryBuilder()
        .where("LOWER(productName) = LOWER(:productName)")
        .setParameters({ productName: valueTrim })
        .getOne();;
      
        if(product) return false;

        return true
    }
}