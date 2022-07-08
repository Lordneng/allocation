import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { UserGroupListController } from './user-group-list.controller';
import { UserGroupListService } from './user-group-list.service';
import { UserGroupListProvider } from './user-group-list.provider';


@Module({
    imports: [DatabaseModule],
    controllers: [UserGroupListController],
    providers: [...UserGroupListProvider, UserGroupListService],
    exports: [UserGroupListService]
})
export class UserGroupListModule {}
