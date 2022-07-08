import * as mongoose from 'mongoose';

export const FullCostVersionSchema = new mongoose.Schema({
  _id: String,
  year: Number,
  costVersion: Number,
  priceVersion: Number,
  priceOldVersion: Number,
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
