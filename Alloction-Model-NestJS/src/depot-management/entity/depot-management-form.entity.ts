import { CreatedEntity } from "../../common/data/models";
import { Entity, Column, Generated } from "typeorm";
import { IsNotEmpty } from "class-validator";


@Entity()
export class DepotManagementMeterForm extends CreatedEntity<number> {

    @Column({ nullable:true  })
    @Generated("uuid")
    @IsNotEmpty({message: "Unit Id  ห้ามเป็นค่าว่าง"})
    unitId: string;

    @Column({ nullable:true, length: 200 })
    @IsNotEmpty({message: "Unit Code ห้ามเป็นค่าว่าง"})
    unitCode: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    @IsNotEmpty({message: "Depot Id  ห้ามเป็นค่าว่าง"})
    depotId: string;

    @Column({ nullable:true, length: 200 })
    @IsNotEmpty({message: "Depot ห้ามเป็นค่าว่าง"})
    depot: string;

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    month: Number

    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    @IsNotEmpty({message: "Min  ห้ามเป็นค่าว่าง"})
    min: Number

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    @IsNotEmpty({message: "Max  ห้ามเป็นค่าว่าง"})
    max: Number

    @Column({ nullable: true })
    dayValue: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true })
    isAll: boolean


    @Column({ nullable: true, length: 200 })
    modelId: string;

    @Column({ nullable: true, length: 200 })
    product: string;
}

@Entity()
export class DepotManagementMeterFormHistory extends DepotManagementMeterForm {

}