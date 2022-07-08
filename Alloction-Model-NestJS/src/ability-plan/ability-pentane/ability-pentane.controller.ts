import {
   Controller,
   Get,
   Post,
   Body,
   Put,
   Request,
   Query,
   UseGuards,
} from '@nestjs/common';
import { AbilityPentaneService } from './ability-pentane.service';
import * as _ from 'lodash';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ability-pentane')
export class AbilityPentaneController {
   constructor(private service: AbilityPentaneService) { }

   @ApiBearerAuth()
   @Get()
   get(@Query('year') year, @Query('month') month, @Query('version') version) {
      const params = { year: year, month: month, version: version }
      return this.service.getList(params);
   }

   @ApiBearerAuth()
   @Get('getListbyVersionId')
   getListbyVersionId(@Query('versionId') versionId) {
      const params = { versionId: versionId }
      return this.service.getListbyVersionId(params);
   }

   // @ApiBearerAuth()
   // @Get('cal-margin')
   // getCalMargin(@Query('year') year, @Query('month') month, @Query('version') version) {
   //   const params = { year: year, month: month, version: version }
   //   return this.service.getListToCalMargin(params);
   // }

   @ApiBearerAuth()
   @Get('ability-monthly')
   getAbility(@Query('year') year, @Query('month') month, @Query('version') version) {
      const params = { year: year, month: month, version: version }
      return this.service.getListAbility(params);
   }

   @ApiBearerAuth()
   @Get('history')
   getHistory(@Query('year') year, @Query('month') month, @Query('version') version) {
      const params = { year: year, month: month, version: version }
      return this.service.getHistoryList(params);
   }

   @ApiBearerAuth()
   @Get("form")
   getForm(@Query('year') year, @Query('month') month, @Query('version') version) {
      const params = { year: year, month: month, version: version }
      return this.service.getForm(params);
   }

   @Post()
   @ApiBearerAuth()
   save(@Request() req, @Body() data: any) {
      if (req.user) {
         _.each(data.abilityPentane, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
         })

         _.each(data.version, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
         })

         _.each(data.form, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
         })
      }
      return this.service.save(data);
   }

   @Put()
   @ApiBearerAuth()
   update(@Request() req, @Body() data: any) {
      if (req.user) {
         _.each(data, (item) => {
            item.updateDate = new Date();
            item.updateBy = req.user.fullName;
         })
      }
      return this.service.save(data)
   }

   @ApiBearerAuth()
   @Get('version')
   getVersion(@Query('year') year, @Query('month') month, @Query('isApply') isApply) {
      const params = { year: year, month: month, isApply: isApply }
      return this.service.getVersion(params)
   }

   @ApiBearerAuth()
   @Get('version/id')
   getVersionbyID(@Query('id') id) {
      return this.service.getVersionById(id)
   }

   @ApiBearerAuth()
   @Get('versionById/id')
   getVersionbyId(@Query('id') id) {
      return this.service.getVersionById2(id)
   }

   @ApiBearerAuth()
   @Get('version/month')
   getMonthMaxVersion(@Query('year') year, @Query('month') month) {
      const params = { year: year, month: month }
      return this.service.getMonthMaxVersion(params)
   }

   @ApiBearerAuth()
   @Post("version")
   saveVersion(@Request() req, @Body() data: any) {
      if (req.user) {
         _.each(data, (item) => {
            item.updateDate = new Date();
            item.updateBy = req.user.fullName;
         })
      }

      return this.service.saveVersion(data);
   }

   @ApiBearerAuth()
   @Post("form")
   saveForm(@Request() req, @Body() data: any) {
      if (req.user) {
         _.each(data, (item) => {
            item.updateDate = new Date();
            item.updateBy = req.user.fullName;
         })
      }
      return this.service.SaveForm(data);
   }

   @ApiBearerAuth()
   @Get('versionByYear')
   getVersionByYear(@Query('year') year) {
      const params = { year: year }
      return this.service.getVersionByYear(params)
   }
}
