import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";

@Entity()
export class SystemMode extends CreatedEntity<number> {

    @Column({ nullable: true, length: 100 })
    systemMode: string;

    @Column({ default: false })
    isActiveMode: boolean;

    @Column({ default: false })
    isUserConfigFormula: boolean;

    @Column({ default: false })
    isDigitalConfigFormula: boolean;

}
