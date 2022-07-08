import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column, Generated } from "typeorm"

@Entity()
export class ContractRunningNumber extends CreatedEntity<number>{

    @Column({ nullable:true  })
    year: number;

    @Column({ nullable:true  })
    no: number;

}