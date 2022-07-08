// // import * as mongoose from 'mongoose';

// // export const MasterCostSchema = new mongoose.Schema({
// //   _id: String,
// //   productName: String,
// //   productCostName: String,
// //   rowOrder: Number,
// //   unit: String,
// //   remark: String,
// //   activeStatus: String,
// //   createBy: String,
// //   createDate: Date,
// //   updateBy: String,
// //   updateDate: Date,
// // });
// import { EntitySchema } from 'typeorm';
// import { MasterCost } from '../models/master-cost';

// export const MasterCostSchema = new EntitySchema<MasterCost>({
//   name: 'User',
//   target: MasterCost,
//   columns: {
//     id: {
//       type: Number,
//       primary: true,
//       generated: true,
//     },
//     productName: {
//       type: String,
//     },
//     productCostName: {
//       type: String,
//     },
//     rowOrder: {
//       type: Number,
//     },
//     unit: {
//       type: String,
//     },
//     remark: {
//       type: String,
//     },
//     activeStatus: {
//       type: String,
//     },
//     createBy: {
//       type: String,
//     },
//     createDate: {
//       type: Date,
//       default: true,
//     },
//     updateBy: {
//       type: String,
//     },
//     updateDate: {
//       type: Date,
//       default: true,
//     },
//   },
//   // relations: {
//   //   photos: {
//   //     type: 'one-to-many',
//   //     target: 'Photo', // the name of the PhotoSchema
//   //   },
//   // },
// });