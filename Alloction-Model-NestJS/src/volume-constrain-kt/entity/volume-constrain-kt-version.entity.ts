import { CreatedEntity } from "../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class VolumeConstrainKtVersion extends CreatedEntity<number> {
    @Column({ nullable: true, length: 200 })
    action: string;

    @Column({ nullable: true, length: 200 })
    remark: string;

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
    versionForm: Number

    @Column({ nullable: true })
    version: Number

}