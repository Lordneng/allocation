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
import { MasterReferenceSmartPrice } from './entity/master-reference-smart-prices.entity';
import { connectiondbSmartPrices } from '../../common/providers';
import { ReferencePrice, ReferencePriceActual } from '../../reference-prices/entity';
import moment = require('moment');
@Injectable()
export class MasterReferenceSmartPricesService {
  constructor(
    @Inject(TOKENS.ProjectRepositoryToken)
    private readonly dataModel: Repository<MasterReferenceSmartPrice>,
    @Inject(TOKENS.ProjectRepositoryToken)
    private readonly dataModelRefPrice: Repository<ReferencePrice>,
  ) { }

  async getMaster(params: any): Promise<any> {
    const sql = `SELECT *
    FROM master_reference_price`
    return this.dataModel.query(sql)
  }

  async getList(params: any): Promise<any> {
    const sql = `SELECT *
    FROM master_reference_smart_price`
    return this.dataModel.query(sql)
  }
  async saveActual(year: any): Promise<any> {
    const dbConSmartPrices = await connectiondbSmartPrices;

    dbConSmartPrices.connect;

    const sql = `SELECT [TRANS_DATE] as trans_date
    ,[REF_PRICE_NAME] as ref_price_name
    ,[INPUT_NAME] as input_name
    ,[UNIT] as unit
    ,[TYPE] as type
    ,[ACTUAL_PRICE] as actual_price
    ,[ROLLING_PRICE] as rolling_price
    ,[INSERT_DATE] as insert_date
    FROM [DEV_SMPRC_DMT].[V_REF_PRICE_ALLO]
    WHERE YEAR(TRANS_DATE) = @0`;

    let result = await dbConSmartPrices.manager.query(sql, [year]);

    dbConSmartPrices.close;

    await this.truncate(year);

    await this.create(result);
    const dataMaster = await this.getMaster({});
    let arrActual: any = [];
    let dataActual: any = {};

    _.each(dataMaster, (item) => {
      const dataSmartPrice = _.filter(result, (itemSmartPrice) => {
        return itemSmartPrice.ref_price_name + '_' + itemSmartPrice.input_name + '_' + itemSmartPrice.unit === item.referencePriceNameFromSmart
      })
      if (dataSmartPrice.length > 0) {

        const dataGroup = _.groupBy(dataSmartPrice, (itemGroup) => {
          return moment(itemGroup.trans_date).format('YYYY-M');
        })

        for (var key in dataGroup) {
          if (dataGroup.hasOwnProperty(key)) {
            if (dataGroup[key].length > 0) {
              const date = key.split('-');
              dataActual = {};
              dataActual.rowOrder = item.rowOrder
              dataActual.unit = item.unit
              dataActual.referencePriceNameFrom = item.referencePriceNameFrom
              dataActual.referencePriceNameTo = item.referencePriceNameTo
              dataActual.yearValue = _.toNumber(date[0])
              dataActual.monthValue = _.toNumber(date[1])
              dataActual.value = _.sumBy(dataGroup[key], 'actual_price') / dataGroup[key].length;
              if (dataActual.value !== 0) {
                arrActual.push(dataActual);
              }

            }

          }
        }
        // // (dataGroup);
      }
    })
    await this.createRefPrices(arrActual);

    return 'S';
  }

  async insertReferencePrice(year): Promise<any> {
    //Select From MasterReferenceSmartPrice
    var dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    if (year < dateObj.getUTCFullYear()) {
      month = 13;
    } else if (year > dateObj.getUTCFullYear()) {
      month = 0;
    }
    let querytxt =
      `SELECT unit
                  ,year
                  ,version
                  ,filePath
                  ,referencePriceNameFrom
                  ,referencePriceNameTo
                  ,month
                  ,SUM(M1) M1
                  ,SUM(M2) M2
                  ,SUM(M3) M3
                  ,SUM(M4) M4
                  ,SUM(M5) M5
                  ,SUM(M6) M6
                  ,SUM(M7) M7
                  ,SUM(M8) M8
                  ,SUM(M9) M9
                  ,SUM(M10) M10
                  ,SUM(M11) M11
                  ,SUM(M12) M12
              FROm (
              select master_reference_price.unit AS unit
                  ,` +
      year +
      ` AS year
                  ,0 AS version
                  ,null AS filePath
                  ,master_reference_price.referencePriceNameFrom AS referencePriceNameFrom
                  ,master_reference_price.referencePriceNameTo AS referencePriceNameTo
                  ,` +
      month +
      ` AS month
                  ,master_reference_price.rowOrder
                  ,case when month(M1.trans_date) = 1 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M1
                  ,case when month(M1.trans_date) = 2 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M2
                  ,case when month(M1.trans_date) = 3 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M3
                  ,case when month(M1.trans_date) = 4 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M4
                  ,case when month(M1.trans_date) = 5 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M5
                  ,case when month(M1.trans_date) = 6 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M6
                  ,case when month(M1.trans_date) = 7 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M7
                  ,case when month(M1.trans_date) = 8 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M8
                  ,case when month(M1.trans_date) = 9 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M9
                  ,case when month(M1.trans_date) = 10 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M10
                  ,case when month(M1.trans_date) = 11 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M11
                  ,case when month(M1.trans_date) = 12 THEN AVG(isnull(M1.actual_price,M1.rolling_price)) else null end M12

              FROM master_reference_price
              LEFT JOIN master_reference_smart_price M1 on master_reference_price.referencePriceNameFromSmart = CONCAT(M1.ref_price_name,'_',M1.input_name,'_',M1.unit)
              AND YEAR(M1.trans_date) = ` +
      year +
      `

              group By master_reference_price.unit 
                  ,master_reference_price.referencePriceNameTo 
                  ,master_reference_price.referencePriceNameTo 
                  ,master_reference_price.referencePriceNameFrom 
                  ,master_reference_price.referencePriceNameTo
                  ,master_reference_price.rowOrder
                  ,YEAR(M1.trans_date)
                  ,month(M1.trans_date)
                  ) x
            --   WHERE x.M1 IS NOT NULL OR 
            --         x.M2 IS NOT NULL OR
            --         x.M3 IS NOT NULL OR
            --         x.M4 IS NOT NULL OR
            --         x.M5 IS NOT NULL OR
            --         x.M6 IS NOT NULL OR
            --         x.M7 IS NOT NULL OR
            --         x.M8 IS NOT NULL OR
            --         x.M9 IS NOT NULL OR
            --         x.M10 IS NOT NULL OR
            --         x.M11 IS NOT NULL OR
            --         x.M12 IS NOT NULL
              group BY unit
                  ,year
                  ,version
                  ,filePath
                  ,referencePriceNameFrom
                  ,referencePriceNameTo
                  ,month
                  ,rowOrder
              ORDER BY rowOrder`;

    // // (querytxt);
    // exit();

    let result = await this.dataModel.query(querytxt);

    await this.createRefPrices(result);
  }

  @Transaction()
  async create(
    @TransactionRepository(MasterReferenceSmartPrice)
    manager: Repository<MasterReferenceSmartPrice>,
    data?: any,
  ) {
    return await manager.save(data, { chunk: 100 });
  }

  @Transaction()
  async createRefPrices(
    @TransactionRepository(ReferencePriceActual)
    manager: Repository<ReferencePriceActual>,
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
      'DELETE master_reference_smart_price WHERE YEAR(TRANS_DATE) = @0 ', [year]
    );
  }

  async getForecast(year:any) {
    const dbConSmartPrices = await connectiondbSmartPrices;

    dbConSmartPrices.connect;

    const sql = `SELECT [TRANS_DATE] as trans_date
    ,[REF_PRICE_NAME] as ref_price_name
    ,[INPUT_NAME] as input_name
    ,[UNIT] as unit
    ,[TYPE] as type
    ,[ACTUAL_PRICE] as actual_price
    ,[ROLLING_PRICE] as rolling_price
    ,[INSERT_DATE] as insert_date
    FROM [DEV_SMPRC_DMT].[V_REF_PRICE_ALLO]
    WHERE YEAR(TRANS_DATE) = @0`;
//AND MONTH(TRANS_DATE) >= MONTH(GETDATE()) AND @0 >= YEAR(GETDATE())
    let result = await dbConSmartPrices.manager.query(sql, [year]);

    dbConSmartPrices.close;

    const dataMaster = await this.getMaster({});
    let arrActual: any = [];
    let dataActual: any = {};

    _.each(dataMaster, (item) => {
      const dataSmartPrice = _.filter(result, (itemSmartPrice) => {
        return itemSmartPrice.ref_price_name + '_' + itemSmartPrice.input_name + '_' + itemSmartPrice.unit === item.referencePriceNameFromSmart
      })
      if (dataSmartPrice.length > 0) {

        const dataGroup = _.groupBy(dataSmartPrice, (itemGroup) => {
          return moment(itemGroup.trans_date).format('YYYY-M');
        })

        for (var key in dataGroup) {
          if (dataGroup.hasOwnProperty(key)) {
            if (dataGroup[key].length > 0) {
              const date = key.split('-');
              dataActual = {};
              dataActual.rowOrder = item.rowOrder
              dataActual.unit = item.unit
              dataActual.referencePriceNameFrom = item.referencePriceNameFrom
              dataActual.referencePriceNameTo = item.referencePriceNameTo
              dataActual.yearValue = _.toNumber(date[0])
              dataActual.monthValue = _.toNumber(date[1])
              dataActual.value = _.sumBy(dataGroup[key], 'rolling_price') / dataGroup[key].length;
              if (dataActual.value !== 0) {
                arrActual.push(dataActual);
              }

            }

          }
        }
        // // (dataGroup);
      }
    })
    console.log(arrActual)
    return arrActual;
 }
}
