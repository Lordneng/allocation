import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class MasterCustomer extends CreatedEntity<number>{

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    code: string

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    name: string

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    shortName: string

    @ApiProperty()
    @Column({ nullable: true })
    customerTypeCode: string;

    @ApiProperty()
    @Column({ nullable: true })
    customerTypeName: string;

}