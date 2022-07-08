import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { UsersController } from './users.controller';
import { UsersProvider } from './users.provider';
import { UsersService } from './users.service';
import { IsUserAlreadyExist } from './validateFillter/IsUserAlreadyExist';


@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [...UsersProvider, IsUserAlreadyExist, UsersService],
    exports:[UsersService]
})
export class UsersModule {}