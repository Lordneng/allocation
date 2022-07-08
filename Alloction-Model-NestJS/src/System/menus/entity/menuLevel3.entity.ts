import { Entity, Column, Generated } from "typeorm";
import { MenuLevel2 } from ".";


@Entity()
export class MenuLevel3 extends MenuLevel2 {
    @Column({ nullable: true })
    @Generated("uuid")
    menuLevel2Id: string;
}