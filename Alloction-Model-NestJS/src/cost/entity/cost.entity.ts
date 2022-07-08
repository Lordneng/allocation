
import { Entity, Column, Generated } from "typeorm"
import { CreatedEntity } from "../../common/data/models"

@Entity()
export class Cost extends CreatedEntity<number>{

    @Column({ nullable:true  })
    @Generated("uuid")
    costId: string;

    @Column({ nullable: true, length: 200 })
    cost: string

    @Column({ nullable:true  })
    @Generated("uuid")
    productId: string;

    @Column({ nullable: true, length: 200 })
    product: string;

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
    // @Column({ nullable: true, length: 200 })
    // filePath: string
}