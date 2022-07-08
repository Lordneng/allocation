import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';
import {
  Contract,
  ContractConditionOfSale,
  ContractCustomerPlant,
  ContractCustomerProductGrade,
  MasterContract,
  ContractRunningNumber
} from './entity'
import { getConnection, Raw, Repository } from 'typeorm'
import { TOKENS } from '../../constants'
import { ContractCreateDto } from './dto/contractCreateDto';
import { ContractUpdateDto } from './dto/contractUpdateDto';
import moment from 'moment';
import console from 'console';

@Injectable()
export class MasterContractService {

  constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterContract>,
    @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly contractModel: Repository<Contract>,
    @Inject(TOKENS.ProjectRepositoryTokenForm) private readonly plantModel: Repository<ContractCustomerPlant>,
    @Inject(TOKENS.ProjectRepositoryTokenFormHistory) private readonly productGradeModel: Repository<ContractCustomerProductGrade>,
    @Inject(TOKENS.ProjectRepositoryTokenHistory) private readonly conditionModel: Repository<ContractConditionOfSale>,
    @Inject(TOKENS.ProjectRepositoryTokenImport) private readonly runningModel: Repository<ContractRunningNumber>
  ) {

  }

  async getList(params: any): Promise<any> {
    const condition: any = {}

    if (params.year) {
      condition['startContractDate'] = Raw((alias) => `Year(${alias}) <= ${params.year}`);
      condition['endContractDate'] = Raw((alias) => `Year(${alias}) >= ${params.year}`);
    }

    if (params.customerId) {
      condition['customerId'] = params.customerId;
    }

    if (params.productId) {
      condition['productId'] = params.productId;
    }
    return await this.contractModel.find({ where: condition, order: { rowOrder: 'ASC' } });;
  }

  async getById(id: any): Promise<any> {
    return await this.contractModel.findOne({ where: { id: id } });
  }

  async getCustomerPlantList(id: any): Promise<any> {
    return await this.plantModel.find({ where: { contractId: id }, order: { rowOrder: 'ASC' } });;
  }

  async getCustomerProductGradeList(id: any): Promise<any> {
    return await this.productGradeModel.find({ where: { contractId: id }, order: { rowOrder: 'ASC' } });;
  }

  async getCustomerConditionOfSaleList(id: any): Promise<any> {
    return await this.conditionModel.find({ where: { contractId: id }, order: { rowOrder: 'ASC' } });;
  }

  async getGen(month: number, year: number) {

    let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(11, 'M');

    return await this.listData(dateStart, dateEnd);
  }

  async getGenM7(month: number, year: number) {

    let dateRequest = moment(year + '-' + _.padStart(month, 2, '0') + '-01');

    return await this.listGenM7(dateRequest);
  }

  async listData(dateStart, dateEnd): Promise<any> {
    const dataList: any = [];
    const startDateText = moment(dateStart).format('YYYY-MM-DD');
    const endDateText = moment(dateEnd).format('YYYY-MM-DD');

    const data = await this.dataModel.query("exec SP_CONTRACT_GEN @0, @1", [startDateText, endDateText])

    if (data && data.length > 0) {
      data.forEach(item => { dataList.push(item); })
    }

    return dataList;
  }


  async listGenM7(dateRequest): Promise<any> {
    const dataList: any = [];
    const requestDateText = moment(dateRequest).format('YYYY-MM-DD');

    const data = await this.dataModel.query("exec SP_CONTRACT_GEN_M7 @0", [requestDateText])

    if (data && data.length > 0) {
      data.forEach(item => { dataList.push(item); })
    }

    return dataList;
  }
  async listCalMarginData(): Promise<any> {
    const dataList: any = [];
    const requestDateText = moment().format('YYYY-MM-DD');
    
    const data = await this.dataModel.query("exec SP_CONTRACT_GEN_MONTH @0", [requestDateText])

    if (data && data.length > 0) {
      data.forEach(item => { dataList.push(item); })
    }

    return dataList;
  }

  async create(data: ContractCreateDto) {
    await getConnection().transaction(async transactionalEntityManager => {

      const contract = new Contract();
      Object.assign(contract, data);
      contract.contractNumber = await this.generateContractNumber(contract.customerId, contract.productId);

      await transactionalEntityManager.save(contract);

      const plants: ContractCustomerPlant[] = [];

      for (const plant of data.customerPlants) {
        const contractCustomerPlant = new ContractCustomerPlant();

        Object.assign(contractCustomerPlant, plant);

        contractCustomerPlant.contractId = contract.id.toString();

        plants.push(contractCustomerPlant);
      }

      await transactionalEntityManager.save(plants);

      const conditions: ContractConditionOfSale[] = []

      for (const condition of data.customerConditions) {
        const contractCondition = new ContractConditionOfSale();

        Object.assign(contractCondition, condition);

        condition.contractId = contract.id.toString();

        conditions.push(contractCondition);
      }

      await transactionalEntityManager.save(conditions);

      const productGrades: ContractCustomerProductGrade[] = [];

      for (const grade of data.customerProductGrades) {
        const productGrade = new ContractCustomerProductGrade();

        Object.assign(productGrade, grade);

        productGrade.contractId = contract.id.toString();

        productGrades.push(productGrade);
      }

      await transactionalEntityManager.save(productGrades);
    });
  }

  async update(data: ContractUpdateDto) {
    await getConnection().transaction(async transactionalEntityManager => {

      const contract = await transactionalEntityManager.findOne(Contract, { where: { id: data.id } });;

      contract.name = data.name;
      contract.code = data.code;
      contract.shortName = data.shortName;
      contract.contractNumber = data.contractNumber;
      contract.contractTypeId = data.contractTypeId;
      contract.contractTypeName = data.contractTypeName;
      contract.startContractDate = data.startContractDate;
      contract.endContractDate = data.endContractDate;
      contract.productId = data.productId;
      contract.productName = data.productName;
      contract.minVolumn = data.minVolumn;
      contract.maxVolumn = data.maxVolumn;
      contract.isMinVolumnNoLimit = data.isMinVolumnNoLimit;
      contract.isMaxVolumnNoLimit = data.isMaxVolumnNoLimit;
      contract.unitId = data.unitId;
      contract.unitName = data.unitName;
      contract.customerId = data.customerId;
      contract.customerName = data.customerName;
      contract.totalActualVolumn = data.totalActualVolumn;
      contract.totalForecastVolumn = data.totalForecastVolumn;
      contract.updateBy = data.updateBy;
      contract.updateByUserId = data.updateByUserId;
      contract.updateDate = new Date();

      await transactionalEntityManager.save(contract);

      await transactionalEntityManager.delete(ContractCustomerPlant, { contractId: contract.id });

      const plants: ContractCustomerPlant[] = [];

      for (const plant of data.customerPlants) {
        const contractCustomerPlant = new ContractCustomerPlant();

        Object.assign(contractCustomerPlant, plant);

        contractCustomerPlant.contractId = contract.id.toString();

        plants.push(contractCustomerPlant);
      }

      await transactionalEntityManager.save(plants);

      await transactionalEntityManager.delete(ContractConditionOfSale, { contractId: contract.id });

      const conditions: ContractConditionOfSale[] = []

      for (const condition of data.customerConditions) {
        const contractCondition = new ContractConditionOfSale();

        Object.assign(contractCondition, condition);

        condition.contractId = contract.id.toString();

        conditions.push(contractCondition);
      }

      await transactionalEntityManager.save(conditions);

      await transactionalEntityManager.delete(ContractCustomerProductGrade, { contractId: contract.id });

      const productGrades: ContractCustomerProductGrade[] = [];

      for (const grade of data.customerProductGrades) {
        const productGrade = new ContractCustomerProductGrade();

        Object.assign(productGrade, grade);

        productGrade.contractId = contract.id.toString();

        productGrades.push(productGrade);
      }

      await transactionalEntityManager.save(productGrades);
    });
  }

  async delete(id: any) {
    await getConnection().transaction(async transactionalEntityManager => {

      await transactionalEntityManager.delete(Contract, { id: id });

      await transactionalEntityManager.delete(ContractCustomerPlant, { contractId: id });

      await transactionalEntityManager.delete(ContractCustomerProductGrade, { contractId: id });

      await transactionalEntityManager.delete(ContractConditionOfSale, { contractId: id });
    })
  }

  async generateContractNumber(customerId: any, productId: any) {
    // (customerId)
    // (productId)

    const sqlCustomer = `SELECT code as customerCode FROM master_customer 
      WHERE id = @0`;

    const sqlProduct = `SELECT productCode FROM master_product 
      WHERE id = @0`;

    const sqlReset = "exec SP_RESTART_CONTRACT_NO";
    const year = moment().year();
    const yearString = moment().format('YYYY');
    let contractNo = 0;
    let checkRunning = await this.runningModel.findOne({ where: { year: year } })

    if (!checkRunning) {
      await this.runningModel.query(sqlReset)
      checkRunning = new ContractRunningNumber();
      checkRunning.no = contractNo;
      checkRunning.year = year;

    } else {
      const contractSequence = await this.getContractNoSequence();
      checkRunning.no = contractSequence[0].contractNo;
    }

    await this.runningModel.save(checkRunning);

    const constractNoString = checkRunning.no.toString().padStart(7, '0');
    const customer = await this.contractModel.query(sqlCustomer, [customerId]);
    const product = await this.contractModel.query(sqlProduct, [productId]);

    const format = `${customer[0].customerCode}${product[0].productCode}${yearString}${constractNoString}`;

    return format;
  }

  async getContractNoSequence() {
    const sql = `SELECT NEXT VALUE FOR [dbo].[ContractNo] AS contractNo`;
    const contractNo = await this.contractModel.query(sql);

    return contractNo;
  }

  checkCustomerPlantEmpty(customerPlants: any) {
    const dataEmpty = _.find(customerPlants, (item) => {
      return !item.customerPlantName
    });
    // if (dataEmpty) {
    //   throw new HttpException('customer ห้ามว่าง', HttpStatus.NOT_FOUND);
    // }
  }

  async checkValueBeforDelete(customerId: any) {
    const contract = await this.contractModel.findOne({ where: { id: customerId } });

    if (!contract) {
      throw new HttpException('ไม่พบสัญญาฉบับนี้', HttpStatus.NOT_FOUND);
    }

    if (contract.totalActualVolumn || contract.totalForecastVolumn) {
      throw new HttpException('ไม่สามารถลบสัญญาฉบับนี้', HttpStatus.NOT_FOUND);
    }
  }
  async getListToModel(year: any): Promise<any> {
    let date = year + '-01-01'
    const sql: any = "SELECT * FROM contract WHERE @0 BETWEEN CONVERT(date,startContractDate)  AND CONVERT(date,endContractDate)";
    return await this.contractModel.query(sql, [date]);
  }
}
