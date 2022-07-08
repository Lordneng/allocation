
import { Entity, Column, Generated } from "typeorm";
import { CreatedEntity } from "../../common/data/models";

@Entity()
export class CalMarginVersion extends CreatedEntity<number> {

    @Column({ nullable: true, length: 200 })
    unit: string;
    
    @Column({ nullable: true, length: 200 })
    versionName: string;

    @Column({ nullable: true, length: 200 })
    filePath: string;

    @Column({ nullable: true, length: 200 })
    fileName: string;

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    month: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true })
    isApply: boolean

    @Column({ nullable: true })
    @Generated("uuid")
    costProductTypeId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    costVersionId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    referencePriceVersionId: string;

}