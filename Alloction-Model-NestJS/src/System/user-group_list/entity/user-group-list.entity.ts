import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class UserGroupList extends CreatedEntity<number>{

    @Column({ nullable: false, length: 200 })
    user_id: string

    @Column({ nullable: false, length: 200 })
    user_group_id: string

}