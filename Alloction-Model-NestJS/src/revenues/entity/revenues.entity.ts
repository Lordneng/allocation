import { CreatedEntity } from "../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class Revenue extends CreatedEntity<number> {
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true, length: 200 })
    productValue: string

    @Column({ nullable: true, length: 200 })
    product: string
    
    @Column({ nullable: true, length: 200 })
    unit: string

    @Column({ nullable: true })
    M1: Number

    @Column({ nullable: true })
    M2: Number

    @Column({ nullable: true })
    M3: Number

    @Column({ nullable: true })
    M4: Number

    @Column({ nullable: true })
    M5: Number

    @Column({ nullable: true })
    M6: Number

    @Column({ nullable: true })
    M7: Number

    @Column({ nullable: true })
    M8: Number

    @Column({ nullable: true })
    M9: Number

    @Column({ nullable: true })
    M10: Number

    @Column({ nullable: true })
    M11: Number

    @Column({ nullable: true })
    M12: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true, length: 200 })
    filePath: string

}