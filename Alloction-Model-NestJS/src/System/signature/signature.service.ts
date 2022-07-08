import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { Signature } from './entity';
import { TOKENS } from '../../constants';
import { getConnection, Repository, Transaction, TransactionRepository } from 'typeorm';
import { signatureCreateDto } from './dto/signatureCreateDto';
@Injectable()
export class SignatureService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<Signature>) {

  }

  async getList(params: any): Promise<any> {
    // // ('params', params);
    return this.dataModel.find({ order: { rowOrder: 'ASC' } });
  }
  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ id: id });
  }

  async save(data: signatureCreateDto) {

    await getConnection().transaction(async transactionalEntityManager => {

      const signature = new Signature();
      Object.assign(signature, data)      
      
      await transactionalEntityManager.save(signature);
      
    })
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }
  async getOneByUsername(firstName: string): Promise<Signature | undefined> {
    // (user: User) => user.userName === username
    return await this.dataModel.findOne({ "firstName": firstName });
  }

}
