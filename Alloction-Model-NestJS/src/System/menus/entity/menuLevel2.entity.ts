import { Entity, Column, Generated } from "typeorm";
import { MenuLevel1 } from "./menuLevel1.entity";


@Entity()
export class MenuLevel2 extends MenuLevel1 {
    @Column({ nullable: true })
    @Generated("uuid")
    menuLevel1Id: string;
}
