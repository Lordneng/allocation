import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { UserGroupController } from './user-group.controller'
import { UserGroupService } from './user-group.service'
import { UserGroupProvider } from './user-group.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [UserGroupController],
    providers: [...UserGroupProvider,UserGroupService],
    exports: [UserGroupService]
})
export class UserGroupModule {}
