import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { Turnaround } from './entity'
import { EntityManager, getConnection, Raw, Repository, Transaction, TransactionRepository } from 'typeorm'
import { TOKENS } from '../../constants'
import { TurnaroundCreateDto } from './dto/turnaroundCreateDto';
import { TurnaroundUpdateDto } from './dto/turnaroundUpdateDto';
import moment from 'moment';

@Injectable()
export class MasterTurnaroundService {

  constructor(@Inject(TOKENS.ProjectRepositoryTokenNew) private readonly dataModel: Repository<Turnaround>,
  ) {

  }

  async getList(params: any): Promise<any> {
    const condition :any = {}

    if(params.year){
      condition['startTurnaroundDate'] = Raw((alias) => `Year(${alias}) <= ${params.year}`);
      condition['endTurnaroundDate'] = Raw((alias) => `Year(${alias}) >= ${params.year}`);
    }

    if(params.customerId){
      condition['customerId'] = params.customerId;
    }

    if(params.productId){
      condition['productId'] = params.productId;
    }

    return await this.dataModel.find({where: condition, order: { startTurnaroundDate: 'ASC' } });

  }

  async getById(id: any): Promise<any> {
    return await this.dataModel.findOne({ where: { id: id} });
  }

  async create(data: TurnaroundCreateDto) {
    await getConnection().transaction(async transactionalEntityManager => {

      const turnaround = new Turnaround();
      Object.assign(turnaround, data);   
      
      await transactionalEntityManager.save(turnaround);
    });
  }

  async update(data: TurnaroundUpdateDto) {
    await getConnection().transaction(async transactionalEntityManager => {

      const turnaround = await transactionalEntityManager.findOne(Turnaround, {where: { id : data.id }});;
    
      turnaround.turnaroundTypeId = data.turnaroundTypeId;
      turnaround.turnaroundTypeName = data.turnaroundTypeName;
      turnaround.startTurnaroundDate = data.startTurnaroundDate;
      turnaround.endTurnaroundDate = data.endTurnaroundDate;
      turnaround.productId = data.productId;
      turnaround.productName = data.productName;
      turnaround.plantId = data.plantId;
      turnaround.plantName = data.plantName;
      turnaround.customerId = data.customerId;
      turnaround.customerName = data.customerName;
      turnaround.percent = data.percent;
      turnaround.duration = data.duration;
      turnaround.remark = data.remark;
      turnaround.activeStatus = data.activeStatus;
      turnaround.updateBy = data.updateBy;
      turnaround.updateByUserId = data.updateByUserId;
      turnaround.updateDate = new Date();
      
      await transactionalEntityManager.save(turnaround);
    });
  }

  async delete(id: any) {
    await getConnection().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.delete(Turnaround, {id: id});
    })
  }

  async getturnaroundvolume(params: any): Promise<any> {

    let listData = [];
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();

    for (let index = 1; index <= 13; index++) {
      const data: any = { year: yearStart, month: monthStart + 1}

      const condition :any = {}
      condition['startTurnaroundDate'] = Raw((alias) => `Year(${alias}) <= ${data.year} AND Month(${alias}) <= ${data.month}`);
      condition['endTurnaroundDate'] = Raw((alias) => `Year(${alias}) >= ${data.year} AND Month(${alias}) >= ${data.month}`);
      condition['activeStatus'] = 'Active';

      data.data = await this.dataModel.find({where: condition, order: { rowOrder: 'ASC' } });

      _.each(data.data, ( item ) => {
        let startDate = moment(item.startTurnaroundDate);
        let endDate = moment(item.endTurnaroundDate);
        item.day = this.getDays(startDate,endDate,data.month);
      });

      listData.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    return listData;
    
  }

  getDays = function(start, end, month) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
      if(moment(dt).format('M') == month){
        arr.push(new Date(dt));
      }
    }
    return arr.length;
  }

}
