import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { getuid } from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  In,
  IsNull,
  Not,
  Raw,
  Repository,
  Transaction,
  TransactionManager,
} from 'typeorm';
import {
  AbilityPlanRayong,
  AbilityPlanRayongDaily,
  AbilityPlanRayongVersion,
  MasterAbilityPlanRayong,
} from './entity';
import { TOKENS } from '../../constants';
import moment from 'moment';
import { InventoryMovement } from '../../inventory-control/entity';

@Injectable()
export class AbilityPlanRayongService {
  constructor(
    @Inject(TOKENS.ProjectRepositoryToken)
    private readonly dataModel: Repository<AbilityPlanRayong>,
    @Inject(TOKENS.ProjectRepositoryTokenManual)
    private readonly dataDailyModel: Repository<AbilityPlanRayongDaily>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion)
    private readonly dataVersionModel: Repository<AbilityPlanRayongVersion>,
    @Inject(TOKENS.ProjectRepositoryTokenMaster)
    private readonly dataMasterModel: Repository<MasterAbilityPlanRayong>,
  ) { }

  async getList(params: any): Promise<any> {

    return await this.dataModel.find({
      where: [
        {
          year: _.toInteger(params.year),
          month: _.toInteger(params.month),
          version: params.version,
        },
      ],
      order: {
        rowOrder: 'ASC',
      },
    });
  }

  async getListByProductAndPlant(params: any): Promise<any> {

    return await this.dataModel.find({
      where: [
        {
          year: _.toInteger(params.year),
          month: _.toInteger(params.month),
          version: params.version,
          product: In(params.products),
          productionPlant: In(params.plants)
        },
      ],
      order: {
        rowOrder: 'ASC',
      },
    });
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

  @Transaction()
  async saveTrans(@TransactionManager() manager: EntityManager, data?: any, daily?: any, dataVersion?: any) {

    let dataSave: any = [];
    let year = 0, month = 0, version = 0,id,versionName;
    if (dataVersion.length > 0) {
      year = dataVersion[0].year;
      month = dataVersion[0].month;
      version = dataVersion[0].version;
      id = dataVersion[0].id;
      versionName = dataVersion[0].versionName;
    }
    await this.dataVersionModel.delete({
      year: year,
      month: month,
      version: version,
    })

    await this.dataModel.delete({
      year: year,
      month: month,
      version: version,
    })
    await this.dataDailyModel.delete({
      year: year,
      month: month,
      version: version,
    })

    if (data.length > 0) {
      dataSave = data.map(item => {
        const rayong = new AbilityPlanRayong();
        Object.assign(rayong, item);
        return rayong;
      })
      await manager.save(dataSave, { chunk: 100 });
    }

    if (daily.length > 0) {
      const dataDailySave = daily.map(item => {
        const dailyObj = new AbilityPlanRayongDaily();
        Object.assign(dailyObj, item);
        return dailyObj;
      })
      await manager.save(dataDailySave, { chunk: 100 });
    }

    if (dataVersion.length > 0) {

      const dataVersionSave: AbilityPlanRayongVersion[] = [];
      for (const item of dataVersion) {
        const dataSave = new AbilityPlanRayongVersion();
        Object.assign(dataSave, item);
        dataVersionSave.push(dataSave);
      }
      await manager.save(dataVersionSave, { chunk: 100 });

    }

    await manager.delete(InventoryMovement, {
      month: month,
      year: year,
      version: version,
      abilityRYVersionId: Not(IsNull())
    })

    let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');
    const movements: InventoryMovement[] = [];

    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {

      const dataLpgProduct = _.filter(dataSave, (item) => {
        return item.product === 'LPG' &&
          item.supplier === 'GC' &&
          item.monthValue === index.month() + 1 &&
          item.yearValue === index.year();
      })

      const dataLpg = _.find(dataSave, (item) => {
        return item.product === 'LPG' &&
          item.monthValue === index.month() + 1 &&
          item.yearValue === index.year();
      });

      const dataC3 = _.find(dataSave, (item) => {
        return item.product === 'C3' &&
          item.monthValue === index.month() + 1 &&
          item.yearValue === index.year();
      });

      const dataNgl = _.find(dataSave, (item) => {
        return item.product === 'NGL' &&
          item.monthValue === index.month() + 1 &&
          item.yearValue === index.year();
      });

      if (dataLpg) {
        const dataLpgProduct = _.filter(dataSave, (item) => {
          return item.product === 'LPG' &&
            item.monthValue === index.month() + 1 &&
            item.yearValue === index.year();
        })

        const sumLpg = _.sumBy(dataLpgProduct, (item) => {
          return item.value
        });

        const lpgMovement = new InventoryMovement();
        lpgMovement.endOfMonthDate = moment(index).endOf('month').toDate();
        lpgMovement.productId = dataLpg.productId;
        lpgMovement.productCode = dataLpg.product;
        lpgMovement.movementType = 1;
        lpgMovement.movementName = 'Receive'
        lpgMovement.forecastDemandTotalQty = sumLpg;
        lpgMovement.forecastDemandUnitCode = 'KTon';
        lpgMovement.abilityRYVersionId = id;
        lpgMovement.abilityRYVersionName = versionName;
        lpgMovement.month = _.toInteger(month);
        lpgMovement.year = _.toInteger(year);
        lpgMovement.version = _.toInteger(version);
        lpgMovement.monthValue = index.month() + 1;
        lpgMovement.yearValue = index.year();
        lpgMovement.createBy = dataLpg.createBy;
        lpgMovement.createByUserId = dataLpg.createByUserId;
        lpgMovement.updateBy = dataLpg.updateBy;
        lpgMovement.updateByUserId = dataLpg.updateByUserId;
        lpgMovement.optimizationVersionId = null;

        movements.push(lpgMovement);
      }

      if (dataC3) {
        const dataC3Product = _.filter(dataSave, (item) => {
          return item.product === 'C3' &&
            item.monthValue === index.month() + 1 &&
            item.yearValue === index.year();
        })

        const sumC3 = _.sumBy(dataC3Product, (item) => {
          return item.value
        });

        const c3Movement = new InventoryMovement();
        c3Movement.endOfMonthDate = moment(index).endOf('month').toDate();
        c3Movement.productId = dataC3.productId;
        c3Movement.productCode = dataC3.product;
        c3Movement.movementType = 1;
        c3Movement.movementName = 'Receive'
        c3Movement.forecastDemandTotalQty = sumC3;
        c3Movement.forecastDemandUnitCode = 'KTon';
        c3Movement.abilityRYVersionId = id;
        c3Movement.abilityRYVersionName = versionName;
        c3Movement.month = _.toInteger(month);
        c3Movement.year = _.toInteger(year);
        c3Movement.version = _.toInteger(version);
        c3Movement.monthValue = index.month() + 1;
        c3Movement.yearValue = index.year();
        c3Movement.createBy = dataLpg.createBy;
        c3Movement.createByUserId = dataLpg.createByUserId;
        c3Movement.updateBy = dataLpg.updateBy;
        c3Movement.updateByUserId = dataLpg.updateByUserId;
        c3Movement.optimizationVersionId = null;

        movements.push(c3Movement);
      }

      if (dataNgl) {
        const dataNglProduct = _.filter(dataSave, (item) => {
          return item.product === 'NGL' &&
            item.monthValue === index.month() + 1 &&
            item.yearValue === index.year();
        })

        const sumNgl = _.sumBy(dataNglProduct, (item) => {
          return item.value
        });

        const nglMovement = new InventoryMovement();
        nglMovement.endOfMonthDate = moment(index).endOf('month').toDate();
        nglMovement.productId = dataNgl.productId;
        nglMovement.productCode = dataNgl.product;
        nglMovement.movementType = 1;
        nglMovement.movementName = 'Receive'
        nglMovement.forecastDemandTotalQty = sumNgl;
        nglMovement.forecastDemandUnitCode = 'KM3';
        nglMovement.abilityRYVersionId = id;
        nglMovement.abilityRYVersionName = versionName;
        nglMovement.month = _.toInteger(month);
        nglMovement.year = _.toInteger(year);
        nglMovement.version = _.toInteger(version);
        nglMovement.monthValue = index.month() + 1;
        nglMovement.yearValue = index.year();
        nglMovement.createBy = dataLpg.createBy;
        nglMovement.createByUserId = dataLpg.createByUserId;
        nglMovement.updateBy = dataLpg.updateBy;
        nglMovement.updateByUserId = dataLpg.updateByUserId;
        nglMovement.optimizationVersionId = null;

        movements.push(nglMovement);
      }
    }

    await manager.save(movements, { chunk: 100 });
  }

  // async save(data: any) {
  //   if (data.length > 0) {
  //     await this.dataModel.delete({ year: data[0].year, month: data[0].month })
  //     // await this.dataManualModel.delete({ year: data[0].year, month: data[0].month, version: data[0].versionRemove })
  //   }
  //   return await this.dataModel.save(data);
  // }

  async save(data: any) {
    if (data.length > 0) {
      await this.dataModel.delete({
        year: data[0].year,
        month: data[0].month,
        version: data[0].version,
      });
    }
    return await this.dataModel.save(data, { chunk: 10 });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getDaily(params: any): Promise<any> {
    return await this.dataDailyModel.find({
      where: [
        {
          year: _.toInteger(params.year),
          month: _.toInteger(params.month),
          version: params.version,
          product: In(['Ethane']),
        },
      ],
      order: {
        rowOrder: 'ASC',
      },
    });
  }

  async getEthanePlannigDaily(year: Number, month: Number, date: string, version: Number): Promise<any> {
    return await this.dataDailyModel.find({
      where: [
        {
          year: year,
          month: month,
          version: version,
          date: Raw((alias) => `MONTH(${alias}) = ${date}`),
          product: In(['Ethane']),
          productionPlant: In(['low CO2', 'High CO2']),
        },
      ],
      order: {
        rowOrder: 'ASC',
      },
    });
  }

  async saveDaily(data: any) {
    if (data.length > 0) {
      await this.dataDailyModel.delete({
        year: data[0].year,
        month: data[0].month,
        version: data[0].version,
      });
    }
    return await this.dataDailyModel.save(data, { chunk: 10 });
  }

  async getVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year };
    if (params.isApply === true) {
      dataWhere.isApply = true;
    }
    return await this.dataVersionModel.find({
      where: [dataWhere],
      order: { month: 'DESC', version: 'DESC' },
    });
  }

  async getVersionByID(id: any): Promise<any> {
    return await this.dataVersionModel.findOne({ id: id });
  }

  async saveVersion(data: any) {
    // ('ability-plan-rayong.service version save', data);
    if (data[0].isApply === true) {
      await this.dataVersionModel.update(
        { year: data[0].year, month: data[0].month, isApply: true },
        { isApply: false, updateBy: data[0].updateBy },
      );
    }

    return await this.dataVersionModel.save(data);
  }

  async getMaxVersion(params: any) {
    return await this.dataVersionModel.findOne({
      where: [{ year: params.year }],
      order: { version: 'DESC' },
    });
  }

  async getIsApplyVersion(params: any) {
    return await this.dataVersionModel.findOne({
      where: [{ year: params.year, month: params.month, isApply: true }],
      order: { version: 'DESC' },
    });
  }

  async getVersionById(params: any) {
    return await this.dataVersionModel.findOne({
      where: [{ id: params.versionId }]
    });
  }

  async getAbility(params: any): Promise<any> {
    let dataList = [];
    const data = await this.getDaily(params);
    if (data) {
      const filterDaily = _.filter(data, x => {
        return x.product !== '' && x.product !== 'C3/LPG';
      });
      const outputDaily = _.map(
        _.groupBy(filterDaily, item => {
          return [
            item['product'],
            moment(item['date']).format('YYYY-MM'),
            item['productionPlant'],
          ];
        }),
        (items, idx) => {
          return {
            groupIndex: idx,
            product: items[0].product,
            date: moment(items[0].date).format('YYYY-MM'),
            value: _.sumBy(items, 'value') / 1000,
            productionPlant: items[0].productionPlant,
            productionPlantRoman: this.getRomanString(items[0].productionPlant),
            month: _.toNumber(moment(items[0].date).format('MM')),
            year: _.toNumber(moment(items[0].date).format('YYYY')),
            importMonth: items[0].month,
            importYear: items[0].year,
          };
        },
      );

      // // ("outputDaily ::: >> ", _.orderBy(outputDaily, ['product', 'date'], ['asc', 'asc']));
      dataList = _.orderBy(
        outputDaily,
        ['product', 'date', 'productionPlant'],
        ['asc', 'asc', 'asc'],
      );

      return dataList;
    }
  }

  getRomanString(name: any) {
    let romanString = '';
    switch (name) {
      case 'GSP1':
        romanString = 'GSP I';
        break;
      case 'GSP2':
        romanString = 'GSP II';
        break;
      case 'GSP3':
        romanString = 'GSP III';
        break;
      case 'GSP5':
        romanString = 'GSP V';
        break;
      case 'GSP6':
        romanString = 'GSP VI';
        break;
      case 'ESP':
        romanString = 'ESP';
        break;
    }

    return romanString;
  }

  async getVersionByYear(params: any): Promise<any> {
    return await this.dataVersionModel.find({
      where: [params],
      order: { month: 'DESC', version: 'DESC' },
    });
  }

  async listEthanePlanningDataByProductPlant(date, productionPlant): Promise<any> {
    return await this.dataModel.findOne({
      where: {
        monthValue: date.month() + 1,
        yearValue: date.year(),
        product: 'C2',
        productionPlant: productionPlant
      },
      order: { version: 'DESC' }
    });

  }

  async getEthanePlanningLastMonth(lastMonth: any, endDate: any, productionPlant: any) {

    const data = await this.dataModel.find({
      where: {
        monthValue: lastMonth.month() + 1,
        yearValue: lastMonth.year(),
        product: 'C2',
        productionPlant: productionPlant
      },
      order: { version: 'DESC' }
    });

    if (data && data.length > 0) {
      return data;
    }

    if (lastMonth <= endDate) {
      return [];
    }

    lastMonth = moment(lastMonth).add(-1, 'M')

    return await this.getEthanePlanningLastMonth(lastMonth, endDate, productionPlant)
  }

  async getEthanePlanningData(year: Number, month: Number, yearValue: Number, monthValue: Number, version: Number): Promise<any> {

    return await this.dataModel.find({
      where: [
        {
          year: year,
          month: month,
          yearValue: yearValue,
          monthValue: monthValue,
          version: version,
          product: In(['C2']),
          productionPlant: In(['Low CO2', 'High CO2'])

        },
      ],
      order: { version: 'ASC' }
    });

  }

  async getMaster(): Promise<any> {
    return await this.dataMasterModel.find({
      order: {
        rowOrder: 'ASC',
      },
    });
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
      return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
    }

  }
}
