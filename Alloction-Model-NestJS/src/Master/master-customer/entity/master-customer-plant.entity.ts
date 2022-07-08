import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column, Generated } from "typeorm"
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class MasterCustomerPlant extends CreatedEntity<string>{

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    code: string

    @ApiProperty()
    @Column({ nullable: true })
    @Generated("uuid")
    customerId: string;

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    name: string;

}