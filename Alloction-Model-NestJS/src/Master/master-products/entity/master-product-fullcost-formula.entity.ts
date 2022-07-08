import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column, Generated } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductFormularValidateConstraint } from "../validateFillters/productFormularValidateConstraint";
import { Validate } from "class-validator";


@Entity()
export class MasterProductFullCostFormula extends CreatedEntity<number> {

    @ApiProperty()
    @Column({ nullable: true })
    @Generated("uuid")
    productId: string;
    
    @ApiProperty()
    @Column({ nullable: true,default:null })
    @Generated("uuid")
    @Validate(ProductFormularValidateConstraint)
    productGradeId: string;
    
    @ApiProperty()
    @Column({ nullable: true, default: null })
    @Generated("uuid")
    sourceId: string;
    
    @ApiProperty()
    @Column({ nullable: true })
    @Generated("uuid")
    deliveryPointId: string;

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    fullcostFormula: string;

}