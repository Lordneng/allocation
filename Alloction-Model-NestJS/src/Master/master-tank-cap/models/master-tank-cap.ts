// // export interface MasterCost {
// //     _id: string;
// //     productName: string;
// //     productCostName: string;
// //     rowOrder: number;
// //     unit: string;
// //     remark: string;
// //     activeStatus: string;
// //     createBy: string;
// //     createDate: Date;
// //     updateBy: string;
// //     updateDate: Date;
// // }

// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class MasterCost {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ nullable: true })
//   productName: string;

//   @Column({ nullable: true })
//   productCostName: string;

//   @Column({ nullable: true })
//   rowOrder: number;

//   @Column({ nullable: true })
//   unit: string;

//   @Column({ nullable: true })
//   remark: string;

//   @Column({ nullable: true })
//   activeStatus: string;

//   @Column({ nullable: true })
//   createBy: string;

//   @Column({default:new Date()})
//   createDate: Date;

//   @Column({ nullable: true })
//   updateBy: string;

//   @Column({default:new Date()})
//   updateDate: Date;
// }