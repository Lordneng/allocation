import { CreatedEntity } from "../../common/data/models"
import { Entity, Column } from "typeorm"


@Entity()
export class ReferencePriceActual extends CreatedEntity<string> {

    @Column({ length: 200 })
    unit: string

    @Column({ nullable: true,length: 200 })
    referencePriceNameFrom: string

    @Column({ nullable: true,length: 200 })
    referencePriceNameTo: string

    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number
    
    @Column("float", { nullable: true })
    value: Number

    @Column({ nullable: true, length: 200 })
    remark: string;
}