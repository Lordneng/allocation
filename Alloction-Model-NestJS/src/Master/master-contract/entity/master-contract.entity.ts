import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class MasterContract extends CreatedEntity<number>{
    @Column({ nullable: true,length: 200 })
    contractGroup: string

    @Column({ nullable: true,length: 200 })
    product: string

    @Column({ nullable: true,length: 200 })
    customer: string

    @Column({ nullable: true,length: 200 })
    source: string

    @Column({ nullable: true })
    volumePerYearMin: Number

    @Column({ nullable: true })
    volumePerYearMax: Number

    @Column({ nullable: true,length: 200 })
    unit: string

    @Column({ nullable: true })
    contractStartDate: Date

    @Column({ nullable: true })
    contractEndDate: Date

    @Column({ nullable: true })
    duration: number;

    @Column({ nullable: true })
    tier: number;
}