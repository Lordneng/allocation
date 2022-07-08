import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  Query,
  HttpStatus,
  HttpException
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';
import { MasterProductsService } from './master-products.service';
import { MasterProductRequest } from './models/master-product-request';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MasterProduct, MasterProductFullCostFormula, MasterProductGrade } from './entity';
import { ProductCreateDto } from './models/productCreateDto';
import { ProductRequestCreateDto } from './models/productRequestCreateDto';
import { ProductRequestUpdateDto } from './models/productRequestUpdateDto';

@UseGuards(JwtAuthGuard)
@Controller('master-products')
export class MasterProductsController {
  constructor(private service: MasterProductsService) { }

  @Get()
  get() {
    return this.service.getList();
  }

  @Get('active')
  getActive(@Query('status') status) {
    return this.service.getActive(status);
  }

  @Get(":productId")
  @ApiBearerAuth()
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, type: MasterProduct, description: 'Get product detail.' })
  getById(@Param('productId') productId) {
    return this.service.getOne(productId);
  }


  @Post()
  @ApiBearerAuth()
  create(@Request() req, @Body() data: ProductRequestCreateDto) {
    try {
      this.service.checkGradeEmpty(data.grades);
      this.service.checkFormulaEmpty(data.formulas);
      this.service.checkFormulaDuplicate(data.formulas);
      if (req.user) {
        if (_.isArray(data.grades)) {
          _.each(data.grades, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
          })
        }

        if (_.isArray(data.formulas)) {
          _.each(data.formulas, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
          })
        }

        data.product.createByUserId = req.user.userId;
        data.product.createBy = req.user.fullName;
        data.product.updateByUserId = req.user.userId
        data.product.updateBy = req.user.fullName;
      }

      return this.service.create(data.product, data.grades, data.formulas);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND);
    }
  }


  @Put()
  @ApiBearerAuth()
  update(@Request() req, @Body() data: ProductRequestUpdateDto) {
    try {
      this.service.checkGradeEmpty(data.grades);
      this.service.checkFormulaEmpty(data.formulas);
      this.service.checkFormulaDuplicate(data.formulas);
      if (req.user) {
        if (_.isArray(data.grades)) {
          _.each(data.grades, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
          })
        }

        if (_.isArray(data.formulas)) {
          _.each(data.formulas, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
          })
        }

        data.product.createByUserId = req.user.userId;
        data.product.createBy = req.user.fullName;
        data.product.updateByUserId = req.user.userId
        data.product.updateBy = req.user.fullName;
      }

      return this.service.update(data.product, data.grades, data.formulas);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND);
    }

  }

  @Get('grade/:productId')
  @ApiBearerAuth()
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, type: [MasterProductGrade], description: 'Get master product grades.' })
  getGrades(@Param('productId') productId) {
    return this.service.getGradeList(productId);
  }

  @Get('formula/:productId')
  @ApiBearerAuth()
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, type: [MasterProductFullCostFormula], description: 'Get master product full cost formula.' })
  getFormulas(@Param('productId') productId) {
    // // ('data get list', params)
    return this.service.getFormulaList(productId);
  }

  // @Delete(':id')
  // delete(@Param('id') id) {
  //   // // ('data Deelte', id)
  //   return this.service.delete(id);

  // }
}
