import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards, Request, HttpStatus, HttpException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import * as _ from 'lodash';
// '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { userCreateDto } from './dto/userCreateDto';
import { userUpdateDto } from './dto/userUpdateDto';
import { User } from './entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private service: UsersService) { }

  @Get()
  get(@Param() params) {
    // // ('data get list', params);
    return this.service.getList(params);
  }

  @Get(':id')
  getByid(@Param() params) {
    // // ('data get One', params);
    return this.service.getOne(params);
  }


  @Post()
  create(@Request() req, @Body() data: userCreateDto) {

    if (req.user) {
      data.createByUserId = req.user.userId;
      data.createBy = req.user.fullName;
      data.updateByUserId = req.user.userId;
      data.updateBy = req.user.fullName;
    }

    return this.service.create(data);
  }

  @Put()
  update(@Request() req, @Body() data: userUpdateDto) {

    if (req.user) {
      data.updateDate = new Date();
      data.updateByUserId = req.user.userId;
      data.updateBy = req.user.fullName;
    }
    return this.service.update(data);
    // this.Costervice.updateCost(Cost);
  }

  @Delete()
  delete(@Request() req, @Body() data: any) {
    // // ('data Deelte', data);
    if (req.user) {
      data.updateDate = new Date();
      data.updateBy = req.user.fullName;
  }
    return this.service.delete(data);
  }
}
