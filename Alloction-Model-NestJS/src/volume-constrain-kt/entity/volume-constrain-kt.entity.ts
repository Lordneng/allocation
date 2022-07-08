import { CreatedEntity } from "../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class VolumeConstrainKt extends CreatedEntity<number> {
    @Column({ nullable:true,length: 200 })
    product: string;

    @Column({ nullable:true,length: 200 })
    unit: string;

    @Column({ nullable:true,length: 200 })
    source: string;

    @Column({ nullable:true,length: 200 })
    demand: string;

    @Column({ nullable:true,length: 200 })
    deliveryPoint: string;

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    month: Number

    @Column({ nullable: true })
    min: Number

    @Column({ nullable: true })
    max: Number

    @Column({ nullable: true })
    version: Number
    
    @Column({nullable:true,default: true})
    isCalculate: boolean;
}

@Entity()
export class VolumeConstrainKtHistory extends VolumeConstrainKt {

}