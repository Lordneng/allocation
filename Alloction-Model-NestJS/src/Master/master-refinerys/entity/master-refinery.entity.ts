import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class MasterRefinery extends CreatedEntity<number> {
    @Column({ nullable: true, length: 200 })
    code: string;

    @Column({ nullable: true, length: 200 })
    name: string;

    @Column({ nullable: true })
    @Generated("uuid")
    productGradeId: string

    @Column({ nullable: true, length: 200 })
    productGrade: string

}