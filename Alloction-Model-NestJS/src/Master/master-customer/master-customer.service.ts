import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';
import { MasterCustomer, MasterCustomerPlant } from './entity'
import { getConnection, Repository } from 'typeorm'
import { TOKENS } from '../../constants'
import { CustomerCreateDto } from './dto/customerCreateDto';
import { CustomerUpdateDto } from './dto/customerUpdateDto';
import { CustomerPlantCreateDto } from './dto/customerPlantCreateDto';
import { CustomerPlantUpdateDto } from './dto/customerPlantUpdateDto';

@Injectable()
export class MasterCustomerService {

  constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterCustomer>,
    @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataPlantModel: Repository<MasterCustomerPlant>) {

  }

  async getList(): Promise<any> {
    return await this.dataModel.find({ order: { rowOrder: 'ASC' } });;
  }

  async getById(id: any): Promise<any> {
    return await this.dataModel.findOne({ where: { id: id }, order: { rowOrder: 'ASC' } });;
  }

  async getPlantList(customerId: any): Promise<any> {
    return await this.dataPlantModel.find({ where: { customerId: customerId }, order: { rowOrder: 'ASC' } });;
  }

  async create(data: CustomerCreateDto) {
    await getConnection().transaction(async transactionalEntityManager => {

      const customer = new MasterCustomer();
      Object.assign(customer, data)

      await transactionalEntityManager.save(customer);


      const plants: MasterCustomerPlant[] = []

      for (const plant of data.plants) {
        const customerPlant = new MasterCustomerPlant();
        customerPlant.customerId = customer.id.toString();
        customerPlant.code = plant.code;
        customerPlant.name = plant.name;
        customerPlant.activeStatus = plant.activeStatus;
        customerPlant.rowOrder = plant.rowOrder;
        customerPlant.remark = plant.remark;
        customerPlant.createByUserId = data.createByUserId;
        customerPlant.createBy = data.createBy;
        customerPlant.updateByUserId = data.updateByUserId;
        customerPlant.updateBy = data.updateBy;

        plants.push(customerPlant);
      }

      await transactionalEntityManager.save(plants);
    })
  }

  async update(data: CustomerUpdateDto) {
    await getConnection().transaction(async transactionalEntityManager => {

      const customer = await transactionalEntityManager.findOne(MasterCustomer, { where: { id: data.id } });

      customer.name = data.name;
      customer.code = data.code;
      customer.customerTypeCode = data.customerTypeCode;
      customer.customerTypeName = data.customerTypeName;
      customer.shortName = data.shortName;
      customer.activeStatus = data.activeStatus;
      customer.rowOrder = data.rowOrder;
      customer.remark = data.remark;
      customer.updateBy = data.updateBy;
      customer.updateByUserId = data.updateByUserId;
      customer.updateDate = new Date();

      await transactionalEntityManager.save(customer);

      await transactionalEntityManager.delete(MasterCustomerPlant, { customerId: customer.id });

      const plants: MasterCustomerPlant[] = []

      for (const plant of data.plants) {
        const customerPlant = new MasterCustomerPlant();
        customerPlant.id = plant.id ? plant.id : undefined;

        customerPlant.customerId = customer.id.toString();
        customerPlant.code = plant.code;
        customerPlant.name = plant.name;
        customerPlant.activeStatus = plant.activeStatus;
        customerPlant.rowOrder = plant.rowOrder;
        customerPlant.remark = plant.remark;
        customerPlant.createByUserId = data.createByUserId;
        customerPlant.createBy = data.createBy;
        customerPlant.updateByUserId = data.updateByUserId;
        customerPlant.updateBy = data.updateBy;

        plants.push(customerPlant);
      }

      await transactionalEntityManager.save(plants);
    })
  }

  async delete(id: any) {
    await getConnection().transaction(async transactionalEntityManager => {

      await transactionalEntityManager.delete(MasterCustomerPlant, { customerId: id });

      await transactionalEntityManager.delete(MasterCustomer, { id: id });
    })
  }

  async IsCustomerPlantNameAlreadyExist(plants: CustomerPlantCreateDto[]) {
    for (const plant of plants) {
      const customerPlant = await this.dataPlantModel.createQueryBuilder()
        .where("LOWER(name) = LOWER(:name)")
        .setParameters({ name: plant.name })
        .getOne();

      if (customerPlant) {
        throw new HttpException('Customer Plant Name $value มีในระบบแล้วแล้ว.', HttpStatus.NOT_FOUND);
      };
    }
  }

  async UpdateCustomerNameAlreadyExist(plants: CustomerPlantUpdateDto[]) {
    for (const plant of plants) {
      const customer = await this.dataPlantModel.findOne({ where: { id: plant.id } });

      if (customer) {
        if (customer.name !== plant.name) {
          const check = await this.dataPlantModel.createQueryBuilder()
            .where("LOWER(name) = LOWER(:name) AND id <> :id")
            .setParameters({ name: plant.name, id: plant.id })
            .getOne();

          if (check) {
            throw new HttpException('Customer Plant Name $value มีในระบบแล้วแล้ว.', HttpStatus.NOT_FOUND);
          };
        }
      } else {
        //comment ไว้ก่อนมี Error
        // const customerPlant = await this.dataPlantModel.createQueryBuilder()
        //   .where("LOWER(name) = LOWER(:name) AND id <> :id")
        //   .setParameters({ name: plant.name, id: plant.id })
        //   .getOne();

        // if (customerPlant) {
        //   throw new HttpException('Customer Plant Name $value มีในระบบแล้วแล้ว.', HttpStatus.NOT_FOUND);
        // };
      }


    }
  }

  checkCustomerPlantNameEmpty(plants: any) {
    const dataEmpty = _.find(plants, (item) => {
      return !item.name
    });
    if (dataEmpty) {
      throw new HttpException('Plant Name ห้ามว่าง', HttpStatus.NOT_FOUND);
    }
  }

}
