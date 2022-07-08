import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column, Generated } from "typeorm"

@Entity()
export class Turnaround extends CreatedEntity<number>{

    @Column({ nullable:true  })
    @Generated("uuid")
    turnaroundTypeId: string;

    @Column({ nullable:true,length: 200 })
    turnaroundTypeName: string;

    @Column({ nullable:true  })
    startTurnaroundDate: Date;

    @Column({ nullable:true, })
    endTurnaroundDate: Date;

    @Column({ nullable:true  })
    @Generated("uuid")
    productId: string;

    @Column({ nullable:true,length: 200 })
    productName: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    plantId: string;

    @Column({ nullable:true,length: 200 })
    plantName: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    customerId: string;

    @Column({ nullable:true,length: 200 })
    customerName: string;

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    duration: Number

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    percent: Number

}