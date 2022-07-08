import { Entity, Column } from "typeorm";
import { CreatedEntity } from "../../../common/data/models";

@Entity()
export class AbilityPentaneVersion extends CreatedEntity<number> {
    
    @Column({ nullable: true, length: 200 })
    versionName: string;

    @Column({ nullable: true, length: 200 })
    filePath: string;

    @Column({ nullable: true, length: 200 })
    fileName: string;

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    month: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true })
    isApply: boolean

}