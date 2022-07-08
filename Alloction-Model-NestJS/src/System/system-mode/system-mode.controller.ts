import {
    Controller,
    Get
} from '@nestjs/common';
import * as _ from 'lodash';
import { SystemModeService } from './system-mode.service';

@Controller('system-mode')
export class SystemModeController {

    constructor(private service: SystemModeService) { }

    @Get('')
    get() {
        return this.service.getOne();
    }

}