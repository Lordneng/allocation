import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  UseGuards, Request, Param, Res,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import fs from 'fs';
import * as _ from 'lodash';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OptimizationsService } from './optimizations.service';
import { MasterProductsService } from '../Master/master-products/master-products.service';
import { VolumeConstrainService } from '../volume-constrain/volume-constrain.service';
import { CalMarginService } from '../cal-margin/cal-margin.service';
import { MarginPerUnitsService } from '../margin-per-units/margin-per-units.service';
import { MasterContractService } from '../Master/master-contract/master-contract.service';
import { TankCapService } from '../tank-cap/tank-cap.service';
import { DepotManagementMeterService } from '../depot-management/depot-management.service';
import moment from 'moment';
import { AbilityPlanRayongService } from '../ability-plan/ability-plan-rayong/ability-plan-rayong.service';
import { MasterTankCapService } from '../Master/master-tank-cap/master-tank-cap.service';
import { MasterDepotService } from '../Master/master-depot/master-depot.service';
import { AbilityPentaneService } from '../ability-plan/ability-pentane/ability-pentane.service';
import { AbilityPlanKhmService } from '../ability-plan/ability-plan-khm/ability-plan-khm.service';
import { AbilityRefineryService } from '../ability-plan/ability-refinery/ability-refinery.service';
import { MasterSupplierService } from '../Master/master-suppliers/master-suppliers.service';
import { LRByLegalService } from '../lr-by-legal/lr-by-legal.service';
import { promisify } from 'util';
// @UseGuards(JwtAuthGuard)
@Controller('optimizations')
export class OptimizationsController {
  constructor(private service: OptimizationsService,
    private masterProductsService: MasterProductsService,
    private volumeConstrainService: VolumeConstrainService,
    private calMarginService: CalMarginService,
    private marginPerUnitsService: MarginPerUnitsService,
    private masterContractService: MasterContractService,
    private tankCapService: TankCapService,
    private depotManagementMeterService: DepotManagementMeterService,
    private abilityPlanRayongService: AbilityPlanRayongService,
    private masterTankCapService: MasterTankCapService,
    private masterDepotService: MasterDepotService,
    private abilityPentaneService: AbilityPentaneService,
    private abilityPlanKhmService: AbilityPlanKhmService,
    private abilityRefineryService: AbilityRefineryService,
    private masterSupplierService: MasterSupplierService,
    private lrByLegalService: LRByLegalService,
  ) { }

  @Get()
  async get(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getList(params)
  }

  @Get('c3lpg')
  async getC3Lpg(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getC3LpgList(params)
  }

  @Get('co2')
  async getCo2(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getCo2List(params)
  }

  @Get('ngl')
  async getNgl(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getNglList(params)
  }

  @Get('pantane')
  async getPantane(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getPantaneList(params)
  }

  @Get('lr-monthly')
  async getLrMonthlyList(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getLrMonthlyList(params)
  }
  @Get('volumn')
  async getLVolumnList(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getVolumnList(params)
  }
  @Post()
  @ApiBearerAuth()
  create(@Request() req, @Body() data: any) {
    if (req.user) {

      _.each(data.optimizationC2, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.optimizationC2Revision, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.optimizationC3Lpg, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.optimizationC3LpgRevision, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      // _.each(data.optimizationCo2, (item) => {
      //   item.createByUserId = req.user.userId;
      //   item.createBy = req.user.fullName;
      //   item.updateByUserId = req.user.userId;
      //   item.updateBy = req.user.fullName;
      // })

      // _.each(data.optimizationCo2Revision, (item) => {
      //   item.createByUserId = req.user.userId;
      //   item.createBy = req.user.fullName;
      //   item.updateByUserId = req.user.userId;
      //   item.updateBy = req.user.fullName;
      // })

      _.each(data.optimizationNgl, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.optimizationNglRevision, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.optimizationPantane, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.optimizationPantaneRevision, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.optimizationLrMonthly, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.optimizationLrMonthlyRevision, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })
      _.each(data.optimizationVolumn, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      data.optimizationVersion.createByUserId = req.user.userId;
      data.optimizationVersion.createBy = req.user.fullName;
      data.optimizationVersion.updateByUserId = req.user.userId;
      data.optimizationVersion.updateBy = req.user.fullName;

    }
    return this.service.save(data);
  }

  @Get('version')
  getVersion(@Query('year') year, @Query('isApply') isApply, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, isApply: isApply, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getVersion(params)
  }

  @Get('version-month')
  getMonthVersion(@Query('year') year, @Query('month') month, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getMonthVersion(params)
  }

  @Get('manual')
  getManual(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getManual(params)
  }

  @Get('manual/c3lpg')
  getC3LpgManual(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getC3LpgManual(params)
  }

  @Get('manual/co2')
  getCo2Manual(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getCo2Manual(params)
  }

  @Get('manual/ngl')
  getNglManual(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getNglManual(params)
  }

  @Get('manual/pantane')
  getPantaneManual(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getPantaneManual(params)
  }

  @Get('revision')
  async getRevision(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getC2Revision(params)
  }

  @Get('revision/c3lpg')
  async getC3LpgRevision(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getC3LpgRevision(params)
  }


  @Get('revision/co2')
  async getCo2Revision(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getCo2Revision(params)
  }

  @Get('revision/ngl')
  async getNglRevision(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getNglRevision(params)
  }

  @Get('revision/pantane')
  async getPantaneRevision(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getPantaneRevision(params)
  }

  @Get('revision/lr-monthly')
  async getLrMonthlyRevision(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
    const params = { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI }
    return this.service.getLrMonthlyRevision(params)
  }

  @Post('data-to-model')
  @ApiBearerAuth()
  // async getDataToModel(@Query('year') year, @Query('month') month, @Query('version') version, @Query('isWithOutDemandAI') isWithOutDemandAI) {
  async getDataToModel(@Body() optimizationCondition: any) {
    const optimizeCondition = optimizationCondition;

    let month = optimizeCondition?.month;
    let year = optimizeCondition?.year;
    let version = optimizeCondition?.version;

    // abilitiy
    const abilitiyRayongVersion = await this.abilityPlanRayongService.getVersionById({ versionId: optimizeCondition?.abilities?.rayong });

    const abilitiyPentaneVersion = await this.abilityPentaneService.getVersionById({ versionId: optimizeCondition?.abilities?.pentane });

    const abilitiyKhmVersion = await this.abilityPlanKhmService.getVersionById({ versionId: optimizeCondition?.abilities?.khm });

    const abilitiyRefineryVersion = await this.abilityRefineryService.getVersionById({ versionId: optimizeCondition?.abilities?.refinery });

    // cal mrgin
    const calMrginVersion = await this.calMarginService.getVersionById({ versionId: optimizeCondition?.calMrgin });

    // constrain
    const tankCapVersion = await this.tankCapService.getVersionById({ versionId: optimizeCondition?.constrain?.tankCap });

    const lrByLegalVersion = await this.lrByLegalService.getVersionById({ versionId: optimizeCondition?.constrain?.lrByLegal });

    const depotConstrainVersion = await this.depotManagementMeterService.getVersionById({ versionId: optimizeCondition?.constrain?.depotConstrain });

    const volumeConstrainVersion = await this.volumeConstrainService.getVersionById({ versionId: optimizeCondition?.constrain?.volumeConstrain });

    let tiers: any = [
      {
        code: 90,
        name: 'Pentane Tier1 - ROC',
        value: 1

      },
      {
        code: 91,
        name: 'Pentane Tier2 - ROC',
        value: 2

      },
      {
        code: 92,
        name: 'Pentane Tier3 - ROC',
        value: 3
      }
    ];
    let tiersPantane: any = [
      {
        "product": "Pentane",
        "src": "GSP6",
        "type": "SCG Tier1",
        tier: 1,
        id: 'pentane_1'
      },
      {
        "product": "Pentane",
        "src": "GSP6",
        "type": "SCG Tier2",
        tier: 2,
        id: 'pentane_2'

      },
      {
        "product": "Pentane",
        "src": "GSP6",
        "type": "SCG Tier3",
        tier: 3,
        id: 'pentane_3'
      }
    ];
    let dataSend: any = {};
    let listMonth: any = [];
    let arrProduct: any = [];
    let arrMonthlyConstrain: any = [];
    let arrMargin: any = [];
    let arrYearlyContract: any = [];
    let arrTank: any = [];
    let arrDepot: any = [];
    let arrAbilitysMonthly: any = [];
    let arrAbilitysDaily: any = [];
    let arrFixOptimizeVariable: any = [];
    let arrMarginsPredict: any = [];
    let data: any = {};
    let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
    dateStart = dateStart.add(1, 'M');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    let arrDate: any = [];
    for (let index = 1; index < 13; index++) {
      const data: any = {
        Year: yearStart,
        Month: monthStart + 1,
        MonthName: dateStart.format('yyyy-MM'),
        visible: true,
        index: index
      }
      data.day = [];

      data.date = [];
      let date = moment(dateStart);
      for (let day = 1; day <= dateStart.daysInMonth(); day++) {
        data.day.push(day);
        date = moment(dateStart.format('yyyy-MM-') + _.padStart(day, 2, '0'));
        data.date.push(date);
      }
      arrDate.push(dateStart.format('yyyy-MM'))
      listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    const produuct = await this.masterProductsService.getList();
    const marginData = await this.calMarginService.getByVersion(
      _.toNumber(calMrginVersion.month),
      _.toNumber(calMrginVersion.year),
      _.toNumber(calMrginVersion.version)
    ); //Cal margin
    // return marginData;
    // const marginPerUnit = await this.marginPerUnitsService.getList(year);

    const masterContract = await this.masterContractService.getListToModel(year);//Cal margin(Year)

    const masterContractOfSale = await this.masterContractService.getGen(_.toInteger(month), _.toInteger(year));
    const masterTankCapData = await this.masterTankCapService.getList({});

    const tankCapDataList = await this.tankCapService.getListToModel({
      year: _.toNumber(tankCapVersion?.year),
      month: _.toNumber(tankCapVersion?.month),
      version: _.toNumber(tankCapVersion?.version)
    }); //Tank Cap.

    const masterDepot = await this.masterDepotService.getList();
    const depotDataList = await this.depotManagementMeterService.getListToModel({
      year: _.toNumber(depotConstrainVersion?.year),
      month: _.toNumber(depotConstrainVersion?.month),
      version: _.toNumber(depotConstrainVersion?.version)
    }); //Depot Constrain
    const volumeConstrainDataList = await this.volumeConstrainService.getListCstrains({
      year: _.toNumber(volumeConstrainVersion?.year),
      month: _.toNumber(volumeConstrainVersion?.month),
      version: _.toNumber(volumeConstrainVersion?.version)
    }); //Volume Constrain
    const masterAbilityPlanRayong = await this.abilityPlanRayongService.getMaster();
    const AbilityMonthly = await this.abilityPlanRayongService.getList({
      year: _.toNumber(abilitiyRayongVersion?.year),
      month: _.toNumber(abilitiyRayongVersion?.month),
      version: _.toNumber(abilitiyRayongVersion?.version)
    }); //Ability Rayong(New)
    const AbilityMonthlyDaily = await this.abilityPlanRayongService.getDaily({
      year: _.toNumber(abilitiyRayongVersion?.year),
      month: _.toNumber(abilitiyRayongVersion?.month),
      version: _.toNumber(abilitiyRayongVersion?.version)
    }); //Ability Rayong(New)


    const abilityPantaneDataList = await this.abilityPentaneService.getListToModel({
      year: _.toNumber(abilitiyPentaneVersion?.year),
      month: _.toNumber(abilitiyPentaneVersion?.month),
      version: _.toNumber(abilitiyPentaneVersion?.version)
    }); //Ability Pentane
    const masterAbilityPlanKhm = await this.abilityPlanKhmService.getMaster();
    const abilityKhmDataList = await this.abilityPlanKhmService.getListToModel({
      year: _.toNumber(abilitiyKhmVersion?.year),
      month: _.toNumber(abilitiyKhmVersion?.month),
      version: _.toNumber(abilitiyKhmVersion?.version)
    }); //Ability Khm

    const masterSuppliers = await this.masterSupplierService.getList({});
    const abilityRefineryDataList = await this.abilityRefineryService.getListToModel({
      year: _.toNumber(abilitiyRefineryVersion?.year),
      month: _.toNumber(abilitiyRefineryVersion?.month),
      version: _.toNumber(abilitiyRefineryVersion?.version)
    }); //Ability โรงกลั่น



    const lrByLegalDataList = await this.lrByLegalService.getListToModel({
      year: _.toNumber(lrByLegalVersion?.year),
      month: _.toNumber(lrByLegalVersion?.month),
      version: _.toNumber(lrByLegalVersion?.version)
    }); //Ability โรงกลั่น
    _.each(produuct, (item, index) => {
      if (item.modelId) {
        arrProduct.push({ id: _.toString(item.modelId), tank_id: item.tankCapModelId ? _.toString(item.tankCapModelId) : '', product: item.productCode });
      }
    });

    _.each(masterTankCapData, (item) => {
      if (item.modelId) {
        data = {};
        data.id = _.toString(item.modelId)
        data.key = { product: item.productionPlant, type: item.tankCapType };
        data.remain_inventory = 0; //null ไปก่อน
        data.cross = [];
        data.sub_tank_id = [];
        if (item.tankCapType === 'tank') {
          const dataSub = _.filter(masterTankCapData, (itemSub) => {
            return itemSub.productionPlant === item.productionPlant && itemSub.tankCapType !== 'tank' && itemSub.tankCapType !== ''
          });
          data.sub_tank_id = _.map(dataSub, (itemTank) => {
            return _.toString(itemTank.modelId)
          });
        }
        const dataTankCap = _.filter(tankCapDataList, (itemData) => {
          return itemData.modelId === item.modelId
        });
        data.date = arrDate;
        data.capacity = [];
        data.min = [];
        data.max = [];

        _.each(listMonth, (itemMonth) => {
          const dataFilter = _.find(dataTankCap, (itemData) => {
            return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
          })
          if (dataFilter) {
            data.capacity.push(dataFilter.capacity);
            data.min.push(dataFilter.value * 0.5 / 1000);//ส่งไปที่ 50% ของ value
            data.max.push(dataFilter.value * 0.85 / 1000);//ส่งไปที่ 85% ของ value
          } else {
            if (data.capacity.length > 0) {
              data.capacity.push(data.capacity[data.capacity.length - 1]);
            }
            if (data.min.length > 0) {
              data.min.push(data.min[data.min.length - 1]);
            }
            if (data.max.length > 0) {
              data.max.push(data.max[data.max.length - 1]);
            }
          }
        })
        arrTank.push(data);
      }
    });

    _.each(masterDepot, (item) => {
      if (item.modelId) {
        data = {};
        data.id = item.modelId
        data.key = { product: item.product, depots: item.depots };

        const depotData = _.filter(depotDataList, (itemData) => {
          return itemData.modelId === item.modelId
        });
        data.date = arrDate;
        data.min = [];
        data.max = [];

        _.each(listMonth, (itemMonth) => {
          const dataFilter = _.find(depotData, (itemData) => {
            return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
          })
          if (dataFilter) {
            data.min.push(dataFilter.min);
            data.max.push(dataFilter.max);
          } else {
            if (data.min.length > 0) {
              data.min.push(data.min[data.min.length - 1]);
            }
            if (data.max.length > 0) {
              data.max.push(data.max[data.max.length - 1]);
            }
          }
        })
        arrDepot.push(data);
      }
    });
    //ติดเรื่อง sub ไว้ก่อน
    // const masterContractOfSaleRef = _.filter(masterContractOfSale, (item) => {
    //   return item.substituedProductId;
    // })
    // const masterContractBetween = _.filter(masterContract, (item) => {
    //   return moment(year + '-01-01').isBetween(moment(item.startContractDate).format('YYYY-MM-DD'), moment(item.endContractDate).format('YYYY-MM-DD'), 'year', '[]');
    // })
    _.each(masterContract, (item, index) => {
      data = {};
      data.id = item.contractNumber;
      data.key = { product: item.productName, customer: item.customerName };
      data.start_contract = moment(item.startContractDate).format('YYYY-MM-DD');
      data.ending_contract = moment(item.endContractDate).format('YYYY-MM-DD');
      data.volume_actual = item.totalActualVolumn;
      data.min = item.minVolumn ? item.minVolumn / 1000 : null;
      data.max = item.maxVolumn ? item.maxVolumn / 1000 : null;
      data.contract_relation_id = null;
      // if (masterContractOfSale) {

      // }
      arrYearlyContract.push(data);

    });
    const contractDistinct = _.unionBy(masterContractOfSale, (item) => [item.productName, item.sourceName, item.demandName, item.deliveryName].join())
    _.each(contractDistinct, (item) => {
      data = {};
      data.id = item.contractConditionOfSaleId
      data.key = { product: item.productName, contract: item.contractNumber, source: item.sourceName, demand: item.demandName, delivery_point: item.deliveryName };

      const volumeConstrain = _.filter(volumeConstrainDataList, (itemData) => {
        return itemData.contractConditionOfSaleId === item.contractConditionOfSaleId
      });
      data.date = arrDate;
      data.min = [];
      data.max = [];

      _.each(listMonth, (itemMonth, index) => {
        const dataFilter = _.find(volumeConstrain, (itemData) => {
          return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
        })
        if (dataFilter) {
          data.min.push(dataFilter.min);
          data.max.push(dataFilter.max);
        } else {
          if (index === 0 && data.min.length === 0) {
            data.min.push(null);
            data.max.push(null);
          } else if (data.min.length > 0) {
            data.min.push(data.min[data.min.length - 1]);
            data.max.push(data.max[data.max.length - 1]);
          }
        }
      })
      if (data.min.length === 0) {
        data.min = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        data.max = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      arrMonthlyConstrain.push(data);

    });

    _.each(masterAbilityPlanRayong, (item) => {
      data = {};
      data.id = item.id;
      let src = item.productionPlant;
      switch (item.productionPlant) {
        case 'GSP1':
          src = 'GSP I'
          break;
        case 'GSP2':
          src = 'GSP II'
          break;
        case 'GSP3':
          src = 'GSP III'
          break;
        case 'GSP5':
          src = 'GSP V'
          break;
        case 'GSP6':
          src = 'GSP VI'
          break;
        case 'GSP6(Butane)':
          src = 'GSP VI'
          break;

        default:
          break;
      }
      data.key = { product: item.product, src: src, type: 'GSP RY' };
      const product = _.find(arrProduct, (itemProduct) => {
        return item.product === itemProduct.product;
      })

      const volumeConstrain = _.filter(AbilityMonthly, (itemData) => {
        return _.toUpper(itemData.product) === _.toUpper(item.product) && _.toUpper(itemData.productionPlant) === _.toUpper(item.productionPlant)
      });
      data.date = arrDate;
      data.volume = [];
      _.each(listMonth, (itemMonth, index) => {
        const dataFilter = _.find(volumeConstrain, (itemData) => {
          return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
        })
        if (dataFilter) {
          data.volume.push(dataFilter.value);
        } else {
          if (index === 0 && data.volume.length === 0) {
            data.volume.push(0);
          } else if (data.volume.length > 0) {
            data.volume.push(data.volume[data.volume.length - 1]);
          }
        }
      })
      if (data.volume.length === 0) {
        data.volume = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      if (product) {
        data.product_id = product.id;
        if (src === 'GSP I' || src === 'GSP II' || src === 'GSP III' || src === 'GSP V' || src === 'GSP VI' || src === 'Stab' || src === 'ESP') {
          arrAbilitysMonthly.push(data);
        }

      }

    });
    let product = _.find(arrProduct, (itemProduct) => {
      return 'Pentane' === itemProduct.product;
    })
    const contractPentane = _.filter(contractDistinct, (item) => {
      return item.productName === 'Pentane'
    })

    _.each(tiersPantane, (itemTier) => {
      data = {};
      data.id = itemTier.id;
      const pentane = _.find(contractPentane, (item) => {
        return item.tierNo === itemTier.tier;
      })
      data.key = { product: itemTier.product, src: itemTier.src, type: pentane ? pentane.demandName : itemTier.type };


      data.date = arrDate;
      data.volume = [];
      _.each(listMonth, (itemMonth) => {

        const dataFilter = _.find(abilityPantaneDataList, (itemData) => {
          return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month && itemTier.tier === _.toInteger(itemData.tierCode);
        })
        if (dataFilter) {
          data.volume.push(dataFilter.value);
        } else {

          data.volume.push(0);
        }
      })
      if (product) {
        data.product_id = product.id;
        arrAbilitysMonthly.push(data);
      }
    })
    _.each(masterAbilityPlanKhm, (item) => {
      data = {};
      data.id = item.id;
      data.key = { product: item.product, src: 'GSP KHM', type: 'GSP KHM' };
      const product = _.find(arrProduct, (itemProduct) => {
        return item.product === itemProduct.product;
      })


      data.date = arrDate;
      data.volume = [];
      _.each(listMonth, (itemMonth) => {
        const dataFilter = _.find(abilityKhmDataList, (itemData) => {
          return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month && _.toUpper(itemData.product) === _.toUpper(item.product);
        })
        if (dataFilter) {
          data.volume.push(dataFilter.value);
        } else {
          if (data.volume.length > 0) {
            data.volume.push(data.volume[data.volume.length - 1]);
          }
        }
      })
      if (product) {
        data.product_id = product.id;
        arrAbilitysMonthly.push(data);
      }


    });

    product = _.find(arrProduct, (itemProduct) => {
      return 'LPG' === itemProduct.product;
    })
    _.each(masterSuppliers, (item) => {
      data = {};
      data.id = item.id;
      let src = item.code;
      data.key = { product: 'LPG', src: src, type: src };
      if (product) {
        data.product_id = product.id;
      }

      data.date = arrDate;
      data.volume = [];
      _.each(listMonth, (itemMonth) => {
        const dataFilter = _.find(abilityRefineryDataList, (itemData) => {
          return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month && _.toUpper(itemData.supplier) === _.toUpper(item.fullName);
        })
        if (dataFilter) {
          data.volume.push(dataFilter.value);
        } else {
          if (data.volume.length > 0) {
            data.volume.push(data.volume[data.volume.length - 1]);
          }
        }
      })
      if (product) {
        data.product_id = product.id;
        arrAbilitysMonthly.push(data);
      }


    });
    product = _.find(arrProduct, (itemProduct) => {
      return 'CO2' === itemProduct.product;
    })
    let objAbilitysMonthly: any = {};
    objAbilitysMonthly.id = '1A2A0354-EB26-EC11-AB4E-005056B2E9E9';
    objAbilitysMonthly.key = { product: 'CO2', src: 'CO2', type: '' };
    if (product) {
      objAbilitysMonthly.product_id = product.id;
    }

    objAbilitysMonthly.date = arrDate;
    const dataCO2 = _.filter(arrMonthlyConstrain, (item) => {
      return _.toUpper(item.key.product) === 'CO2';
    })
    objAbilitysMonthly.volume = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    _.each(dataCO2, (item) => {
      for (let index = 0; index < item.max.length; index++) {
        objAbilitysMonthly.volume[index] += item.max[index];
      }
    })

    arrAbilitysMonthly.push(objAbilitysMonthly);
    //const contractConditionOfSaleDistinct = _.unionBy(masterContractOfSale, 'contractConditionOfSaleId')
    _.each(contractDistinct, (item) => {
      data = {};
      data.id = item.contractConditionOfSaleId;
      data.month_constrain_id = item.contractConditionOfSaleId;
      data.year_contract_id = item.contractNumber;
      data.key = { product: item.productName, source: item.sourceName, demand: item.demandName, delivery_point: item.deliveryName, product_type: item.productGradeCode ? item.productGradeCode : (item.productName === 'LPG' ? 'petro' : '') };//product_type ติไว้ก่อน  C3 Import Reversed Pipeline ให้ส่ง reversed, C3 Import Split Cargo ให้ส่ง splitcargo
      if (item.tierNo) {
        data.tier = {
          "number": item.tierNo,
          "group": item.contractNumber + '_' + item.productName + '_' + item.sourceName + '_' + item.deliveryName,
          "max": item.maxVolumeTier ? item.maxVolumeTier : 2147483647,
          "min": item.minVolumeTier ? item.minVolumeTier : 0,
          "volume_actual": item.totalActualVolumn ? item.totalActualVolumn : 0
        };
      } else {
        data.tier = null
      }
      //item.tierNo;//ส่ง null ไปก่อน
      data.supplement = {};//ติไวเ้ถามตัดทิ้ง ไม่ต้องส่งค่าไปแล้ว
      data.depots_id = null;
      const product = _.find(arrProduct, (itemProduct) => {
        return item.productName === itemProduct.product;
      })
      if (product) {
        data.product_id = product.id;
      }
      const dataList = _.filter(marginData, (itemData) => {
        return itemData.contractConditionOfSaleId === item.contractConditionOfSaleId
      });
      data.date = arrDate;
      data.margin = [];

      _.each(listMonth, (itemMonth) => {
        const dataFilter = _.find(dataList, (itemData) => {
          return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
        })
        if (dataFilter) {
          const margin = dataFilter.sellingPriceValue - dataFilter.fullCostValue;
          if (margin > -9999999 && margin < 9999999) {//ตรวจสอบกรณีค่าเป็น NuN และ Infitity มันเซ็ค isNumber ไมไ่ด้
            data.margin.push(margin ? margin : 0);
          }
          else {
            if (data.margin.length > 0) {
              data.margin.push(data.margin[data.margin.length - 1]);
            }
          }
        } else {
          if (data.margin.length > 0) {
            data.margin.push(data.margin[data.margin.length - 1]);
          }
        }
      })
      if (data.product_id) {
        arrMargin.push(data);
      }


    });

    const dataDayLowCO2 = _.filter(AbilityMonthlyDaily, (itemDayily) => {
      return itemDayily.product === 'Ethane' && itemDayily.productionPlant === 'low CO2';
    });
    const dataDayHighCO2 = _.filter(AbilityMonthlyDaily, (itemDayily) => {
      return itemDayily.product === 'Ethane' && itemDayily.productionPlant === 'High CO2';
    });
    const dataDayGSP6 = _.filter(AbilityMonthlyDaily, (itemDayily) => {
      return itemDayily.product === 'Ethane' && itemDayily.productionPlant === 'GSP6';
    });
    //จำลอง
    const daily = {};
    const daily6 = {};
    _.each(listMonth, (item, index) => {
      if (index < 3) {
        const volumn = [];
        const volumn6 = [];
        _.each(item.date, (itemDay) => {
          const dayLowCO2 = _.find(dataDayLowCO2, (item) => {
            return moment(itemDay).format('YYYY-MM-DD') === moment(item.date).format('YYYY-MM-DD')
          })
          const dayHighCO2 = _.find(dataDayHighCO2, (item) => {
            return moment(itemDay).format('YYYY-MM-DD') === moment(item.date).format('YYYY-MM-DD')
          })
          const dayDay6 = _.find(dataDayGSP6, (item) => {
            return moment(itemDay).format('YYYY-MM-DD') === moment(item.date).format('YYYY-MM-DD')
          })
          if (dayLowCO2 && dayHighCO2) {
            volumn.push((dayLowCO2.value + dayHighCO2.value) / 1000);

          } else {
            volumn.push(0);
          }
          if (dayDay6) {
            volumn6.push(dayDay6.value / 1000);
          } else {
            volumn6.push(0);
          }
        })
        daily[item.MonthName] = { day: item.day, volume: volumn };
        daily6[item.MonthName] = { day: item.day, volume: volumn6 };
      }

    })

    const dataMargin = _.map(arrMargin, 'product_id');
    const dataProduct = _.filter(arrProduct, (item) => {
      return _.includes(dataMargin, item.id);
    })
    const dataContractNumber = _.map(arrMargin, 'year_contract_id');
    const dataYear = _.filter(arrYearlyContract, (item) => {
      return _.includes(dataContractNumber, item.id);
    })

    dataSend.products = dataProduct;
    dataSend.tanks = arrTank;
    dataSend.depot_constrain = arrDepot;
    dataSend.yearly_contracts = dataYear;
    dataSend.monthly_constrains = arrMonthlyConstrain;
    dataSend.abilitys_monthly = arrAbilitysMonthly;
    dataSend.margins = arrMargin;
    dataSend.margins_predict = [];//ไม่จำเป็นต้องส่งไป
    dataSend.fix_volume_month = [
      {
        "id": "5639312F-33E4-4ADA-8B5B-57C12DBC5611",
        "date": arrDate,
        "volume": [
          11.16,
          11.16,
          10.8,
          11.16,
          10.8,
          11.16,
          11.16,
          10.08,
          11.16,
          10.8,
          11.16,
          10.8
        ],
        "product_id": 1
      },
    ];
    dataSend.addition = {};

    let dataLowC2 = _.filter(AbilityMonthly, (item) => {
      return item.productionPlant === 'Low CO2'
    })
    let volumeLowC2 = [];
    _.each(listMonth, (itemMonth, index) => {
      const dataFilter = _.find(dataLowC2, (itemData) => {
        return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
      })
      if (dataFilter) {
        volumeLowC2.push(dataFilter.value);
      } else {
        if (index === 0 && volumeLowC2.length === 0) {
          volumeLowC2.push(0);
        } else if (volumeLowC2.length > 0) {
          volumeLowC2.push(volumeLowC2[volumeLowC2.length - 1]);
        }
      }
    })
    if (volumeLowC2.length === 0) {
      volumeLowC2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    const dataC2SCG = _.find(masterContractOfSale, (item) => {
      return _.toUpper(item.productName) === 'C2' && _.toUpper(item.customerName) === 'SCG' && _.toUpper(item.conditionsOfSaleName) === 'SUBSITITUE' && item.substituedRate
    });
    let volumnC2SCG: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (dataC2SCG) {
      volumnC2SCG = [];
      _.each(arrDate, (item) => {
        volumnC2SCG.push(dataC2SCG.substituedRate)
      })
    }
    const dataShip = _.filter(contractDistinct, (item) => {
      return item.productName === 'NGL' && item.deliveryName !== 'GSP RY'
    })

    let arrShip = [];
    _.each(dataShip, (item) => {
      data = {};
      data.id = item.contractConditionOfSaleId;
      data.key = { product: item.productName, source: item.sourceName, demand: item.demandName, delivery_point: item.deliveryName };
      data.volume = [];
      data.year = _.unionBy(_.map(listMonth, 'Year'))
      _.each(data.year, (itemYear) => {
        data.volume.push(null);
      })
      arrShip.push(data);

    })
    const dataNGLShipment = _.filter(abilityKhmDataList, (item) => {
      return item.product === 'NGL Shipment'
    })

    let arrNGLShipment = [1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9];
    // _.each(listMonth, (itemMonth, index) => {
    //   const dataFilter = _.find(dataNGLShipment, (itemData) => {
    //     return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
    //   })
    //   if (dataFilter) {
    //     arrNGLShipment.push(dataFilter.value * 1.9);
    //   } else {
    //     if (index === 0 && arrNGLShipment.length === 0) {
    //       arrNGLShipment.push(0);
    //     } else if (arrNGLShipment.length > 0) {
    //       arrNGLShipment.push(arrNGLShipment[arrNGLShipment.length - 1]);
    //     }
    //   }
    // })

    dataSend.addition = {
      "c2": {
        "c2_low": {
          "date": arrDate,
          "volume": volumeLowC2,
          "daily": daily
        },
        "gsp6": {
          "daily": daily6
        }
      },
      "c3/lpg": {
        "allocate_c2scg": {
          "date": arrDate,
          "volume": volumnC2SCG
        },

      },
      "ngl": {
        "ship_capacity": {
          "date": arrDate,
          "volume": arrNGLShipment
        },
        "ship_delivery": arrShip
      }
    }
    const dataLR = _.filter(lrByLegalDataList, (item) => {
      return item.source === 'LR by Internal Control';
    })
    dataSend.addition['c3/lpg'].lr_by_internal_control = {};
    dataSend.addition['c3/lpg'].lr_by_internal_control.date = arrDate;
    dataSend.addition['c3/lpg'].lr_by_internal_control.volume = [];
    _.each(listMonth, (itemMonth) => {

      const dataFilter = _.find(dataLR, (itemData) => {
        return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
      })
      if (dataFilter) {
        dataSend.addition['c3/lpg'].lr_by_internal_control.volume.push(dataFilter.value);
      } else {
        if (dataSend.addition['c3/lpg'].lr_by_internal_control.volume.length > 0) {
          dataSend.addition['c3/lpg'].lr_by_internal_control.volume.push(dataSend.addition['c3/lpg'].lr_by_internal_control.volume[dataSend.addition['c3/lpg'].lr_by_internal_control.volume.length - 1]);
        }
      }
    })

    let dataLPGPetro = _.filter(AbilityMonthly, (item) => {
      return item.productionPlant === 'LPG-Petro'
    })

    let volumeLPGPetro = [];
    _.each(listMonth, (itemMonth, index) => {
      const dataFilter = _.find(dataLPGPetro, (itemData) => {
        return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
      })
      if (dataFilter) {
        volumeLPGPetro.push(dataFilter.value);
      } else {
        if (index === 0 && volumeLPGPetro.length === 0) {
          volumeLPGPetro.push(0);
        } else if (volumeLPGPetro.length > 0) {
          volumeLPGPetro.push(volumeLPGPetro[volumeLPGPetro.length - 1]);
        }
      }
    })
    if (volumeLPGPetro.length === 0) {
      volumeLPGPetro = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    dataSend.addition['c3/lpg'].lpg_gsp_petro_ability = {};
    dataSend.addition['c3/lpg'].lpg_gsp_petro_ability.date = arrDate;
    dataSend.addition['c3/lpg'].lpg_gsp_petro_ability.volume = volumeLPGPetro;

    let dataLPGDomestic = _.filter(AbilityMonthly, (item) => {
      return item.productionPlant === 'LPG-Domestic'
    })
    let volumeLPGDomestic = [];
    _.each(listMonth, (itemMonth, index) => {
      const dataFilter = _.find(dataLPGDomestic, (itemData) => {
        return itemData.yearValue === itemMonth.Year && itemData.monthValue === itemMonth.Month;
      })
      if (dataFilter) {
        volumeLPGDomestic.push(dataFilter.value);
      } else {
        if (index === 0 && volumeLPGDomestic.length === 0) {
          volumeLPGDomestic.push(0);
        } else if (volumeLPGDomestic.length > 0) {
          volumeLPGDomestic.push(volumeLPGDomestic[volumeLPGDomestic.length - 1]);
        }
      }
    })
    if (volumeLPGDomestic.length === 0) {
      volumeLPGDomestic = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    dataSend.addition['c3/lpg'].lpg_gsp_dom_ability = {};
    dataSend.addition['c3/lpg'].lpg_gsp_dom_ability.date = arrDate;
    dataSend.addition['c3/lpg'].lpg_gsp_dom_ability.volume = volumeLPGDomestic;
    const fileName = 'optimizations_' + year + '_' + month + '_' + version + '_' + moment().format('YYYY_MM_DD_h_mm_ss') + '.txt'
    dataSend.fileName = fileName;
    this.createFile('./file', fileName, dataSend)
    return dataSend;

    //allocate_c2scg ฟิวจากสัญญา
    //cross_c3_lpg จาก Cross to LPG (normal cross C3 to aerosol 1,000 Ton/เดือน) ทำที่ Front
    //cross_dom  จาก LPG Petro Cross to LPG Dom ทำที่ Front
    //wait_sell รอจำหน่าย ทำที่ Front
    //unknow_untax ดึง Unknow untax ทำที่ Front
    //lr_by_internal_control  LR by Internal Control  ทำที่ Front
    //brp_ending_inventory  Closing stock @GSP+MT+BRP (LR) ทำที่ Front
    //mt_sphere_end_inventory MT-Sphere Ending Inventory ทำที่ Front
    //mt_c3_end_inventory MT-C3 Refig Ending Inventory ทำที่ Front
    //ship_capacity ฟิกค่า 1.9
    //ship_delivery ฟิก 1 ลำ ดึงสัญญาของ NGL ทั้งหมด เฉพาะ Export 1 ลำ ที่เหลิอ NULL

  }

  checkIfFileOrDirectoryExists(path: string) {
    return fs.existsSync(path);
  };
  async createFile(
    path: string,
    fileName: string,
    data: string,
  ) {
    if (!this.checkIfFileOrDirectoryExists(path)) {
      fs.mkdirSync(path);
    }

    const writeFile = promisify(fs.writeFile);
    return writeFile(`${path}/${fileName}`, JSON.stringify(data), 'utf8');
  };

  @Get('actual')
  getActual(@Query('year') year) {
    const params = { year: year }
    return this.service.getActual(params)
  }
  @Get('download-file')
  download(@Res() res, @Query('fileName') fileName) {

    return res.download('./file/' + fileName);
  }
}
