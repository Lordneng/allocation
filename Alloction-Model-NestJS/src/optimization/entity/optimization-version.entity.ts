import { CreatedEntity } from "../../common/data/models"
import { Entity, Column, Generated } from "typeorm"

@Entity()
export class OptimizationVersion extends CreatedEntity<number>{
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true, length: 200 })
    filePath: string

    @Column({ nullable: true, length: 200 })
    fileName: string

    @Column({ nullable: true, length: 200 })
    fileNameUser: string

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true, length: 200 })
    versionName: string

    @Column({ nullable: true })
    @Generated("uuid")
    abilityPlanRayongId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    abilityPlanRayongOldId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    abilityPentaneId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    abilityPlanKhmId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    abilityRefineryId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    calMarginId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    tankCapId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    lRbyLegalId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    depotConstrainId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    volumeConstrainId: string;

    @Column({ default: false })
    isWithOutDemandAI: boolean;

    @Column({ nullable: true })
    jsonFormModel: string;

    @Column({ nullable: true })
    jsonToModel: string;
}