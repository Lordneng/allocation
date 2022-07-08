import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { In, Repository } from 'typeorm';
import { TOKENS } from '../constants';
import moment from 'moment';
import {
  VolumeConstrainKt,
  VolumeConstrainKtForm,
  VolumeConstrainKtFormHistory,
  VolumeConstrainKtHistory,
  VolumeConstrainKtVersion,
} from './entity';
@Injectable()
export class VolumeConstrainKtService {
  constructor(
    @Inject(TOKENS.ProjectRepositoryToken)
    private readonly dataModel: Repository<VolumeConstrainKt>,
    @Inject(TOKENS.ProjectRepositoryTokenHistory)
    private readonly dataModelHistory: Repository<VolumeConstrainKtHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion)
    private readonly dataVersionModel: Repository<VolumeConstrainKtVersion>,
    @Inject(TOKENS.ProjectRepositoryTokenForm)
    private readonly dataFormModel: Repository<VolumeConstrainKtForm>,
    @Inject(TOKENS.ProjectRepositoryTokenFormHistory)
    private readonly dataFormModelHistory: Repository<
      VolumeConstrainKtFormHistory
    >,
  ) {}

  async getList(params: any): Promise<any> {
    let listMonth: any = [];
    let products: any = ['Pentane', 'C2'];
    let dateStart = moment(
      params.year + '-' + _.padStart(params.month, 2, '0') + '-01',
    );
    dateStart = dateStart.add(1, 'M');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    for (let index = 1; index < 13; index++) {
      listMonth.push({ year: yearStart, month: monthStart });
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    const yearArray = _.uniqBy(listMonth, 'year');

    let dataList: any = [];
    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(listMonth, item => {
        return item.year === element.year;
      });
      const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
      const data = await this.dataModel.find({
        where: {
          product: In(products),
          month: In(monthArray),
          year: element.year,
        },
      });
      dataList = _.concat(dataList, data);
    }
    return dataList;
  }

  async getListCstrains(params: any): Promise<any> {
    let dateStart = moment(
      params.year + '-' + _.padStart(params.month, 2, '0') + '-01',
    );
    dateStart = dateStart.add(1, 'M'); //เดือนถัดไป
    let dateEnd = moment(dateStart).add(11, 'M'); //เดือนปัจจุบันในปีถัดไป

    let data = await this.listData(dateStart, dateEnd);
    if (data && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let objDate = moment(element.year + '-' + _.padStart(element.month, 2, '0') + '-01');
        if (element.isCalculate === true) {
          element.min = (element.min * 24 * objDate.daysInMonth()) / 1000;
          element.max = (element.max * 24 * objDate.daysInMonth()) / 1000;
        }
      }
    }
    return data;
  }
  async listData(dateStart, dateEnd): Promise<any> {
    
    let dataList: any = [];

    const dataForm = await this.getForm(null);

    for (let indexForm = 0; indexForm < dataForm.length; indexForm++) {
      for (let index = dateStart; index <= dateEnd; moment(index).add(1, 'M')) {
        const element = dataForm[indexForm];
        const data = await this.dataModel.findOne({
          where: {
            product: element.product,
            unit: element.unit,
            source: element.source,
            demand: element.demand,
            deliveryPoint: element.deliveryPoint,
            month: index.month() + 1,
            year: index.year(),
          },
        });

        if (data) {
          dataList.push(data);
        } else {
          let dataObj: any = _.cloneDeep(dataForm[indexForm]);
          dataObj.year = index.year();
          dataObj.month = index.month() + 1;
          dataList.push(dataObj);
        }

        index = moment(index).add(1, 'M');
      }
    }

    return dataList;
  }

  async getListHistory(params: any): Promise<any> {
    // let listMonth: any = [];
    // let dateStart = moment(params.year + '-' + params.month + '-01');
    // dateStart = dateStart.add(1, 'M');
    // let monthStart = dateStart.month() + 1;
    // let yearStart = dateStart.year();
    // for (let index = 1; index < 13; index++) {
    //   listMonth.push({ year: yearStart, month: monthStart });
    //   dateStart = dateStart.add(1, 'M');
    //   monthStart = dateStart.month() + 1;
    //   yearStart = dateStart.year();
    // }

    // const yearArray = _.uniqBy(listMonth, 'year');

    // let dataList: any = []
    // for (let index = 0; index < yearArray.length; index++) {
    //   const element = yearArray[index];
    //   const dataMonth = _.filter(listMonth, (item) => {
    //     return item.year === element.year
    //   })
    //   const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
    //   const data = await this.dataHistoryModel.find({ month: { $in: monthArray }, year: element.year, version: params.version }).exec();
    //   dataList = _.concat(dataList, data)
    // }
    return await this.dataModelHistory.find({ version: params.version });
  }
  async create(data: any) {
    const yearArray = _.uniqBy(data, 'year');

    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(data, item => {
        return item.year === element.year;
      });
      const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
      await this.dataModel.delete({
        month: In(monthArray),
        year: element.year,
      });
    }

    this.dataModelHistory.save(data, { chunk: 100 });
    return await this.dataModel.save(data, { chunk: 100 });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getForm(params: any): Promise<any> {
    // // ('params', params);
    let products: any = ['Pentane', 'C2'];

    return await this.dataFormModel.find({
      where: { product: In(products) },
      order: { updateDate: 'DESC' },
    });
  }
  async getFormHistory(params: any): Promise<any> {
    // // ('params', params);
    return await this.dataFormModelHistory.find({
      where: [{ version: params.version }],
      order: { updateDate: 'DESC' },
    });
  }
  async createForm(data: any) {
    await this.dataFormModel.delete({});
    this.dataFormModelHistory.save(data, { chunk: 100 });
    return await this.dataFormModel.save(data, { chunk: 100 });
  }

  async getVersion(params: any): Promise<any> {
    // // ('params', params);
    return await this.dataVersionModel.find({ order: { updateDate: 'DESC' } });
  }
  async createVersion(data: any) {
    this.dataVersionModel.delete({});
    return await this.dataVersionModel.save(data, { chunk: 100 });
  }
}

// import { Injectable, Inject } from '@nestjs/common';
// import * as _ from 'lodash';
// import { getuid } from 'process';
// import { InjectRepository } from '@nestjs/typeorm';
// import { EntityManager, Repository, Transaction, TransactionRepository } from 'typeorm';
// import { TOKENS } from '../constants';
// import console = require('console');
// import { VolumeConstrainKt } from './entity';
// // import { VolumeConstrainKtForm } from './entity';
// // import { VolumeConstrainKtVersion } from './entity';
// // import { VolumeConstrainKtForm } from './entity';
// // import { VolumeConstrainKtVersion } from './entity';
// @Injectable()
// export class VolumeConstrainKtService {

//   constructor(
//     //@InjectModel('MasterCost') private readonly dataModel: Model<MasterCost>
//     @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<VolumeConstrainKt>
//   ) {

//   }

//   async getList(params: any): Promise<any> {
//     // // ('params', params);
//     return await this.dataModel.find();
//   }

//   // async getOne(id: any): Promise<any> {
//   //   return await this.dataModel.findOne({ "_id": id }).exec();
//   // }
//   @Transaction()
//   async create(@TransactionRepository(VolumeConstrainKt) manager: Repository<VolumeConstrainKt>, data?: any) {
//     return await manager.save(data);
//   }

//   // //ส่งข้อมูลเป็น array มาอย่างเดว

//   async update(data: any) {
//     //   const dataUpdate = await this.getOne(data._id);
//     // ('params', data);
//     //   dataUpdate.productCostName = data.productCostName;

//     //   dataUpdate.productName = data.productName;

//     //   dataUpdate.rowOrder = data.rowOrder;

//     //   dataUpdate.unit = data.unit;

//     //   dataUpdate.remark = data.remark;

//     //   dataUpdate.activeStatus = data.activeStatus;

//     //   dataUpdate.UpdateBy = data.UpdateBy;
//     //   dataUpdate.updateDate = new Date();
//     return this.dataModel.save({...data,  id: data.id });
//   }

//   async delete(id: any) {
//     return await this.dataModel.delete({ id: id });
//   }

// }
