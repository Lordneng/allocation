import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { IsNull, Not, Repository, Transaction, TransactionRepository } from 'typeorm';
import { MasterCostSmartPrice } from './entity';
import { TOKENS } from '../../constants';
import console = require('console');
import { isNotEmpty } from 'class-validator';
import { connectiondbSmartPrices } from '../../common/providers';
import moment = require('moment');
import { CostActual } from '../../cost/entity';

@Injectable()
export class MasterCostsSmartPriceService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterCostSmartPrice>,
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModelActual: Repository<CostActual>
  ) { }

  async getMaster(params: any): Promise<any> {
    const sql = `SELECT *
    FROM master_cost`
    return this.dataModel.query(sql)
  }

  async getList(params: any): Promise<any> {
    const sql = `SELECT *
    FROM master_cost_smart_price`
    return this.dataModel.query(sql)
  }

  async saveActual(year: any): Promise<any> {
    const dbConSmartPrices = await connectiondbSmartPrices;

    dbConSmartPrices.connect;

    const sql = `SELECT [TRANSATION_DATE] as transation_date
    ,[GSP_COST_NAME] as gsp_cost_name
    ,[NAME] as name
    ,[ACTUAL] as actual
    ,[ROLLING] as rolling
    ,[INSERT_DATE] as insert_date
    FROM [DEV_SMPRC_DMT].[V_GSP_COST_ROLLING_ALLO]
    WHERE YEAR(TRANSATION_DATE) = @0`;

    let result = await dbConSmartPrices.manager.query(sql, [year]);

    dbConSmartPrices.close;

    await this.truncate(year);

    await this.create(result);
    const dataMaster = await this.getMaster({});
    // console.log("dataMaster >> ", dataMaster);
    let arrActual: any = [];
    let dataActual: any = {};

    _.each(dataMaster, (item) => {
      const dataSmartPrice = _.filter(result, (itemSmartPrice) => {
        return itemSmartPrice.gsp_cost_name === item.productCostNameSmartPrice
      })
      if (dataSmartPrice.length > 0) {
        _.each(dataSmartPrice, it => {
          const dateMonthYear = moment(it.transation_date).format('YYYY-M');
          const dateArr = dateMonthYear.split('-');
          dataActual = {};
          dataActual.rowOrder = item.rowOrder;
          dataActual.costId = item.id;
          dataActual.cost = item.productCostName;
          dataActual.productId = item?.productId;
          dataActual.product = it.name;
          dataActual.yearValue = _.toNumber(dateArr[0]);
          dataActual.monthValue = _.toNumber(dateArr[1]);
          dataActual.value = it.actual;
          if (dataActual.value !== 0) {
            arrActual.push(dataActual);
          }
        })
      }
    })
    await this.createCostActual(arrActual);
    return 'S';
  }

  @Transaction()
  async create(
    @TransactionRepository(MasterCostSmartPrice)
    manager: Repository<MasterCostSmartPrice>,
    data?: any,
  ) {
    return await manager.save(data, { chunk: 100 });
  }

  @Transaction()
  async createCostActual(
    @TransactionRepository(CostActual)
    manager: Repository<CostActual>,
    data?: any,
  ) {
    if (data.length > 0) {
      await manager.delete({ yearValue: data[0].yearValue });
    }

    return await manager.save(data, { chunk: 100 });
  }

  // // //ส่งข้อมูลเป็น array มาอย่างเดว
  // async update(data: any) {
  //   // // ('params', data);
  //   return this.dataModel.save({ ...data, id: data.id });
  // }

  // async delete(id: any) {
  //   return await this.dataModel.delete({ id: id });
  // }

  async truncate(year: any) {
    return await this.dataModel.query(
      'DELETE master_cost_smart_price WHERE YEAR(TRANSATION_DATE) = @0 ', [year]
    );
  }

  async getForecast(year: any) {
    const dbConSmartPrices = await connectiondbSmartPrices;

    dbConSmartPrices.connect;

    const sql = `SELECT [TRANSATION_DATE] as transation_date
    ,[GSP_COST_NAME] as gsp_cost_name
    ,[NAME] as name
    ,[ACTUAL] as actual
    ,[ROLLING] as rolling
    ,[INSERT_DATE] as insert_date
    FROM [DEV_SMPRC_DMT].[V_GSP_COST_ROLLING_ALLO]
    WHERE YEAR(TRANSATION_DATE) = @0`;

    let result = await dbConSmartPrices.manager.query(sql, [year]);

    dbConSmartPrices.close;

    const dataMaster = await this.getMaster({});
    let arrActual: any = [];
    let dataActual: any = {};

    _.each(dataMaster, (item) => {
      const dataSmartPrice = _.filter(result, (itemSmartPrice) => {
        return itemSmartPrice.gsp_cost_name === item.productCostNameSmartPrice
      })
      if (dataSmartPrice.length > 0) {
        _.each(dataSmartPrice, it => {
          const dateMonthYear = moment(it.transation_date).format('YYYY-M');
          const dateArr = dateMonthYear.split('-');
          dataActual = {};
          dataActual.rowOrder = item.rowOrder;
          dataActual.costId = item.id;
          dataActual.cost = item.productCostName;
          dataActual.productId = item?.productId;
          dataActual.product = it.name;
          dataActual.yearValue = _.toNumber(dateArr[0]);
          dataActual.monthValue = _.toNumber(dateArr[1]);
          dataActual.value = it.actual;
          if (dataActual.value !== 0) {
            arrActual.push(dataActual);
          }
        })
      }
    })

    console.log(arrActual)
    return arrActual;
  }
}
