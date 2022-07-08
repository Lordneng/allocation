import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class MasterDeliveryPoint extends CreatedEntity<number>{
    @Column({ nullable: true, length: 200 })
    code: string

    @Column({ nullable: true, length: 200 })
    name: string

    @Column({ nullable: true, length: 200 })
    activeStatus: string

    @Column({ nullable: true, length: 200 })
    transportationTypeCode: string

    @Column({ nullable: true, length: 200 })
    transportationTypeName: string
}