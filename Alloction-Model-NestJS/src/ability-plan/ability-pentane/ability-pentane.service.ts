
import * as _ from 'lodash';
import { AbilityPentaneForm, AbilityPentane, AbilityPentaneVersion, AbilityPentaneHistory, AbilityPentaneFormHistory } from './entity';
import { TOKENS } from '../../constants';
import { Inject, Injectable } from '@nestjs/common';
import { getConnection, In, Repository } from 'typeorm';
import moment from 'moment';

@Injectable()
export class AbilityPentaneService {
  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<AbilityPentane>,
    @Inject(TOKENS.ProjectRepositoryTokenHistory) private readonly dataModelHistory: Repository<AbilityPentaneHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenForm) private readonly dataFormModel: Repository<AbilityPentaneForm>,
    @Inject(TOKENS.ProjectRepositoryTokenFormHistory) private readonly dataFormModelHistory: Repository<AbilityPentaneFormHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<AbilityPentaneVersion>
  ) {

  }

  async getList(params: any): Promise<any> {

    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');

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

  async getListToModel(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    dateStart = moment(dateStart).add(1, 'M');
    let dateEnd = moment(dateStart).add(13, 'M');

    let data = await this.listData(dateStart, dateEnd, params);
    if (data && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.isCalculate === true) {
          element.value = (element.value * 24 * element.dayValue) / 1000;
        }
      }
    }
    return data;
  }

  async getListAbility(params: any): Promise<any> {

    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    dateStart = dateStart.add(1, 'M');//เดือนถัดไป
    let dateEnd = moment(dateStart).add(11, 'M');//เดือนปัจจุบันในปีถัดไป

    let data = await this.listData(dateStart, dateEnd, params);
    if (data && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.isCalculate === true) {
          element.value = element.value * 24 * element.dayValue / 1000;
        }
      }
    }
    return data;
  }

  async getLpgRollingReport(params: any): Promise<any> {

    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    dateStart = dateStart.add(1, 'M');//เดือนถัดไป
    let dateEnd = moment(dateStart).add(1, 'y');//เดือนปัจจุบันในปีถัดไป

    let data = await this.listData(dateStart, dateEnd, params);
    if (data && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.isCalculate === true) {
          element.value = element.value * 24 * element.dayValue / 1000;
        }
      }
    }
    return data;
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
        let dataVersion = await this.dataModel.findOne({ where: { monthValue: index.month() + 1, yearValue: index.year() }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })

        if (dataVersion) {
          data = await this.dataModel.find({ where: { monthValue: index.month() + 1, yearValue: index.year(), month: dataVersion.month, year: dataVersion.year, version: dataVersion.version }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })
        }
        else {
          data = await this.getLastMonth(moment(index).add(-1, 'M'), 1)
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

  async listDataByProduct(dateStart, dateEnd, params): Promise<any> {
    let dataList: any = [];

    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
      let data = await this.dataModel.find({
        where: {
          monthValue: index.month() + 1,
          yearValue: index.year(),
          year: params.year,
          month: params.month,
          version: params.version,
          product: In(params.products)
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
            product: In(params.products)
          },
          order: {
            year: 'DESC',
            month: 'DESC',
            version: 'DESC'
          }
        })

        if (dataVersion) {
          data = await this.dataModel.find({
            where: {
              monthValue: index.month() + 1,
              yearValue: index.year(),
              month: dataVersion.month,
              year: dataVersion.year,
              version: dataVersion.version,
              product: In(params.products)
            }, order: { year: 'DESC', month: 'DESC', version: 'DESC' }
          })
        }
        else {
          data = await this.getLastMonthByProduct(moment(index).add(-1, 'M'), params.products)
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

  async getLastMonth(lastMonth: any, index: any) {
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

  async getLastMonthByProduct(lastMonth: any, products) {
    const dataVersion = await this.dataModel.findOne({
      where: {
        monthValue: lastMonth.month() + 1,
        yearValue: lastMonth.year(),
        product: In(products)
      },
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
          product: In(products)
        },
      });
      if (data && data.length > 0) {
        return data;
      }
    }

    return this.getLastMonthByProduct(moment(lastMonth).add(-1, 'M'), products)
  }

  async getHistoryList(params: any): Promise<any> {
    let version = _.toNumber(params.version)
    if (version < 0) {

      // ("ดึงย้อนหลัง");
      return await this.getRecursiveData(params);
    } else {
      // ("ดึงปกติ");
      return await this.dataModelHistory.find({ version: params.version, month: params.month, year: params.year });
    }

  }
  async getHistoryData(params: any): Promise<any> {
    return await this.dataModelHistory.find({ version: params.version, month: params.month, year: params.year });
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
  async getForm(params: any): Promise<any> {
    return await (await this.dataFormModel.find({
      where: [{
        year: _.toInteger(params.year),
        month: _.toInteger(params.month),
        version: _.toInteger(params.version),
      }],
      order: {
        rowOrder: "ASC"
      }
    }))
  }

  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ "id": id })
  }

  async save(data: any) {
    await getConnection().transaction(async transactionalEntityManager => {
      // Version
      for (const item of data.version) {
        const dataDelete: any = await this.dataVersionModel.find({ year: item.year, month: item.month, version: item.version })
        if (dataDelete) {
          item.id = dataDelete.id;
        }
      }
      for (const item of data.version) {
        await transactionalEntityManager.delete(AbilityPentaneVersion, { year: item.year, month: item.month, version: item.version });
        await transactionalEntityManager.delete(AbilityPentane, { year: item.year, month: item.month, version: item.version });
      }
      await transactionalEntityManager.delete(AbilityPentaneForm, {});

      await transactionalEntityManager.save(AbilityPentaneVersion, data.version, { chunk: 100 });
      await transactionalEntityManager.save(AbilityPentane, data.abilityPentane, { chunk: 100 });
      await transactionalEntityManager.save(AbilityPentaneForm, data.form, { chunk: 100 });
    })
  }

  async saves(data: any) {
    // if (data.length > 0) {
    //   await this.dataModel.delete({ 
    //     year: _.toInteger(data[0].year) , 
    //     month: _.toInteger(data[0].month), 
    //     version: _.toInteger(data[0].version) 
    //   })
    // }
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
      await this.dataModelHistory.delete({ month: _.toInteger(data[0].month), year: _.toInteger(data[0].year), version: data[0].version })
    }

    this.dataModelHistory.save(data, { chunk: 100 });
    return await this.dataModel.save(data, { chunk: 100 });
  }

  async SaveForm(data: any) {
    // if (data.length > 0) {
    //   await this.dataFormModel.delete({ 
    //     year: _.toInteger(data[0].year) , 
    //     month: _.toInteger(data[0].month), 
    //     version: _.toInteger(data[0].version) 
    //   })
    // }
    // return await this.dataFormModel.save(data);
    await this.dataFormModel.delete({})
    this.dataFormModelHistory.save(data, { chunk: 100 });
    return await this.dataFormModel.save(data, { chunk: 100 });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: _.toInteger(params.month) };

    // if (params.isApply && params.isApply === true) {
    //   dataWhere.isApply = true;
    // }

    return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async getMonthMaxVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month, isApply: true };

    return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
  }

  async saveVersion(data: any) {
    await this.dataVersionModel.update({ year: data[0].year, month: data[0].month, isApply: true }, { isApply: false, updateBy: data[0].updateBy })

    return await this.dataVersionModel.save(data);
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
  async getVersionById(params: any) {
    return await this.dataVersionModel.findOne({
      where: [{ id: params.versionId }]
    });
  }
  async getVersionById2(id: any) {
    return await this.dataVersionModel.findOne({
      where: [{ id: id }]
    });
  }
}