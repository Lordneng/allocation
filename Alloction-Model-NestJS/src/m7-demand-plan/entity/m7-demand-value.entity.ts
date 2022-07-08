import { CreatedEntity } from "../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class M7DemandValue extends CreatedEntity<number> {
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true })
    yearValue: number

    @Column({ nullable: true })
    monthValue: number

    @Column({ nullable: true })
    version: Number

    @Column("float")
    value: Number

    @Column({ nullable:true  })
    @Generated("uuid")
    productId: string;

    @Column({ nullable:true,length: 255 })
    productName: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    unitId: string;

    @Column({ nullable:true,length: 50 })
    unitName: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    customerId: string;

    @Column({ nullable:true,length: 500 })
    customerName: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    sourceId: string;

    @Column({ nullable:true,length: 500 })
    sourceName: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    deliveryId: string;

    @Column({ nullable:true,length: 500 })
    deliveryName: string;

    @Column({ nullable:true,length: 4000 })
    demandName: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    contractId: string;

    @Column({ nullable:true })
    @Generated("uuid")
    contractConditionOfSaleId: string;

}