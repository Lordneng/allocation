import { CreatedEntity } from "../../common/data/models";
import { Entity, Column, Generated } from "typeorm";

@Entity()
export class M7DemandPlanVersion extends CreatedEntity<number> {
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true })
    version: number

    @Column({ nullable: true, length: 200 })
    versionName: string

    @Column({ nullable: true, length: 200 })
    filePath: string
    
    @Column({ nullable: true, length: 200 })
    fileName: string

    @Column({ nullable: true, length: 200 })
    fileNameUser: string

    @Column({ nullable:true  })
    @Generated("uuid")
    abilityPlanKhmVersionId: string;

    @Column({ nullable:true})
    @Generated("uuid")
    abilityRefineryVersionId: string;
}