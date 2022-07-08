import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    Query,
  } from '@nestjs/common';
  import * as _ from 'lodash';
  import { PermissionsService } from './permissions.service';
  
  @Controller('permissions')
  export class PermissionsController {
    constructor(private service: PermissionsService) { }
  
    @Get()
    get(@Param() params) {
      return this.service.getList(params);
    }
  
    @Get('/login')
    getByUserGroupId(@Query('userid') userId) {
      return this.service.getByUserGroup(userId);
    }
  
  
    @Post()
    create(@Body() data: any) {
      return this.service.save(data);
    }
  
    @Put()
    update(@Body() data: any) {
      return this.service.save(data);
    }
  
    @Delete()
    delete(@Body() data: any) {
      return this.service.delete(data);
    }
}