import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';
import { getConnection, Repository, Transaction, TransactionRepository } from 'typeorm';
import { MasterProduct, MasterProductGrade, MasterProductFullCostFormula } from './entity';
import { TOKENS } from '../../constants';
import moment from 'moment';
import { ProductCreateDto } from './models/productCreateDto';
import { ProductGradeCreateDto } from './models/productGradeCreateDto';
import { ProductFullCostFormulaCreateDto } from './models/productFullCostFormulaCreateDto';
import { ProductGradeUpdateDto } from './models/productGradeUpdateDto';
import { ProductUpdateDto } from './models/productUpdateDto';
import { ProductFullCostFormulaUpdateDto } from './models/ProductFullCostFormulaUpdateDto';
import console from 'console';
@Injectable()
export class MasterProductsService {

  constructor(
    //@InjectModel('MasterCost') private readonly dataModel: Model<MasterCost>
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterProduct>,
    @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataFormulaModel: Repository<MasterProductFullCostFormula>,
    @Inject(TOKENS.ProjectRepositoryTokenForm) private readonly dataGradeModel: Repository<MasterProductGrade>,
  ) {

  }

  async getList(): Promise<any> {
    return await this.dataModel.find({ order: { rowOrder: 'ASC' } });
  }

  async getActive(status: any): Promise<any> {
    return await this.dataModel.find({ where: { activeStatus: status }, order: { rowOrder: 'ASC' } });
  }

  async getOne(id: any): Promise<MasterProduct> {
    return await this.dataModel.findOne({ id: id });
  }

  // @Transaction()
  // async create(@TransactionRepository(MasterProduct) manager: Repository<MasterProduct>, data?: any) {
  //   return await manager.save(data);
  // }

  // async update(data: any) {
  //   return this.dataModel.save({ ...data, id: data.id });
  // }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async create(product?: ProductCreateDto, grades?: ProductGradeCreateDto[], formulas?: ProductFullCostFormulaCreateDto[]) {

    await getConnection().transaction(async transactionalEntityManager => {

      const productSave = new MasterProduct();
      Object.assign(productSave, product);

      const gradesSave: MasterProductGrade[] = [];

      for (const grade of grades) {
        const masterGrade = new MasterProductGrade();
        Object.assign(masterGrade, grade);
        gradesSave.push(masterGrade);
      }

      const formulasSave: MasterProductFullCostFormula[] = [];

      for (const formula of formulas) {
        const masterFormula = new MasterProductFullCostFormula();
        Object.assign(masterFormula, formula);

        formulasSave.push(masterFormula);
      }

      await transactionalEntityManager.save(productSave);
      await transactionalEntityManager.save(gradesSave);
      await transactionalEntityManager.save(formulasSave);
    });
  }

  async update(product: ProductUpdateDto, grades: ProductGradeUpdateDto[], formulas: ProductFullCostFormulaUpdateDto[]) {

    await getConnection().transaction(async transactionalEntityManager => {

      const productSave = await transactionalEntityManager.findOne(MasterProduct, { where: { id: product.id } });

      productSave.rowOrder = product.rowOrder;
      productSave.productCode = product.productCode;
      productSave.productName = product.productName;
      productSave.productShortName = product.productShortName;
      productSave.activeStatus = product.activeStatus;
      productSave.remark = productSave.remark;
      productSave.createByUserId = product.createByUserId;
      productSave.createBy = product.createBy;
      productSave.updateByUserId = product.updateByUserId;
      productSave.updateBy = product.updateBy;

      await transactionalEntityManager.delete(MasterProductGrade, { productId: product.id });

      const gradesSave: MasterProductGrade[] = [];

      for (const grade of grades) {
        const masterGrade = new MasterProductGrade();
        Object.assign(masterGrade, grade);
        gradesSave.push(masterGrade);
      }

      await transactionalEntityManager.delete(MasterProductFullCostFormula, { productId: product.id });

      const formulasSave: MasterProductFullCostFormula[] = [];

      for (const formula of formulas) {
        const masterFormula = new MasterProductFullCostFormula();
        Object.assign(masterFormula, formula);

        formulasSave.push(masterFormula);
      }
      // ('formulasSave', formulasSave);
      await transactionalEntityManager.save(productSave);
      await transactionalEntityManager.save(gradesSave);
      await transactionalEntityManager.save(formulasSave);
    });
  }

  async getGradeList(productId: any): Promise<MasterProductGrade[]> {
    return await this.dataGradeModel.find({ where: { productId: productId }, order: { rowOrder: 'ASC' } });;
  }

  async getFormulaList(productId: any): Promise<MasterProductFullCostFormula[]> {
    return await this.dataFormulaModel.find({ where: { productId: productId }, order: { rowOrder: 'ASC' } });
  }

  async SaveFormula(data: any) {
    return this.dataFormulaModel.save({ ...data, id: data.id });
  }

  checkFormulaDuplicate(dataFormula: any) {
    _.each(dataFormula, (item) => {

      let dataDuplicate : any = [];

      if(item.productGradeId){
        dataDuplicate = _.filter(dataFormula, (data) => {
          return data.productGradeId === item.productGradeId && data.sourceId === item.sourceId && data.deliveryPointId === item.deliveryPointId && data.activeStatus === 'Active';
        })
      } else {
        dataDuplicate = _.filter(dataFormula, (data) => {
          return data.sourceId === item.sourceId && data.deliveryPointId === item.deliveryPointId && data.activeStatus === 'Active';
        })
      }

      if (dataDuplicate.length > 1) {
        // ('dataDuplicate', dataDuplicate);
        throw new HttpException('เกรดผลิตภัณฑ์ Source และ Delivery Point ไม่สามารถซ้ำการได้ภายใต้ Product', HttpStatus.NOT_FOUND);
      }
    })
  }

  checkGradeEmpty(dataGrade: any) {
    const dataEmpty = _.find(dataGrade, (item) => {
      return !item.productGrade
    });
    if (dataEmpty) {
      throw new HttpException('เกรดผลิตภัณฑ์ ห้ามเป็นค่าว่าง', HttpStatus.NOT_FOUND);
    }
  }

  checkFormulaEmpty(dataFormula: any) {
    let message = 'Product Formula ต้องมีค่าอย่างน้อง 1 รายการที่สามารถใช้งานได้';
    if (!(dataFormula && dataFormula.length > 0)) {
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    } else {
      const dataEmpty = _.find(dataFormula, (item) => {
        return item.activeStatus ==='Active'
      });
      if (!dataEmpty) {
        throw new HttpException(message, HttpStatus.NOT_FOUND);
        
      }
    }
  }
}
