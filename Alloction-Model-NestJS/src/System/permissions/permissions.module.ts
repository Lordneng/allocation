import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { PermissionsController } from './permissions.controller';
import { PermissionsProvider } from './permissions.provider';
import { PermissionsService } from './permissions.service';


@Module({
    imports: [DatabaseModule],
    controllers: [PermissionsController],
    providers: [...PermissionsProvider ,PermissionsService],
    exports:[PermissionsService]
})
export class PermisionsModule {}