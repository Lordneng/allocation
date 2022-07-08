import { CreatedEntity } from "../../common/data/models"
import { Entity, Column } from "typeorm"


@Entity()
export class ReferencePrice extends CreatedEntity<number> {

    @Column({ length: 200 })
    unit: string

    @Column({ nullable: true,length: 200 })
    referencePriceNameFrom: string

    @Column({ nullable: true,length: 200 })
    referencePriceNameTo: string

    @Column({ nullable: true })
    year: Number;

    @Column({ nullable: true })
    month: Number;

    @Column({ nullable: true })
    version: Number;

    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number
    
    @Column("float", { nullable: true })
    value: Number

    @Column({ nullable: true, length: 200 })
    remark: string;

    @Column({ nullable: true,length: 200 })
    filePath: string

}