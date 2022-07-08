import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { exit, getuid } from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  Repository,
  Transaction,
  TransactionRepository,
  createConnection,
  ConnectionOptions,
  Raw,
} from 'typeorm';
import { TOKENS } from '../../constants';
import console = require('console');
import { MasterConditionOfSaleSmartPricePrice } from './entity/master-condition-of-sale-smart-price.entity';
import { connectiondbSmartPrices } from '../../common/providers';
import moment = require('moment');

import { MasterContract } from '../master-contract/entity';
import { OptimizationVolumnActual } from '../../optimization/entity';
@Injectable()
export class MasterConditionOfSaleSmartPriceService {
  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterConditionOfSaleSmartPricePrice>,
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModelOptimizationVolumnActual: Repository<OptimizationVolumnActual>,
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModelContract: Repository<MasterContract>,
  ) { }

  async getMaster(month: any, year: any): Promise<any> {
    let contractData = await this.getGen(7, 2022);
    contractData = _.filter(contractData, { productName: 'C2' });
    return contractData;
  }

  async getList(params: any): Promise<any> {
    const sql = `SELECT *
    FROM master_condition_of_sale_smart_price_price`
    return this.dataModel.query(sql)
  }

  async saveActual(month: any, year: any): Promise<any> {
    const dbConSmartPrices = await connectiondbSmartPrices;

    dbConSmartPrices.connect;

    const sql = `SELECT  [TRANSATION_DATE] AS transation_date
    ,[PRODUCT_GRP_NAME] AS product_grp_name
    ,[PRODUCT_NAME] AS product_name
    ,[CUSTOMER_NAME] AS customer_name
    ,[ACTUAL_SELLING_PRICE] AS actual_selling_price
    ,[ACTUAL_VOLUME] AS actual_volume
    ,[INSERT_DATE] AS insert_date
    FROM smp_bi_tst.DEV_SMPRC_DMT.V_ACTUAL_DELIVERY_ALLO
    WHERE PRODUCT_NAME = 'Ethane' AND YEAR(TRANSATION_DATE) = @0`;

    let result = await dbConSmartPrices.manager.query(sql, [year]);

    dbConSmartPrices.close;
    await this.truncate(year);
    await this.create(result);
    const dataMaster = await this.getMaster(month, year);

    let arrActual: any = [];
    let dataActual: any = {};

    _.each(dataMaster, (item) => {
      const dataSmartPrice = _.filter(result, (itemSmartPrice) => {
        return itemSmartPrice.product_grp_name === item.productGrpNameSmartPrice
          && itemSmartPrice.product_name === item.productNameSmartPrice
          && itemSmartPrice.customer_name === item.customerNameSmartPrice
      })
      if (dataSmartPrice.length > 0) {

        _.each(dataSmartPrice, it => {
          const dateMonthYear = moment(it.transation_date).format('YYYY-M');
          const dateArr = dateMonthYear.split('-');
          dataActual = {};

          dataActual.contractConditionOfSaleId = item?.conditionsOfSaleId;
          dataActual.productName = item?.productName;
          dataActual.unit = item?.unitName;
          dataActual.sourceName = item?.sourceName;
          dataActual.demandName = item?.demandName;
          dataActual.deliveryName = item?.deliveryName;
          dataActual.yearValue = _.toNumber(dateArr[0]);
          dataActual.monthValue = _.toNumber(dateArr[1]);
          dataActual.valueActualSellingPrice = it?.actual_selling_price;
          dataActual.valueActualVolume = it?.actual_volume;

          if (dataActual.value !== 0) {
            arrActual.push(dataActual);
          }
        })
      }
    })
    await this.createSmartPrices(arrActual);
    return 'S';
  }

  @Transaction()
  async create(
    @TransactionRepository(MasterConditionOfSaleSmartPricePrice)
    manager: Repository<MasterConditionOfSaleSmartPricePrice>,
    data?: any,
  ) {
    return await manager.save(data, { chunk: 100 });
  }

  @Transaction()
  async createSmartPrices(
    @TransactionRepository(OptimizationVolumnActual)
    manager: Repository<OptimizationVolumnActual>,
    data?: any,
  ) {
    if (data.length > 0) {
      await manager.delete({ yearValue: data[0].yearValue });
    }

    return await manager.save(data, { chunk: 100 });
  }

  // //ส่งข้อมูลเป็น array มาอย่างเดว
  async update(data: any) {
    // // ('params', data);
    return this.dataModel.save({ ...data, id: data.id });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async truncate(year: any) {
    return await this.dataModel.query(
      'DELETE master_condition_of_sale_smart_price_price WHERE YEAR(TRANSATION_DATE) = @0 ', [year]
    );
  }

  async getGen(month: number, year: number) {

    let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(11, 'M');

    return await this.listData(dateStart, dateEnd);
  }

  async listData(dateStart, dateEnd): Promise<any> {
    const dataList: any = [];
    const startDateText = moment(dateStart).format('YYYY-MM-DD');
    const endDateText = moment(dateEnd).format('YYYY-MM-DD');

    const data = await this.dataModelContract.query("exec SP_CONTRACT_GEN @0, @1", [startDateText, endDateText])

    if (data && data.length > 0) {
      data.forEach(item => { dataList.push(item); })
    }

    return dataList;
  }

}
