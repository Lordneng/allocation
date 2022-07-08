import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Query,
    Delete,
    Request,
} from '@nestjs/common';
import { SellingPricesManualService } from './selling-prices-manual.service';
import * as _ from 'lodash';

@Controller('selling-prices-manual')
export class SellingPricesManualController {
    constructor(private service: SellingPricesManualService) { }

    @Get(':year')
    get(@Param() params) {
        return this.service.getList(params);
    }

    @Get(':id')
    getByid(@Param() params) {
        return this.service.getOne(params);
    }

    @Post()
    create(@Body() data: any) {
        return this.service.create(data);
    }

    @Put()
    update(@Body() data: any) {
        return this.service.update(data);
    }

    @Delete()
    delete(@Body() data: any) {
        return this.service.delete(data);
    }

    @Get('version')
    getVersion(@Query('year') year, @Query('isApply') isApply) {
      const params = { year: year, isApply: isApply }
      return this.service.getVersion(params)
    }
  
    @Post("version")
    saveVersion(@Request() req, @Body() data: any) {
      if (req.user) {
        _.each(data, (item) => {
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      }
  
      return this.service.createVersion(data);
    }
}
