import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class MasterGrade extends CreatedEntity<number>{
    
    @Column({ nullable: true,length: 200 })
    productId: string

    @Column({ nullable: true,length: 200 })
    productGrade: string
    
}