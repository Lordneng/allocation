import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class MasterCustomerType extends CreatedEntity<number>{

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    code: string

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    name: string

}