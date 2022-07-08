import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column, Generated } from "typeorm";

@Entity()
export class Permission extends CreatedEntity<number> {
    @Column({ nullable: true })
    @Generated("uuid")
    userGroupId: string;
    @Column({ nullable: true })
    @Generated("uuid")
    menulevel1Id: string;
    @Column({ nullable: true })
    @Generated("uuid")
    menulevel2Id: string;
    @Column({ nullable: true })
    @Generated("uuid")
    menulevel3Id: string;
    @Column({ nullable: true })
    visibleMenu: Number;
    @Column({ nullable: true })
    actionMenu: Number;
}