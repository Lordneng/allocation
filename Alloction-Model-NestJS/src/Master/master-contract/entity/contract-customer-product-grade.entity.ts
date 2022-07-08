import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column, Generated } from "typeorm"

@Entity()
export class ContractCustomerProductGrade extends CreatedEntity<number>{

    @Column({ nullable:true  })
    @Generated("uuid")
    contractId: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    customerId: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    customerPlantId: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    productId: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    productGradId: string;

    @Column({ nullable:true,length: 200 })
    productGradName: string;

    @Column({ nullable:true,length: 200 })
    productGradCode: string;

    @Column({ nullable:true})
    @Generated("uuid")
    contractConditionOfSaleId: string;

}