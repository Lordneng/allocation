import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class MasterPlant extends CreatedEntity<number>{
    
    @Column({ nullable: true,length: 200 })
    customerId: string

    @Column({ nullable: true,length: 200 })
    name: string
    
    @Column({ nullable: true })
    rowOrder: Number

}