import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MenusController } from './menus.controller';
import { MenuLevel1Provider, MenuLevel2Provider, MenuLevel3Provider } from './menus.provider';
import { MenusService } from './menus.service';


@Module({
    imports: [DatabaseModule],
    controllers: [MenusController],
    providers: [
        ...MenuLevel1Provider,
        ...MenuLevel2Provider,
        ...MenuLevel3Provider, 
        MenusService],
    exports:[MenusService]
})
export class MenusModule {}