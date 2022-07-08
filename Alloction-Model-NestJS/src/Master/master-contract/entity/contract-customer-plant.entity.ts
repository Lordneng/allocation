import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column, Generated } from "typeorm"

@Entity()
export class ContractCustomerPlant extends CreatedEntity<number>{

    @Column({ nullable:true  })
    @Generated("uuid")
    contractId: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    customerId: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    customerPlantId: string;

    @Column({ nullable:true,length: 200 })
    customerPlantName: string;

}