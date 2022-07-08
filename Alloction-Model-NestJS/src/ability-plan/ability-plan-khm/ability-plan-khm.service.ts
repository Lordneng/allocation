
import * as _ from 'lodash';
import { AbilityPlanKhm, AbilityPlanKhmHistory, AbilityPlanKhmManual, AbilityPlanKhmVersion, MasterAbilityPlanKhm } from './entity';
import { TOKENS } from '../../constants';
import { Inject, Injectable } from '@nestjs/common';
import { In, Repository, Transaction, TransactionManager, EntityManager } from 'typeorm';
import moment from 'moment';
import console from 'console';
import { KhmSupplierRequest } from './dto/khmSupplierRequest';
@Injectable()
export class AbilityPlanKhmService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<AbilityPlanKhm>,
    @Inject(TOKENS.ProjectRepositoryTokenHistory) private readonly dataHistoryModel: Repository<AbilityPlanKhmHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<AbilityPlanKhmVersion>,
    @Inject(TOKENS.ProjectRepositoryTokenManual) private readonly dataManualModel: Repository<AbilityPlanKhmManual>,
    @Inject(TOKENS.ProjectRepositoryTokenMaster) private readonly dataMasterModel: Repository<MasterAbilityPlanKhm>
  ) {

  }

  async getList(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');

    return await this.listData(dateStart, dateEnd, params);
  }
  async getListToModel(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    dateStart = moment(dateStart).add(1, 'M');
    let dateEnd = moment(dateStart).add(13, 'M');

    return await this.listData(dateStart, dateEnd, params);
  }
  async getListbyVersionId(params: any): Promise<any> {

    const dataVsersion: any = await this.getVersionById(params);

    return await await this.dataModel.find({
      where: [
        {
          year: _.toInteger(dataVsersion.year),
          month: _.toInteger(dataVsersion.month),
          version: dataVsersion.version,
        },
      ],
      order: {
        rowOrder: 'ASC',
      },
    });
  }

  async getKhmList(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    dateStart = dateStart.add(1, 'M');//เดือนถัดไป
    let dateEnd = moment(dateStart).add(11, 'M');//เดือนปัจจุบันในปีถัดไป
    let data = await this.listData(dateStart, dateEnd, params);

    return data;
  }

  async getSupplierList(params: KhmSupplierRequest): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');
    return await this.listSupplierData(dateStart, dateEnd, params);
  }

  async listSupplierData(dateStart, dateEnd, params): Promise<any> {
    let dataList: any = [];

    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
      let data = await this.dataModel.find({
        where: { monthValue: index.month() + 1, yearValue: index.year(), product: In(params.supplier),
          year: params.year, month: params.month, version: params.version
        },
        order: { version: 'DESC' }
      });

      if (data && data.length > 0) {
        data.forEach(item => { dataList.push(item); })
      } else {
        let dataVersion = await this.dataModel.findOne({ 
          where: { 
            monthValue: index.month() + 1, 
            yearValue: index.year(),
            product: In(params.supplier)
          }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })

        if (dataVersion) {
          data = await this.dataModel.find({ where: { 
            monthValue: index.month() + 1, 
            yearValue: index.year(), 
            month: dataVersion.month, 
            year: dataVersion.year, 
            version: dataVersion.version,
            product: In(params.supplier)
          }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })
        }
        else {
          data = await this.getSuppilerLastMonth(moment(index).add(-1, 'M'), params)
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

  async listData(dateStart, dateEnd, params): Promise<any> {
    let dataList: any = [];
    
    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')){
      let data = await this.dataModel.find({
        where: { monthValue: index.month() + 1, yearValue: index.year(), year: params.year, month: params.month, version: params.version },
        order: { version: 'DESC' }
      });

      if(data && data.length > 0){
        data.forEach(item => { dataList.push(item); })
      } else {
        let dataVersion = await this.dataModel.findOne({ where: { monthValue: index.month() + 1, yearValue: index.year() }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })

        if (dataVersion) {
          data = await this.dataModel.find({ where: { monthValue: index.month() + 1, yearValue: index.year(), month: dataVersion.month, year: dataVersion.year, version: dataVersion.version }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })
        }
        else {
          data = await this.getLastMonth(moment(index).add(-1, 'M'), 1);
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

  async getSuppilerLastMonth(lastMonth: any, params) {

    const dataVersion = await this.dataModel.findOne({
      where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year(), product: In(params.supplier) },
      order: { year: 'DESC', month: 'DESC', version: 'DESC' }
    });
    if (dataVersion) {
      const data = await this.dataModel.find({
        where: { 
          monthValue: lastMonth.month() + 1, 
          yearValue: lastMonth.year(), 
          month: dataVersion.month, 
          year: dataVersion.year, 
          version: dataVersion.version,
          product: In(params.supplier)
        },
      });
      if (data && data.length > 0) {
        return data;
      }
    }

    return this.getSuppilerLastMonth(moment(lastMonth).add(-1, 'M'), params)

  }

  async getLastMonth (lastMonth: any, index: any) {
    const dataVersion = await this.dataModel.findOne({
      where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year() },
      order: { year: 'DESC', month: 'DESC', version: 'DESC' }
    });

    if (dataVersion) {
      const data = await this.dataModel.find({
        where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year(), month: dataVersion.month, year: dataVersion.year, version: dataVersion.version },
      });
      if (data && data.length > 0) {
        return data;
      }
    }

    if (index === 12) {
      return [];
    }
    
    index = index + 1;

    return this.getLastMonth(moment(lastMonth).add(-1, 'M'), index)
  }
  
  async getHistoryList(params: any): Promise<any> {
    let version = _.toNumber(params.version)
    if (version < 0) {

      // ("ดึงย้อนหลัง");
      return await this.getRecursiveData(params);
    } else {
      // ("ดึงปกติ");
      return await this.dataHistoryModel.find({ version: params.version, month: params.month, year: params.year });
    }

  }
  async getHistoryData(params: any): Promise<any> {
    return await this.dataHistoryModel.find({ version: params.version, month: params.month, year: params.year });
  }

  async getRecursiveData(params: any) {
    let year = params.year;
    let month = params.month;
    let yearEnd = year - 2;
    let startMonth = month;
    for (let indexYear = year; indexYear >= yearEnd; indexYear--) {
      if (indexYear < year) {
        startMonth = 12;
      }
      for (let indexMonth = startMonth; indexMonth >= 0; indexMonth--) {
        params.year = indexYear;
        params.month = indexMonth;
        const dataVsersion: any = await this.getMaxVersion(params);
        if (dataVsersion) {
          params.version = dataVsersion.version;
          let data = await this.getHistoryData(params);

          if (data.length > 0) {
            let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
            let dateEnd = moment(dateStart).add(1, 'y');
            let dataArrayOld = [];
            for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
              const dataArray = _.filter(data, (item) => {
                return item.yearValue === index.year() && item.monthValue === index.month() + 1;
              })
              if (dataArray.length <= 0 && dataArrayOld.length > 0) {
                for (let addData = index; addData <= dateEnd; addData = moment(addData).add(1, 'M')) {
                  let dataAdd = _.cloneDeep(dataArrayOld);
                  _.each(dataAdd, (item) => {
                    item.monthValue = addData.month() + 1;
                    item.yearValue = addData.year();
                    item.dayValue = addData.daysInMonth();
                  });
                  data = _.concat(data, dataAdd)
                  // ("ดึงย้อนหลัง data", addData);
                  // ("ดึงย้อนหลัง dateEnd", dateEnd);
                }
                return data;
              } else {
                dataArrayOld = _.cloneDeep(dataArray);
              }
            }
          }
        }

      }

    }
    return [];
  }

  async getMaxVersion(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year, month: params.month }], order: { version: 'DESC' } });
  }
  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ "id": id })
  }

  async save(data: any) {
    const yearArray = _.uniqBy(data, 'yearValue');

    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(data, (item) => {
        return item.yearValue === element.yearValue
      })
      const monthArray = _.map(_.uniqBy(dataMonth, 'monthValue'), 'monthValue');
      await this.dataModel.delete({ monthValue: In(monthArray), yearValue: element.yearValue })
    }

    if (data && data.length > 0) {
      await this.dataHistoryModel.delete({ month: _.toInteger(data[0].month), year: _.toInteger(data[0].year), version: data[0].version })
    }

    this.dataHistoryModel.save(data, { chunk: 100 });

    return await this.dataModel.save(data, { chunk: 100 });
  }

  @Transaction()
  async saveTrans(@TransactionManager() manager: EntityManager, data?: any, version?: any ){
 
    const yearArray = _.uniqBy(data, 'yearValue');
    const historyData = data.map(data => {
      const history = new AbilityPlanKhmHistory();
      Object.assign(history, data);
      return history;
    })

    const dataSave = data.map(data => {
      const khm = new AbilityPlanKhm();
      Object.assign(khm, data);
      return khm;
    })

    const dataVersion = version.map(data => {
      const version = new AbilityPlanKhmVersion();
      Object.assign(version, data);
      return version;
    })

    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(dataSave, (item) => {
        return item.yearValue === element.yearValue
      })
      const monthArray = _.map(_.uniqBy(dataMonth, 'monthValue'), 'monthValue');
      await manager.delete(AbilityPlanKhm, { monthValue: In(monthArray), yearValue: element.yearValue })
    }

    if (historyData && historyData.length > 0) {
      await manager.delete(AbilityPlanKhmHistory, { 
        month: _.toInteger(historyData[0].month), 
        year: _.toInteger(historyData[0].year), 
        version: _.toInteger(historyData[0].version)
      })
    }

    await manager.save(historyData, { chunk: 100});
    await manager.save(dataSave, { chunk: 100 });

    await manager.update(AbilityPlanKhmVersion,
      { year: _.toInteger(dataVersion[0].year), month: _.toInteger(dataVersion[0].month), isApply: true }, 
      { isApply: false, updateBy: dataVersion[0].updateBy })

    await manager.save(dataVersion);

  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year };

    if (params.isApply && params.isApply === true) {
      dataWhere.isApply = true;
    }

    return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async getVersionById(params: any) {
    return await this.dataVersionModel.findOne({
      where: [{ id: params.versionId }]
    });
  }

  async getMonthVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month };
    // ('dataWhere getMonthVersion', dataWhere);
    return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
  }

  async saveVersion(data: any) {
    await this.dataVersionModel.update({ year: data[0].year, month: data[0].month, isApply: true }, { isApply: false, updateBy: data[0].updateBy })

    return await this.dataVersionModel.save(data);
  }

  async getVersionIsApply(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year,isApply:true }], order: { version: 'DESC' } });
  }

  async getManual(params: any): Promise<any> {
    return await this.dataManualModel.find({ where: [{ year: params.year, month: params.month, version: params.version }] });
  }

  async saveManual(data: any) {
    if (data.length > 0) {
      await this.dataManualModel.delete({ year: data[0].year, month: data[0].month, version: data[0].version, productVersion: data[0].productVersion })
    }
    return await this.dataManualModel.save(data);
  }

  async getMonthMaxVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month};

    return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
  }

  async getVersionByID(id: any): Promise<any> {
    return await this.dataVersionModel.findOne({ id: id });
  }

  async getMaxYear() {
    return await this.dataModel.findOne({ where: [{}], order: { yearValue: 'DESC' } });
  }

  async getMaxMonthByYear(year: any) {
    return await this.dataModel.findOne({ where: [{ yearValue: year }], order: { monthValue: 'DESC' } });
  }


  async getVersionByYear(params: any): Promise<any> {
    return await this.dataVersionModel.find({ where: [params], order: { month: 'DESC', version: 'DESC' } });
  }

  async getMaster(): Promise<any> {
    return await this.dataMasterModel.find({
      order: {
        rowOrder: 'ASC',
      },
    });
  }
}
