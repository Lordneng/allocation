export interface FullCostManual {
    _id: string;
    product: string;
    unit: string;
    source: string;
    demand: string;
    deliveryPoint: string;
    year:number;
    month:number;
    rowOrder: number;
    value:number;
    version:number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}