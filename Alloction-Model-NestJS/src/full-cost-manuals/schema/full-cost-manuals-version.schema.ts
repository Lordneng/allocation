import * as mongoose from 'mongoose';

export const FullCostManualsVersionSchema = new mongoose.Schema({
    _id: String,
    year: Number,
    action: String,
    remark: String,
    version: Number,
    versionName: String,
    filePath: String,
    fileName: String,
    rowOrder: Number,
    createBy: String,
    createDate: Date,
    updateBy: String,
    updateDate: Date,
});