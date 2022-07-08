import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards, Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';
import { ProductionPlantService } from './production-plant.service';

@UseGuards(JwtAuthGuard)
@Controller('production-plant')
export class ProductionPlantController {
  constructor(private service: ProductionPlantService) { }

  @Get()
  get(@Param() params) {
    return this.service.getList(params);
  }


  @Post()
  create(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, (item) => {
          item.createBy = req.user.fullName;
          item.updateBy = req.user.fullName;
        })
      } else {
        data.createBy = req.user.fullName;
        data.updateBy = req.user.fullName;
      }

    }
    return this.service.create(data);
  }


  @Put()
  update(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, (item) => {
          item.createBy = req.user.fullName;
          item.updateBy = req.user.fullName;
        })
      } else {
        data.createBy = req.user.fullName;
        data.updateBy = req.user.fullName;
      }

    }
    return this.service.update(data);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    // // ('data Deelte', id)
    return this.service.delete(id);

  }
}
