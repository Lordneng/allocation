import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class MasterReferencePrice extends CreatedEntity<number> {
    @Column({ nullable: true,length: 200 })
    value: string;

    @Column({ nullable: true,length: 200 })
    name: string;

    @Column({ nullable: true,length: 200 })
    unit: string;

    @Column({ nullable: true,length: 200 })
    remark: string;

    @Column({ nullable: true,length: 200 })
    parameterName: string;

    @Column({ nullable: true,length: 200 })
    activeStatus: string;

    @Column({ nullable: true,length: 200 })
    formula: string;

    @Column({ nullable: true,length: 200 })
    referencePriceNameFrom: string;

    @Column({ nullable: true,length: 200 })
    referencePriceNameTo: string;
    
    @Column({ nullable: true,length: 200 })
    referencePriceNameFromSmart: string;
}