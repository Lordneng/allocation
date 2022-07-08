import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class MenuLevel1 extends CreatedEntity<number> {
    @Column({ nullable: true, length: 200 })
    menuName: string;
    @Column({ nullable: true, length: 200 })
    menuUrl: string;
    @Column({ nullable: true, length: 200 })
    menuIcon: string;
    @Column({ nullable: true })
    menuCode: Number;
}
