import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column, Generated } from "typeorm"

@Entity()
export class ContractConditionOfSale extends CreatedEntity<string>{

    @Column({ nullable: true })
    @Generated("uuid")
    contractId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    customerId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    contractCustomerPlantId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    customerPlantId: string;

    @Column({ nullable: true })
    @Generated("uuid")
    conditionsOfSaleId: string;

    @Column({ nullable: true, length: 200 })
    conditionsOfSaleName: string;

    @Column({ nullable: true })
    @Generated("uuid")
    sourceId: string;

    @Column({ nullable: true, length: 200 })
    sourceName: string;

    @Column({ nullable: true })
    @Generated("uuid")
    deliveryId: string;

    @Column({ nullable: true, length: 200 })
    deliveryName: string;

    @Column({ nullable: true })
    demandName: string;

    @Column({ nullable: true })
    sellingPriceFormula: string;

    @Column({ nullable: true })
    startSellingPriceFomulaDate: Date

    @Column({ nullable: true })
    endSellingPriceFomulaDate: Date


    @Column({ nullable: true })
    tierNo: Number

    @Column({ nullable: true })
    @Generated("uuid")
    tierTypeId: string;

    @Column({ nullable: true, length: 200 })
    tierTypeName: string;

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    minVolumeTier: Number

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    maxVolumeTier: Number


    @Column({ default: false, nullable: true })
    isMinVolumeTierNoLimit: boolean

    @Column({ default: false, nullable: true })
    isMaxVolumeTierNoLimit: boolean

    @Column({ nullable: true })
    @Generated("uuid")
    unitId: string;

    @Column({ nullable: true, length: 200 })
    unitName: string;

    @Column({ nullable: true })
    @Generated("uuid")
    substituedProductId: string;

    @Column({ nullable: true, length: 200 })
    substituedProductName: string;

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    substituedRate: Number

    @Column({ nullable: true })
    @Generated("uuid")
    supplierId: string;

    @Column({ nullable: true, length: 200 })
    supplierName: string;

    @Column({ nullable: true, length: 200 })
    productGrpNameSmartPrice: string;
    @Column({ nullable: true, length: 200 })
    productNameSmartPrice: string;
    @Column({ nullable: true, length: 200 })
    customerNameSmartPrice: string;

    @Column({ nullable: true })
    @Generated("uuid")
    shareVolumnId: string;

}