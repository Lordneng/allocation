import { CreatedEntity } from "../../common/data/models";
import { Entity, Column } from "typeorm";

@Entity()
export class ReferencePriceVersion extends CreatedEntity<number> {
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true, length: 200 })
    filePath: string
    
    @Column({ nullable: true, length: 200 })
    fileName: string

    @Column({ nullable: true })
    version: number

    @Column({ nullable: true, length: 200 })
    versionName: string

    @Column({ nullable: true, length: 200 })
    fileNameUser: string

    @Column({ nullable: true })
    isApply: boolean

    @Column({ nullable: true,length: 200 })
    action: string;

    @Column({ nullable: true,length: 200 })
    unit: string;

    @Column({ nullable: true,length: 200 })
    refPriceNameFrom: string

    @Column({ nullable: true,length: 200 })
    refPriceNameTo: string

    @Column({ nullable: true,length: 200 })
    filePath1: string
    
    @Column({ nullable: true,length: 200 })
    fileName1: string

    @Column({ nullable: true,length: 200 })
    file1Modifiedby: string

    @Column({ nullable: true,type: 'datetime' })
    file1ModifiedDate: string;

    @Column({ nullable: true,length: 200 })
    filePath2: string
    
    @Column({ nullable: true,length: 200 })
    fileName2: string

    @Column({ nullable: true,length: 200 })
    file2Modifiedby: string

    @Column({ nullable: true,type: 'datetime' })
    file2ModifiedDate: string;

    @Column({ nullable: true,length: 200 })
    filePath3: string
    
    @Column({ nullable: true,length: 200 })
    fileName3: string

    @Column({ nullable: true,length: 200 })
    file3Modifiedby: string

    @Column({ nullable: true,type: 'datetime' })
    file3ModifiedDate: string;
}