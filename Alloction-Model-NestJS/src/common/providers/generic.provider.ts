import { TOKENS } from '../../constants';
import { Connection } from 'typeorm';

export class TypeORMProvider {
    static create<T>(tokenName: string, ctor: {new(): T}) {        
        return [
            {
                provide: TOKENS[tokenName],
                useFactory: (connection: Connection) => connection.getRepository(ctor),
                inject: TOKENS.inject
            }
        ];
    }
}