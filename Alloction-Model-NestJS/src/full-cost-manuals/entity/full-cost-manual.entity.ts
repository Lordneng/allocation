import { CreatedEntity } from "../../common/data/models"
import { Entity, Column } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class FullCostManual extends CreatedEntity<number>{

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    product: string

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    unit: string

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    source: string

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    demand: string

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    deliveryPoint: string

    @ApiProperty()
    @Column({ nullable: true })
    year: number

    @ApiProperty()
    @Column({ nullable: true })
    month: number

    @ApiProperty()
    @Column("float", { nullable: true })
    value: number

    @ApiProperty()
    @Column({ nullable: true })
    valueMonth: number

    @ApiProperty()
    @Column({ nullable: true })
    version: number

}