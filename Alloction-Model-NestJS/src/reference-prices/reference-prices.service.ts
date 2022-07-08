import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { getConnection, Repository } from 'typeorm'

import { ReferencePrice, ReferencePriceVersion, ReferencePriceManual, ReferencePriceActual } from './entity'
import { TOKENS } from '../constants'
import moment from 'moment'

// import { ReferencePriceVersion } from './entity';
@Injectable()
export class ReferencePricesService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryTokenManual) private readonly dataManualModel: Repository<ReferencePriceManual>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<ReferencePriceVersion>,
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<ReferencePrice>,
    @Inject(TOKENS.ProjectRepositoryTokenActual) private readonly dataActualModel: Repository<ReferencePriceActual>,
  ) {

  }

  async getList(params: any): Promise<any> {
    // let version = _.toNumber(params.version)
    // if (version === 0) {
    //   const dataVsersion: any = await this.getMaxVersion(params)
    //   version = dataVsersion ? dataVsersion.version : 0
    // }
    // console.info('params',params)

    let dateStart = moment(params.year + '-' + _.padStart(1, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(11, 'M');

    return await this.listData(dateStart, dateEnd, params);

    // return await this.getRecursiveData(params);
  }

  async listData(dateStart, dateEnd, params): Promise<any> {
    let dataList: any = [];

    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
      let data = await this.dataModel.find({
        where: { monthValue: index.month() + 1, yearValue: index.year(), year: params.year, month: params.month, version: params.version },
        order: { version: 'DESC' }
      });

      if (data && data.length > 0) {
        data.forEach(item => { dataList.push(item); })
      } else {
        if (dataList.length > 0) {
          let dataObj = _.cloneDeep(dataList[dataList.length - 1]);
          dataObj.yearValue = index.year();
          dataObj.monthValue = index.month() + 1;
          dataList.push(dataObj);
        }
        //comment ไว้ก่อน
        // if (index === dateStart) {
        //   const lastDate = moment(index).add(-1, 'M');
        //   const endDate = moment(index).add(-12, 'M');
        //   data = await this.getLastMonth(lastDate, endDate)
        // } else {
        //   let dataBefore = moment(index).add(-1, 'M');
        //   data = _.filter(dataList, (item) => {
        //     return item.yearValue === dataBefore.year() && item.monthValue === dataBefore.month() + 1
        //   });
        // }
        // data.forEach(item => {
        //   let dataObj: any = _.cloneDeep(item);
        //   dataObj.yearValue = index.year();
        //   dataObj.monthValue = index.month() + 1;
        //   dataList.push(dataObj);
        // })
      }
    }

    return dataList;
  }

  async getCalList(params: any): Promise<any> {
    return await this.getCalRecursiveData(params);
  }

  async getDataList(params: any) {

    let dataResponse: any;

    dataResponse = await this.dataModel.find({
      where: [{
        year: _.toInteger(params.year),
        month: _.toInteger(params.month)
      }],
      order: {
        rowOrder: "DESC"
      }
    });
    return dataResponse;
  }

  async getCalDataList(params: any) {

    let dataResponse: any;

    dataResponse = await this.dataModel.find({
      where: [{
        year: _.toInteger(params.year),
        month: _.toInteger(params.month),
        version: _.toInteger(params.version)
      }],
      order: {
        rowOrder: "DESC"
      }
    });
    return dataResponse;
  }

  async getRecursiveData(params: any) {
    let year = params.year;
    let month = params.month;
    let yearEnd = year - 2;
    let startMonth = month;

    for (let indexYear = year; indexYear >= yearEnd; indexYear--) {

      if (indexYear < year) {
        startMonth = 13;
      }

      for (let indexMonth = startMonth; indexMonth >= 0; indexMonth--) {
        params.year = indexYear;
        params.month = indexMonth;

        let data = await this.getDataList(params);
        if (data.length > 0) {
          if (indexYear < year) {
            _.each(data, (item) => {
              for (let idx = 1; idx <= 11; idx++) {
                item['M' + idx] = item['M12'];
              }
            })
          }
          // ('ref ', params)
          return data;
        }
      }

    }
    return [];
  }

  async getCalRecursiveData(params: any) {
    let year = params.year;
    let month = params.month;
    let yearEnd = year - 2;
    let startMonth = month;

    for (let indexYear = year; indexYear >= yearEnd; indexYear--) {
      for (let indexMonth = startMonth; indexMonth > 1; indexMonth--) {
        params.year = indexYear;
        params.month = indexMonth;

        let data = await this.getCalDataList(params);
        if (data.length > 0) {
          return data;
        }
      }

    }
    return [];
  }

  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ "id": id });
  }

  async save(data: any) {
    await getConnection().transaction(async transactionalEntityManager => {

      let dataVersionDelete : ReferencePriceVersion;

      //Delete
      if (data.referencePrice && data.referencePrice.length > 0) {
        await transactionalEntityManager.delete(ReferencePrice, { year: data.referencePrice[0].year, month: data.referencePrice[0].month, version: data.referencePrice[0].version });
        await transactionalEntityManager.delete(ReferencePriceManual, { year: data.referencePrice[0].year, month: data.referencePrice[0].month, version: data.referencePrice[0].version });
      }
      for (const item of data.referencePriceVersion) {
        const dataDelete: any = await this.dataVersionModel.find({ year: item.year, month: item.month, version: item.version })
        if (dataDelete) {
          item.id = dataDelete.id;
        }
      }
      for (const item of data.referencePriceVersion) {
        await transactionalEntityManager.delete(ReferencePriceVersion, { year: item.year, month: item.month, version: item.version });
      }
      //Insert
      const referencePriceSave: ReferencePrice[] = [];
      for (const item of data.referencePrice) {
        const dataSave = new ReferencePrice();
        Object.assign(dataSave, item);
        referencePriceSave.push(dataSave);
      }

      const manualSave: ReferencePriceManual[] = [];
      for (const item of data.referencePriceManual) {
        const dataSave = new ReferencePriceManual();
        Object.assign(dataSave, item);
        manualSave.push(dataSave);
      }

      const versionSave: ReferencePriceVersion[] = [];
      for (const item of data.referencePriceVersion) {
        const dataSave = new ReferencePriceVersion();
        Object.assign(dataSave, item);
        versionSave.push(dataSave);
      }

      await transactionalEntityManager.save(referencePriceSave, { chunk: 100 });
      await transactionalEntityManager.save(manualSave, { chunk: 100 });
      await transactionalEntityManager.save(versionSave, { chunk: 100 });
    });
  }


  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getVersion(params: any): Promise<any> {
    // // ('params', params);
    let dataWhere: any = { year: params.year };
    if (params.isApply === true) {
      dataWhere.isApply = true;
    }
    return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async getMonthVersion(params: any): Promise<any> {

    if (params.month != -1) {
      let dataWhere: any = { year: params.year, month: params.month };
      // // ('dataWhere getMonthVersion', dataWhere);
      return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
    }
    else {
      let dataWhere: any = { year: params.year };
      // // ('dataWhere getMonthVersion', dataWhere);
      return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'ASC', version: 'DESC' } });
    }

  }

  async getVersionById(id: string): Promise<any> {
    // // ('params', params);
    let dataWhere: any = { id: id };

    return await this.dataVersionModel.findOne({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async saveVersion(data: any) {
    if (data[0].isApply === true) {
      await this.dataVersionModel.update({ year: data[0].year, month: data[0].month, isApply: true }, { isApply: false, updateBy: data[0].updateBy })
    }

    return await this.dataVersionModel.save(data);
  }

  async getIsApplyVersion(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year, month: params.month, isApply: true }], order: { version: 'DESC' } });
  }

  async getManual(params: any): Promise<any> {
    // // ('params', params);
    if (_.toInteger(params.version) === -1) {
      const dataVsersion: any = await this.getIsApplyVersion(params)
      params.version = dataVsersion ? dataVsersion.version : 0
    }
    return await this.dataManualModel.find({ where: [{ year: params.year, month: params.month, version: params.version }] });
  }

  async saveManual(data: any) {
    if (data.length > 0) {
      await this.dataManualModel.delete({ year: data[0].year, month: data[0].month, version: data[0].version })
    }
    return await this.dataManualModel.save(data);
  }

  async getReferencePriceToCalMargin(params: any): Promise<any> {

    let dataList = await this.getList(params);
    let dataListManual = await this.getManual(params);

    if (dataList.length === 0) {
      if (params.month > 0) {
        params.month = params.month - 1;
        // await this.getReferencePriceToCalMargin(params);
      }
    }
    else {

      dataList = _.orderBy(dataList, ['rowOrder'], ['asc']);
      dataListManual = _.orderBy(dataListManual, ['rowOrder'], ['asc']);

      _.each(dataList, (item, index) => {
        item.rowOrder = item.rowOrder ? item.rowOrder : (index + 1)
        for (let index = 1; index < 13; index++) {
          item['isManualM' + index] = false;
          item['isEditM' + index] = false;
        }
        const dataManual = _.filter(dataListManual, (itemManual) => {
          return itemManual.product === item.referencePriceNameTo;
        })
        _.each(dataManual, (dataManualMonth) => {
          item['M' + dataManualMonth.valueMonth] = dataManualMonth.value;
          item['isManualM' + dataManualMonth.valueMonth] = true;
        })
      });

    }

    return dataList;
  }

  async getReferencePriceToCalMarginV2(params: any): Promise<any> {
    // ส่ง params เข้ามาเพราะต้องมี version นั้นๆแน่นอนจริงไม่ดึงย้อนหลัง
    let dataList = await this.getDataList(params);
    let dataListManual = await this.getManual(params);
    let data: any = [];
    let dataLastYear: any = [];
    let dataLastYearManual: any = [];
    let dataNextYear: any = [];
    let dataNextYearManual: any = [];
    if (params.month === 1) {
      //หาข้อมูลปีก่อนหน้า
      let maxMonth = await this.getMaxMonth(params);
      if (maxMonth) {
        let maxVersion = await this.getMaxVersion(maxMonth);
        if (maxVersion) {
          dataLastYear = await this.getDataList(maxVersion);
          dataLastYearManual = await this.getManual(maxVersion);
        }
      }
    }

    dataList = _.orderBy(dataList, ['rowOrder'], ['asc']);
    dataListManual = _.orderBy(dataListManual, ['rowOrder'], ['asc']);

    _.each(dataList, (item, index) => {
      item.rowOrder = item.rowOrder ? item.rowOrder : (index + 1)
      for (let index = 1; index < 13; index++) {
        item['isManualM' + index] = false;
        item['isEditM' + index] = false;
      }
      const dataManual = _.filter(dataListManual, (itemManual) => {
        return itemManual.product === item.referencePriceNameTo;
      })
      _.each(dataManual, (dataManualMonth) => {
        item['M' + dataManualMonth.valueMonth] = dataManualMonth.value;
        item['isManualM' + dataManualMonth.valueMonth] = true;
      })
    });


    return dataList;
  }

  async getReferencePriceToCalMarginByVersion(params: any): Promise<any> {

    let dataList = await this.getCalList(params);
    let dataListManual = await this.getManual(params);

    if (dataList.length === 0) {
      if (params.month > 0) {
        params.month = params.month - 1;
        // await this.getReferencePriceToCalMargin(params);
      }
    }
    else {

      dataList = _.orderBy(dataList, ['rowOrder'], ['asc']);
      dataListManual = _.orderBy(dataListManual, ['rowOrder'], ['asc']);

      _.each(dataList, (item, index) => {
        item.rowOrder = item.rowOrder ? item.rowOrder : (index + 1)
        item['isManual'] = false;
        item['isEdit'] = false;

        const dataManual = _.find(dataListManual, (itemManual) => {
          return itemManual.product === item.referencePriceNameTo &&
            itemManual.yearValue === item.yearValue &&
            itemManual.monthValue === item.monthValue;
        })

        if (dataManual) {
          item.value = dataManual.value;
          item['isManual'] = true;
        }
      });

    }

    return dataList;
  }

  async getMaxVersion(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year, month: params.month }], order: { version: 'DESC' } });
  }

  async getMaxMonth(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year }] });
  }

  async getNextYear(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');

    let dataList = await this.listNextYearData(dateStart, dateEnd);
    let dataListManual = await this.getManual(params);

    dataList = _.orderBy(dataList, ['rowOrder', 'updateDate'], ['asc', 'desc']);
    dataListManual = _.orderBy(dataListManual, ['rowOrder','updateDate'], ['asc','desc']);

    _.each(dataList, (item, index) => {
      item.rowOrder = item.rowOrder ? item.rowOrder : (index + 1)
      item['isManual'] = false;
      item['isEdit'] = false;

      const dataManual = _.find(dataListManual, (itemManual) => {
        return itemManual.product === item.referencePriceNameTo &&
          itemManual.yearValue === item.yearValue &&
          itemManual.monthValue === item.monthValue;
      })

      if (dataManual) {
        item.value = dataManual.value;
        item['isManual'] = true;
      }
    });

    return dataList;
  }

  async listNextYearData(dateStart, dateEnd): Promise<any> {
    const dataList: any = [];
    
    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')){
      let data = await this.dataModel.find({
        where: { monthValue: index.month() + 1, yearValue: index.year() },
        order: { version: 'DESC' }
      });

      if(data && data.length > 0){
        data.forEach(item => { dataList.push(item); })
      } else {
        if (index === dateStart) {
          const lastDate = moment(index).add(-1, 'M');
          const endDate = moment(index).add(-12, 'M');
          data = await this.getLastMonth(lastDate, endDate)
        } else {
          let dataBefore = moment(index).add(-1, 'M');
          data = _.filter(dataList, (item) => { 
            return item.yearValue === dataBefore.year() && item.monthValue === dataBefore.month() + 1
          });
        }
        data.forEach(item => { 
          let dataObj: any = _.cloneDeep(item);
          dataObj.yearValue = index.year();
          dataObj.monthValue = index.month() + 1;
          dataList.push(dataObj);
        })
      }
    }  

    return dataList;
  }

  async getLastMonth (lastMonth: any, endDate: any) {
    const data = await this.dataModel.find({
      where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year() },
      order: { version: 'DESC' }
    });

    if(data && data.length > 0){
      return data;
    }

    if (lastMonth <= endDate){
      return [];
    }

    lastMonth = moment(lastMonth).add(-1, 'M')

    return await this.getLastMonth(lastMonth, endDate)
  }

  async getLastYear(params: any): Promise<any> {
    let year = params.year;
    let manualParams = params;
    params.year = params.year - 1;
    params.month = 12;
    manualParams.year = params.year;
    manualParams.month = params.month;
    let dataList = await this.getCalDataList(params);
    let dataListManual = await this.getManual(manualParams);

    if (dataList.length === 0) {
      manualParams.year = year;
      dataList = await this.getDataList(params);
      dataListManual = await this.getManual(manualParams);
    }

    dataList = _.orderBy(dataList, ['rowOrder', 'updateDate'], ['asc', 'desc']);
    dataListManual = _.orderBy(dataListManual, ['rowOrder', 'updateDate'], ['asc', 'desc']);

    _.each(dataList, (item, index) => {
      item.rowOrder = item.rowOrder ? item.rowOrder : (index + 1)
      item['isManual'] = false;
      item['isEdit'] = false;

      const dataManual = _.find(dataListManual, (itemManual) => {
        return itemManual.product === item.referencePriceNameTo &&
          itemManual.yearValue === item.yearValue &&
          itemManual.monthValue === item.monthValue;
      })

      if (dataManual) {
        item.value = dataManual.value;
        item['isManual'] = true;
      }
    });

    return dataList;
  }
  async getActual(params: any): Promise<any> {
    // // ('params', params);
    let dataWhere: any = { yearValue: params.year };
    return await this.dataActualModel.find({ where: [dataWhere], order: { yearValue: 'DESC', monthValue: 'DESC' } });
  }
  /*async getVersion(params: any): Promise<any> {
    return await this.dataVersionModel.find({ where: [ {year: params.year }], order: { updateDate: 'DESC'} });
  }*/
  /*async createVersion(data: any) {
    return await this.dataVersionModel.save(data);
  }*/

}
