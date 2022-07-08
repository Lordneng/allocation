import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsNotEmpty, Min, Validate, ValidateNested } from "class-validator"
import { CheckContractAlreadyExist } from "../validateFillter/CheckContractAlreadyExist"
import { CheckUpdateContractDate } from "../validateFillter/CheckUpdateContractDate"
import { UpdateContractCodeAlreadyExist } from "../validateFillter/UpdateContractCodeAlreadyExist"
import { ContractConditionOfSaleUpdateDto } from "./contractConditionOfSaleUpdateDto"
import { ContractCustomerPlantUpdateDto } from "./contractCustomerPlantUpdateDto"
import { ContractCustomerProductGradeUpdateDto } from "./contractCustomerProductGradeUpdateDto"



export class ContractUpdateDto {

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "contract id ห้ามว่าง" })
    @Validate(CheckContractAlreadyExist)
    id: string

    @ApiProperty()
    code: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "contract name ห้ามว่าง" })
    name: string

    @ApiProperty()
    shortName: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "contract number ห้ามว่าง" })
    contractNumber: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "contract type ห้ามว่าง" })
    contractTypeId: string;

    @ApiProperty({ required: true })
    contractTypeName: string;

    @ApiProperty({ required: true })
    startContractDate: Date;

    @ApiProperty({ required: true })
    @Validate(CheckUpdateContractDate)
    endContractDate: Date;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "product ห้ามว่าง" })
    productId: string;

    @ApiProperty({ required: true })
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

    @ApiProperty({ required: true })
    unitName: string;

    @ApiProperty({ required: true })
    // @IsNotEmpty({ message: "customer ห้ามว่าง" })
    customerId: string;

    @ApiProperty({ required: true })
    customerName: string;

    @ApiProperty()
    totalActualVolumn: Number

    @ApiProperty()
    totalForecastVolumn: Number

    @IsArray()
    @ArrayNotEmpty({ message: "plant ห้ามว่าง" })
    @ApiProperty({ type: [ContractCustomerPlantUpdateDto], required: true })
    @ValidateNested({ each: true })
    @Type(() => ContractCustomerPlantUpdateDto)
    customerPlants: ContractCustomerPlantUpdateDto[]

    @IsArray()
    @ApiProperty({ type: [ContractConditionOfSaleUpdateDto] })
    @ValidateNested({ each: true })
    @Type(() => ContractConditionOfSaleUpdateDto)
    customerConditions: ContractConditionOfSaleUpdateDto[]

    @IsArray()
    @ApiProperty({ type: [ContractCustomerProductGradeUpdateDto] })
    @ValidateNested({ each: true })
    @Type(() => ContractCustomerProductGradeUpdateDto)
    customerProductGrades: ContractCustomerProductGradeUpdateDto[]

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