import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards, Request
} from '@nestjs/common';
import * as _ from 'lodash';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { signatureCreateDto } from './dto/signatureCreateDto';
import { SignatureService } from './signature.service';

@Controller('signature')
@UseGuards(JwtAuthGuard)
export class SignatureController {
  constructor(private service: SignatureService) { }

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
  create(@Request() req,@Body() data: signatureCreateDto) {
    if (req.user) {
      data.createByUserId = req.user.userId;
      data.createBy = req.user.fullName;
      data.updateByUserId = req.user.userId;
      data.updateBy = req.user.fullName;
    }
    // ('data Create', data);
    return this.service.save(data);
  }

  @Put()
  update(@Request() req,@Body() data: signatureCreateDto) {
    if (req.user) {
      data.updateDate = new Date();
      data.updateByUserId = req.user.userId;
      data.updateBy = req.user.fullName;
    }
    // // ('data Update', data);
    return this.service.save(data);
    // this.Costervice.updateCost(Cost);
  }

  @Delete()
  delete(@Request() req,@Body() data: any) {
    // // ('data Deelte', data);
    if (req.user) {
      data.updateDate = new Date();
      data.updateBy = req.user.fullName;
    }
    return this.service.delete(data);
  }
}
