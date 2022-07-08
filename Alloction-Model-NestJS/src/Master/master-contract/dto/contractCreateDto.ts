import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsNotEmpty, Min, Validate, ValidateNested } from "class-validator"
import { CheckCreateContractDate } from "../validateFillter/CheckCreateContractDate"
import { IsContractCodeAlreadyExist } from "../validateFillter/IsContractCodeAlready"
import { ContractConditionOfSaleCreateDto } from "./contractConditionOfSaleCreateDto"
import { ContractCustomerPlantCreateDto } from "./contractCustomerPlantCreateDto"
import { ContractCustomerProductGradeCreateDto } from "./contractCustomerProductGradeCreateDto"

export class ContractCreateDto {

    @ApiProperty()
    code: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "contract name ห้ามว่าง" })
    name: string

    @ApiProperty()
    shortName: string

    @ApiProperty()
    contractNumber: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "contract type ห้ามว่าง" })
    contractTypeId: string;

    @ApiProperty()
    contractTypeName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "start date ห้ามว่าง" })
    startContractDate: Date;

    @ApiProperty({ required: true })
    @Validate(CheckCreateContractDate)
    @IsNotEmpty({ message: "end date ห้ามว่าง" })
    endContractDate: Date;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "product ห้ามว่าง" })
    productId: string;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    // @Min(0)
    minVolumn: Number

    @ApiProperty()
    // @Min(0)
    maxVolumn: Number

    @ApiProperty()
    isMinVolumnNoLimit: boolean

    @ApiProperty()
    isMaxVolumnNoLimit: boolean

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "unit ห้ามว่าง" })
    unitId: string;

    @ApiProperty()
    unitName: string;

    @ApiProperty({ required: true })
    // @IsNotEmpty({ message: "customer ห้ามว่าง" })
    customerId: string;

    @ApiProperty()
    customerName: string;

    @ApiProperty()
    totalActualVolumn: Number

    @ApiProperty()
    totalForecastVolumn: Number

    @IsArray()
    @ArrayNotEmpty({ message: "plant ห้ามว่าง" })
    @ApiProperty({ type: [ContractCustomerPlantCreateDto], required: true })
    @ValidateNested({ each: true })
    @Type(() => ContractCustomerPlantCreateDto)
    customerPlants: ContractCustomerPlantCreateDto[]

    @IsArray()
    @ApiProperty({ type: [ContractConditionOfSaleCreateDto] })
    @ValidateNested({ each: true })
    @Type(() => ContractConditionOfSaleCreateDto)
    customerConditions: ContractConditionOfSaleCreateDto[]

    @IsArray()
    @ApiProperty({ type: [ContractCustomerProductGradeCreateDto] })
    @ValidateNested({ each: true })
    @Type(() => ContractCustomerProductGradeCreateDto)
    customerProductGrades: ContractCustomerProductGradeCreateDto[]

    @ApiProperty()
    activeStatus: String;

    @ApiProperty({ required: false })
    rowOrder: Number;

    @ApiProperty({ required: false })
    remark: string;

    createByUserId: string;

    createBy: String;

    updateByUserId: string;

    updateBy: String;

}