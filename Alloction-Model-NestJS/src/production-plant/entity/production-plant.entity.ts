import { CreatedEntity } from "../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class ProductionPlant extends CreatedEntity<number>{
    
    @Column({ nullable: true,length: 50 })
    code: string

    @Column({ nullable: true,length: 200 })
    fullName: string
    
    @Column({ nullable: true,length: 200 })
    shortName: string

}