export interface FullCostVersion {
    _id: string;
    year: number;
    costVersion: number;
    priceVersion: number;
    priceOldVersion: number;
    action:string;
    remark:string;
    version:number;
    versionName:string;
    filePath:string;
    fileName:string;
    rowOrder:number;
    createBy:string;
    createDate:Date;
    updateBy:string;
    updateDate:Date;
}