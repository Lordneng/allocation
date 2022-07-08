import {
    Controller,
    Get
} from '@nestjs/common';
import * as _ from 'lodash';
import { MenusService } from './menus.service';
  
@Controller('menus')
export class MenusController {
constructor(private service: MenusService) { }

    @Get()
    get() {
        // // ('data get list', params);
        return this.service.getList();
    }
}