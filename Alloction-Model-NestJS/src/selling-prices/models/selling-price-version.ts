export interface SellingPriceVersion {
    _id: string;
    year: number;
    action:string;
    remark:string;
    version:number;
    filePath:string;
    rowOrder:number;
    createBy:string;
    createDate:Date;
    updateBy:string;
    updateDate:Date;
}