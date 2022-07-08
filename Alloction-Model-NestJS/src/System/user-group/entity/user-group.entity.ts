import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class UserGroup extends CreatedEntity<number>{

    @Column({ nullable: true, length: 200 })
    name: string

    @Column({ nullable: true, length: 200 })
    activeStatus: string

}