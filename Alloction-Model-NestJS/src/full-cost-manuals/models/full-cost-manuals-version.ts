export interface FullCostManualsVersion {
    _id: string;
    year: number;
    action: string;
    remark: string;
    version: number;
    versionName: string;
    filePath: string;
    fileName: string;
    rowOrder: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}