import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards, Request, Query,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';
import { UserGroupListService } from './user-group-list.service'

@UseGuards(JwtAuthGuard)
@Controller('user-group-list')
export class UserGroupListController {
  constructor(private service: UserGroupListService) { }

  @Get()
  get(@Param() params) {
    return this.service.getList(params);
  }

  @Get("/user-group-by-id")
  async getByUserId(@Query() query: any) {
    return await this.service.getByUserId(query);
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
    return this.service.delete(id);

  }
}
