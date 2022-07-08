import { CreatedEntity } from "../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class M7DemandPlan extends CreatedEntity<number> {
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true })
    yearValue: number

    @Column({ nullable: true })
    monthValue: number

    @Column({ nullable: true })
    version: Number

    @Column("float")
    brpPttepValue: Number

    @Column({ nullable: true, length: 4000 })
    brpPttepRemark: string

    @Column("float")
    ptttankValue: Number

    @Column({ nullable: true, length: 4000 })
    ptttankRemark: string

    @Column("float")
    mtPtttankRefineryValue: Number

    @Column({ nullable: true, length: 4000 })
    mtPtttankRefineryRemark: string

    @Column("float")
    propaneValue: Number

    @Column({ nullable: true, length: 4000 })
    propaneRemark: string

    @Column("float")
    importForExportValue: Number

    @Column({ nullable: true, length: 4000 })
    importForExportRemark: string

    @Column("float")
    spotOdorlessLpgValue: Number

    @Column({ nullable: true, length: 4000 })
    spotOdorlessLpgRemark: string

    @Column({ nullable:true  })
    @Generated("uuid")
    unitId: string;

    @Column({ nullable:true,length: 200 })
    unitName: string;

    @Column("float")
    total: Number;
}