import { Inject, Injectable } from "@nestjs/common";
import moment from "moment";
import * as _ from 'lodash';
import { getConnection, Repository } from "typeorm";
import { TOKENS } from "../constants";
import { CalmarginRequestDto } from "./dto/calmarginRequestDto";
import { MasterCostsService } from "../Master/master-costs/master-costs.service";
import { MasterReferencePricesService } from "../Master/master-reference-prices/master-reference-prices.service";
import { CostsService } from "../cost/costs.service";
import { ReferencePricesService } from "../reference-prices/reference-prices.service";
import { CalMarginVersion } from "./entity/cal-margin-version.entity";
import { CalmarginSaveDto } from "./dto/calmarginSaveDto";
import { FullCostManual } from "../full-cost-manuals/entity";
import { SellingPricesManual } from "../selling-price-manual/entity";
import { MasterCostProductsTypesService } from "../Master/master-product-cost-types/master-product-cost-types.service";
import { MasterCostProductTypes } from "../Master/master-product-cost-types/entity";
import { CalmarginReportDto } from "./dto/CalmarginReportDto";
import { resolve } from "path";
import { rejects } from "assert";
import { CalmarginContractDto } from "./dto/calmarginContractDto";

@Injectable()
export class CalMarginService {


    constructor(@Inject(TOKENS.ProjectRepositoryTokenForm) private readonly fullcostDataModel: Repository<FullCostManual>,
        @Inject(TOKENS.ProjectRepositoryTokenNew) private readonly sellingPriceDataModel: Repository<SellingPricesManual>,
        @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<CalMarginVersion>,
        private readonly masterCostService: MasterCostsService,
        private readonly masterProductCostType: MasterCostProductsTypesService,
        private readonly masterReferencePriceService: MasterReferencePricesService,
        private readonly costService: CostsService,
        private readonly referencePrice: ReferencePricesService
    ) {

    }

    async get(month: number, year: number, costProductTypeId: string, costVersionId: string,
        referencePriceVersionId: string): Promise<CalmarginRequestDto[]> {
        let result: CalmarginRequestDto[] = [];
        let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
        let dateEnd = moment((year + 1) + '-' + _.padStart(month, 2, '0') + '-01');

        const contracts: CalmarginRequestDto[] = await this.listData(dateStart, dateEnd);

        result = await this.calculate(year, month, contracts, costProductTypeId,
            costVersionId, referencePriceVersionId);

        return result;
    }

    async getByVersion(month: number, year: number, version: number): Promise<CalmarginRequestDto[]> {
        let result: CalmarginRequestDto[] = [];
        let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
        let dateEnd = moment(dateStart).add(1, 'y');

        const contracts: CalmarginRequestDto[] = await this.listData(dateStart, dateEnd);
        const calMarginVersion = await this.dataVersionModel.findOne({ where: { year: year, month: month, version: version } });

        if (calMarginVersion) {
            result = await this.calculate(year, month, contracts, calMarginVersion.costProductTypeId,
                calMarginVersion.costVersionId, calMarginVersion.referencePriceVersionId);
        }

        return result;
    }

    async getByVersionToReport(calmarginVersionId: string): Promise<CalmarginReportDto[]> {
        let result: CalmarginReportDto[] = [];
        let resultRequest: CalmarginRequestDto[] = [];


        const calMarginVersion = await this.dataVersionModel.findOne({ where: { id: calmarginVersionId } });

        if (calMarginVersion) {
            const year: number = _.toInteger(calMarginVersion.year);
            const month: number = _.toInteger(calMarginVersion.month);
            const params = { year: calMarginVersion.year, month: calMarginVersion.month, version: calMarginVersion.version }
            let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
            let dateEnd = moment(dateStart).add(1, 'y');

            const contracts: CalmarginRequestDto[] = await this.listDataToReport(dateStart, dateEnd);
            resultRequest = await this.calculate(year, month, contracts, calMarginVersion.costProductTypeId,
                calMarginVersion.costVersionId, calMarginVersion.referencePriceVersionId);

            const reports: CalmarginRequestDto[] = _.cloneDeep(resultRequest);

            if (reports && reports.length > 0) {

                const fullCostManuals = await this.getFullCostVersion(params);
                const sellingPricesManuals = await this.getSellingPriceVersion(params);

                for (const item of reports) {

                    let data: CalmarginReportDto = new CalmarginReportDto();
                    Object.assign(data, item);

                    const resultAll = await Promise.all([
                        this.getFullCostManual(fullCostManuals, item),
                        this.getSellingPriceManual(sellingPricesManuals, item)
                    ]);

                    const fullCostManual: FullCostManual = resultAll[0];
                    const sellingPricesManual: SellingPricesManual = resultAll[1];

                    if (fullCostManual) {
                        data.fullCostValue = fullCostManual.value;
                    }

                    if (sellingPricesManual) {
                        data.sellingPriceValue = _.toInteger(sellingPricesManual.value);
                    }

                    data.marginPerUnitValue = data.sellingPriceValue - data.fullCostValue;

                    result.push(data);
                }
            }
        }

        return result;
    }


    async calculate(year: number, month: number, contracts: CalmarginRequestDto[], costProductTypeId: string,
        costVersionId: string, referencePriceVersionId: string): Promise<CalmarginRequestDto[]> {
        const result: CalmarginRequestDto[] = [];
        const costParameters = await this.masterCostService.getParameter();
        const referencePriceParameters = await this.masterReferencePriceService.getParameter();
        let costParams: any = {};
        let referenceParam: any = {};
        let costs = [];
        let costNextYears = [];
        let referencePrices = [];
        let referencePriceNextYears = [];
        let referencePriceLastYears = [];
        let listMonthCost = [];
        let listMonthReference = [];

        const costVersion = await this.costService.getVersionById(costVersionId);
        const referencePriceVersion = await this.referencePrice.getVersionById(referencePriceVersionId);
        const costProductType = await this.masterProductCostType.getById(costProductTypeId);

        if (costVersion) {
            listMonthCost = this.getListMonth(year, month);

            costParams = { year: costVersion.year, month: costVersion.month, version: costVersion.version }
            costs = await this.costService.getCostToCalMarginByVersion(costParams);
            costNextYears = await this.costService.getNextYear(costParams);
        }

        if (referencePriceVersion) {
            listMonthReference = this.getListMonth(year, month);

            referenceParam = { year: referencePriceVersion.year, month: referencePriceVersion.month, version: referencePriceVersion.version }
            referencePrices = await this.referencePrice.getReferencePriceToCalMarginByVersion(referenceParam);
            referencePriceNextYears = await this.referencePrice.getNextYear(referenceParam);

            if (month === 1) {
                referencePriceLastYears = await this.referencePrice.getLastYear(referenceParam)
            }
        }

        for (const contract of contracts) {
            if (contract.fullcostFormula) {
                let fullcostFormula = contract.fullcostFormula;
                let fullcostFormulaText = contract.fullcostFormula;

                fullcostFormula = this.replaceParameterCost(year, month, fullcostFormula, costParameters, costs,
                    costNextYears, listMonthCost, costProductType, contract);

                fullcostFormulaText = this.replaceParameterFormulaCost(fullcostFormulaText, costParameters);

                fullcostFormula = this.replaceParameterReferencePrice(year, month, fullcostFormula, referencePriceParameters, referencePrices,
                    referencePriceNextYears, referencePriceLastYears, listMonthReference, contract);

                fullcostFormulaText = this.replaceParameterFormulaReferencePrice(fullcostFormulaText, referencePriceParameters);
                // // (fullcostFormulaText,fullcostFormula);
                contract.fullCostValue = this.evalFormula(fullcostFormula);
                contract.fullcostFormulaText = fullcostFormulaText;
            }

            if (contract.sellingPriceFormula) {
                let sellingPriceFormula = contract.sellingPriceFormula;
                let sellingPriceFormulaText = contract.sellingPriceFormula;

                sellingPriceFormula = this.replaceParameterCost(year, month, sellingPriceFormula, costParameters, costs,
                    costNextYears, listMonthCost, costProductType, contract);

                sellingPriceFormulaText = this.replaceParameterFormulaCost(sellingPriceFormulaText, costParameters);

                sellingPriceFormula = this.replaceParameterReferencePrice(year, month, sellingPriceFormula, referencePriceParameters, referencePrices,
                    referencePriceNextYears, referencePriceLastYears, listMonthReference, contract);

                sellingPriceFormulaText = this.replaceParameterFormulaReferencePrice(sellingPriceFormulaText, referencePriceParameters);
                
                // if(contract.yearValue === 2022 && contract.monthValue === 7 && contract.demandName === "C2 - SCG"){
                //     console.log(sellingPriceFormula);
                //     console.log(sellingPriceFormulaText);

                // }

                contract.sellingPriceValue = this.evalFormula(sellingPriceFormula);
                contract.sellingPriceFormulaText = sellingPriceFormulaText;
            }

            result.push(contract);
        }

        return result;
    }

    replaceParameterFormulaCost(formula: string, costParameters: any): string {
        let fullcostFormula: string = '';
        let value: string = '';

        fullcostFormula = formula;

        for (const costPram of costParameters) {
            value = costPram.productName;

            // search current 
            const costTextPrameter = '#' + costPram.parameterName;
            fullcostFormula = _.replace(fullcostFormula, new RegExp(costTextPrameter, "g"), value)

        }

        return fullcostFormula
    }

    replaceParameterCost(year: number, month: number, formula: string, costParameters: any, costs: any[], costNextYears: any[],
        listMonthCost: any[], costProductType: MasterCostProductTypes, contract: CalmarginRequestDto): string {
        let fullcostFormula: string = '';
        let value: number = 0;
        let nextYear: number = 0;

        fullcostFormula = formula;

        for (const costPram of costParameters) {
            const costData = _.find(costs, (item) => {
                return item.cost === costPram.productName && item.product === costProductType.name &&
                    item.yearValue === contract.yearValue && item.monthValue === contract.monthValue;
            })

            if (contract.yearValue === (year + 1) && contract.monthValue === 1) {

                const refPreviousData = _.find(costs, (item) => {
                    return item.cost === costPram.productName && item.product === costProductType.name &&
                        item.yearValue === year && item.monthValue === 12;
                })

                if (refPreviousData) {
                    value = refPreviousData.value;
                }
            } else if (contract.yearValue === (year + 1) && contract.monthValue > 1) {
                const costNextYearData = _.find(costNextYears, (item) => {
                    return item.cost === costPram.productName && item.product === costProductType.name &&
                        item.yearValue === contract.yearValue && item.monthValue === contract.monthValue;
                })

                if (costNextYearData) {
                    value = costNextYearData.value
                }
            } else if (contract.yearValue === year && contract.monthValue > 1) {
                if (costData) {
                    value = costData.value
                }

            }

            // search current 
            const costTextPrameter = '#' + costPram.parameterName;
            fullcostFormula = _.replace(fullcostFormula, new RegExp(costTextPrameter, "g"), value)

        }

        return fullcostFormula
    }

    replaceParameterReferencePrice(year: number, month: number, formula: string, referencePriceParameters: any,
        referencePrices: any[], referencePriceNextYears: any[], referencePriceLastYears: any[],
        listMonthRef: any[], contract: CalmarginRequestDto): string {
        let referencePriceFormula: string = '';
        let value: number = 0;
        let previousValue: number = 0;
        let refPreviousData: any = {};

        referencePriceFormula = formula;

        for (const refPram of referencePriceParameters) {
            const refData = _.find(referencePrices, (item) => {
                return item.referencePriceNameTo === refPram.name &&
                    item.yearValue === contract.yearValue && item.monthValue === contract.monthValue;
            })

            if (month === 1 && contract.monthValue === 1) {

                if (referencePriceLastYears && referencePriceLastYears.length > 0) {
                    refPreviousData = _.find(referencePriceLastYears, (item) => {
                        return item.referencePriceNameTo === refPram.name &&
                            item.yearValue === (year - 1) && item.monthValue === 12;
                    })

                    if (refPreviousData) {
                        previousValue = refPreviousData.value;
                    }
                }
            }

            if (contract.yearValue === (year + 1) && contract.monthValue === 1) {

                refPreviousData = _.find(referencePrices, (item) => {
                    return item.referencePriceNameTo === refPram.name &&
                        item.yearValue === year && item.monthValue === 12
                })

                if (refPreviousData) {
                    previousValue = refPreviousData.value;
                }
            } else if (contract.yearValue === (year + 1) && contract.monthValue > 1) {

                refPreviousData = _.find(referencePriceNextYears, (item) => {
                    return item.referencePriceNameTo === refPram.name &&
                        item.yearValue === contract.yearValue && item.monthValue === contract.monthValue;

                })

                if (refPreviousData) {
                    previousValue = refPreviousData.value;
                }
            } else if (contract.yearValue === year && contract.monthValue > 1) {
                refPreviousData = _.find(referencePrices, (item) => {
                    return item.referencePriceNameTo === refPram.name && 
                    item.yearValue === contract.yearValue && item.monthValue === (contract.monthValue - 1);

                })

                if (refPreviousData) {
                    previousValue = refPreviousData.value;
                }
            }

            if (refData) {
                value = refData.value
            } else {
                if (contract.yearValue === (year + 1)) {
                    const refNextData = _.find(referencePriceNextYears, (item) => {
                        return item.referencePriceNameTo === refPram.name &&
                            item.yearValue === contract.yearValue && item.monthValue === contract.monthValue;
                    })

                    if (refNextData) {
                        value = refNextData.value;
                    }
                }
            }

            // search previous 
            const refPreviousPrameter = '@' + refPram.parameterName;
            if (refPreviousPrameter === '@' + refPram.parameterFromDb + 'previousM') {
                referencePriceFormula = _.replace(referencePriceFormula, new RegExp(refPreviousPrameter, "g"), previousValue);
            }

            // search current new 
            const refTextNewCurrentPrameter = '@' + refPram.parameterName;
            if (refTextNewCurrentPrameter === '@' + refPram.parameterFromDb) {
                referencePriceFormula = _.replace(referencePriceFormula, new RegExp(refTextNewCurrentPrameter, "g"), value);
            }
        }

        return referencePriceFormula;
    }

    replaceParameterFormulaReferencePrice(formula: string, referencePriceParameters: any): string {
        let referencePriceFormula: string = '';
        let value: string = '';

        referencePriceFormula = formula;

        for (const refPram of referencePriceParameters) {
            value = refPram.name;

            const refTextPrameter = '@' + refPram.parameterName;
            referencePriceFormula = _.replace(referencePriceFormula, new RegExp(refTextPrameter, "g"), value);

        }

        return referencePriceFormula;
    }

    evalFormula(formula: string): number {
        let result: number = 0;

        try {
            result = eval(formula);
        } catch {
            result = 0
        }
        if (!_.isNumber(result)) {
            result = 0;
        }
        // // (formula, result);
        return result;
    }

    getListMonth(year: number, month: number): any {
        let listMonthCost = [];

        let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
        let monthStart = dateStart.month();
        let yearStart = dateStart.year();

        for (let index = 1; index <= 13; index++) {
            const data: any = { Year: yearStart, Month: monthStart + 1, MonthIndexName: 'M' + index, MonthIndex: index }
            listMonthCost.push(data);

            dateStart = dateStart.add(1, 'M');
            monthStart = dateStart.month();
            yearStart = dateStart.year();
        }

        return listMonthCost;
    }

    getFullCostManual(fullCostManuals: FullCostManual[], item: CalmarginRequestDto): Promise<FullCostManual> {
        return new Promise((resolve, rejects) => {
            const fullCostManualData: FullCostManual = _.find(fullCostManuals, (fullCostManual) => {
                return fullCostManual.yearValue == item.yearValue && fullCostManual.monthValue == item.monthValue
            })

            resolve(fullCostManualData);
        });
    }

    getSellingPriceManual(sellingPricesManuals: SellingPricesManual[], item: CalmarginRequestDto): Promise<SellingPricesManual> {
        return new Promise((resolve, reject) => {
            const sellingPricesManualData: SellingPricesManual = _.find(sellingPricesManuals, (sellingPricesManual) => {
                return sellingPricesManual.yearValue == item.yearValue && sellingPricesManual.monthValue == item.monthValue
            })
            resolve(sellingPricesManualData);
        });
    }

    async getVersion(params: any): Promise<CalMarginVersion[]> {
        if (_.toInteger(params.month) >= 0) {
            let dataWhere: any = { year: _.toInteger(params.year), month: _.toInteger(params.month) };
            return await this.dataVersionModel.find({ where: dataWhere, order: { month: 'DESC', version: 'DESC' } });
        }
        else {
            let dataWhere: any = { year: _.toInteger(params.year) };
            return await this.dataVersionModel.find({ where: dataWhere, order: { month: 'DESC', version: 'DESC' } });
        }
    }

    async getFullCostVersion(params: any): Promise<any> {
        let dataWhere: any = { year: params.year, month: params.month, version: params.version };

        return await this.fullcostDataModel.find({ where: dataWhere, order: { month: 'DESC', version: 'DESC' } });
    }

    async getSellingPriceVersion(params: any): Promise<any> {
        let dataWhere: any = { year: params.year, month: params.month, version: params.version };

        return await this.sellingPriceDataModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
    }

    async save(data: CalmarginSaveDto) {
        await getConnection().transaction(async transactionalEntityManager => {

            let version = await transactionalEntityManager.findOne(CalMarginVersion, {
                where: {
                    year: data.year,
                    month: data.month, version: data.version
                }
            });

            if (!version) {
                version = new CalMarginVersion();
                version.createByUserId = data.createByUserId;
                version.createBy = data.createBy;
            }

            version.costProductTypeId = data.costProductTypeId;
            version.costVersionId = data.costVersionId;
            version.referencePriceVersionId = data.referencePriceVersionId;
            version.year = data.year;
            version.month = data.month;
            version.version = data.version;
            version.versionName = data.versionName;
            version.updateByUserId = data.updateByUserId;
            version.updateBy = data.updateBy;
            // // (version);
            if (version.id) {
                await transactionalEntityManager.delete(CalMarginVersion, { id: version.id });
            }
            await transactionalEntityManager.save(CalMarginVersion, version);

            await transactionalEntityManager.delete(FullCostManual, {
                year: data.year,
                month: data.month,
                version: data.version
            });

            if (data.fullCostManuals && data.fullCostManuals.length > 0) {
                await transactionalEntityManager.save(FullCostManual, data.fullCostManuals);
            }

            await transactionalEntityManager.delete(SellingPricesManual, {
                year: data.year,
                month: data.month,
                version: data.version
            });

            if (data.sellingPricesManuals && data.sellingPricesManuals.length > 0) {
                await transactionalEntityManager.save(SellingPricesManual, data.sellingPricesManuals);
            }
        })
    }

    async listData(dateStart, dateEnd): Promise<CalmarginRequestDto[]> {
        const dataList: CalmarginRequestDto[] = [];
        let requestDateText = moment(dateStart).format('YYYY-MM-DD');
        let data: CalmarginRequestDto[] = await this.dataVersionModel.query("exec SP_CONTRACT_GEN_MONTH @0 ", [requestDateText])

        const contracts = _.cloneDeep(data)

        if (contracts && contracts.length > 0) {
            for (const item of contracts) {
                for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
                    const contract = _.cloneDeep(item)
                    const yearIndex = index.year();
                    const monthIndex = index.month() + 1;

                    contract.yearValue = yearIndex;
                    contract.monthValue = monthIndex;
                    contract.fullCostValue = 0;
                    contract.sellingPriceValue = 0;
                    contract.marginPerUnitValue = 0;
                    dataList.push(contract);
                }
            }
        }

        return dataList;
    }

    async listDataToReport(dateStart, dateEnd): Promise<CalmarginRequestDto[]> {
        const dataList: CalmarginReportDto[] = [];
        let requestDateText = moment(dateStart).format('YYYY-MM-DD');
        let data: CalmarginRequestDto[] = await this.dataVersionModel.query("exec SP_CONTRACT_GEN_REPORT @0 ", [requestDateText])

        const contracts = _.cloneDeep(data);

        if (contracts && contracts.length > 0) {
            for (const item of contracts) {
                for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
                    const contract = _.cloneDeep(item)
                    const yearIndex = index.year();
                    const monthIndex = index.month() + 1;

                    contract.yearValue = yearIndex;
                    contract.monthValue = monthIndex;
                    contract.fullCostValue = 0;
                    contract.sellingPriceValue = 0;
                    contract.marginPerUnitValue = 0;
                    dataList.push(contract);
                }
            }
        }

        return dataList;
    }

    async listContract(dateRequest): Promise<CalmarginContractDto[]> {
        let requestDateText = moment(dateRequest).format('YYYY-MM-DD');
        let data: CalmarginContractDto[] = await this.dataVersionModel.query("exec SP_CONTRACT_GEN_ONLY @0 ", [requestDateText])

        return data;
    }

    async getVersionByYear(params: any): Promise<any> {
        return await this.dataVersionModel.find({ where: [params], order: { month: 'DESC', version: 'DESC' } });
    }

    async getVersionById(params: any): Promise<CalMarginVersion> {
        return await this.dataVersionModel.findOne({
            where: [{ id: params.versionId }]
        });
    }

    async getVersionByIds(id: any) {
        return await this.dataVersionModel.findOne({
            where: [{ id: id }]
        });
    }
}