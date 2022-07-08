import { CreatedEntity } from "../../common/data/models";
import { Entity, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";


@Entity()
export class SellingPricesManual extends CreatedEntity<number> {
    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    product: string;

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    unit: string;

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    source: string;

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    demand: string;

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    deliveryPoint: string;

    @ApiProperty()
    @Column({ nullable: true })
    year: Number

    @ApiProperty()
    @Column({ nullable: true })
    month: Number

    @ApiProperty()
    @Column("float", { nullable: true })
    value: Number

    @ApiProperty()
    @Column({ nullable: true })
    version: Number

    @ApiProperty()
    @Column({ nullable: true, length: 200 })
    filePath: string

    @ApiProperty()
    @Column({ nullable: true })
    valueMonth: number

}