import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { OptimizationsService } from 'src/app/service/optimizations.service';
import { SignatureService } from 'src/app/service/signature.service';

@Component({
  selector: 'app-distribution-plan-report',
  templateUrl: './distribution-plan-report.component.html',
  styleUrls: ['./distribution-plan-report.component.css'],
})
export class DistributionPlanReportComponent implements OnInit {

  year: any;
  month: any;
  listMonth = [];
  dataInfo: any = [];
  mergeAlloId:any = null;
  mergeAlloVersion:any = [];
  mergeAlloVersionList: any = [];
  signatureList: any = [];
  mergeAlloC2List: any = [];
  mergeAlloC3LpgList: any = [];
  mergeAlloNGLList: any = [];
  mergeAlloPentaneList: any = [];

  formatMonthName = 'MMM-yyyy';

  monthNamesThai = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤษจิกายน",
    "ธันวาคม"
  ];

  constructor(
    private optimizationsService: OptimizationsService,
    private signatureService: SignatureService,
  ) {}

  ngOnInit(): void {

    this.dataInfo.to = 'ผจจ.อบต., ผจจ.กกน.';
    this.dataInfo.cc = 'ผจจ.ยยน';
    this.dataInfo.docNo = 'ตน.นน 18/2564';

  }

  retrieveMasterData(): Observable<any> {
    const optimizationsVersion = this.optimizationsService.getMonthVersion(this.year, this.month);
    const signatureList = this.signatureService.getList();
    return forkJoin([optimizationsVersion, signatureList]);
  }

  retrieveDataAbility(): Observable<any> {
    //Get Merge Allo C2
    const optimizationsC2 = this.optimizationsService.getList(this.year, this.month, this.mergeAlloVersion?.version, 0);
    //Get Merge Allo C3/LPG
    const optimizationsC3Lpg = this.optimizationsService.getListC3Lpg(this.year, this.month, this.mergeAlloVersion?.version, 0);
    //Get Merge Allo NGL
    const optimizationsNGL = this.optimizationsService.getListNgl(this.year, this.month, this.mergeAlloVersion?.version, 0);
    //Get Merge Allo Pentane
    const optimizationsPentane = this.optimizationsService.getListPantane(this.year, this.month, this.mergeAlloVersion?.version, 0);
    
    return forkJoin([ 
      optimizationsC2, 
      optimizationsC3Lpg,
      optimizationsNGL,
      optimizationsPentane
    ]);
  }

  onYearChange(
    year: any,
    month: any,
    callback?: any
  ) {

    this.year = year;
    this.month = month;

    this.mergeAlloVersionList = [];

    //Set Month Start
    this.listMonth = [];
    let dateStart = moment(this.year + '-' + this.month + '-01');
    // let dateStart = moment(dataAbilityRayong[0].yearValue + '-' + dataAbilityRayong[0].monthValue + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    dateStart = dateStart.add(1, 'M');
    for (let index = 1; index <= 12; index++) {
      const data: any = {
        year: yearStart,
        month: monthStart,
        dataField: 'M' + monthStart + yearStart,
        MonthName: dateStart.format(this.formatMonthName),
      };
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    this.retrieveMasterData().subscribe(res => {
      console.log("res > ", res);
      this.mergeAlloVersionList = res[0];
      this.signatureList = _.filter(_.cloneDeep(res[1]), { activeStatus: 'Active'});
    });
    
  }

  dateChanged() {
  }

  getThaiDate(){
    // const date = moment();
    var date = new Date();
    let dateNum = (date.getDate() > 20 ? 20 : date.getDate());
    if(dateNum == 20 && date.getDay() == 6){
      dateNum = (dateNum-1);
    }else if(dateNum == 20 && date.getDay() == 7){
      dateNum = (dateNum-2);
    }
    let thaiDate =  dateNum + ' ' + this.monthNamesThai[(date.getMonth())] + ' ' + (date.getFullYear() + 543);

    return thaiDate;
  }

  displayVersion(item: any) {
    if (item) {
      return `${item.versionName}`;
    } else {
      return '';
    }
  }

  displaySignature(item: any) {
    if (item) {
      return `${item.firstName + ' ' + item.lastName + ' (' + item.positionName + ')'}`;
    } else {
      return '';
    }
  }

  onAccept(evevt: any, callback?: any) {
    this.mergeAlloVersion = this.mergeAlloVersionList.find((obj) => {
      return obj.id == this.mergeAlloId;
    });

    this.retrieveDataAbility().subscribe(res => {
      console.log("res DataAbility > ", res);
      this.mergeAlloC2List = res[0];
      this.mergeAlloC3LpgList = res[1];
      this.mergeAlloNGLList = res[2];
      this.mergeAlloPentaneList = res[3];
    });
  }

  getWorkSheet(workbook: Workbook){

    const signatureby = _.find(_.cloneDeep(this.signatureList), { id: this.dataInfo.signatureId});
    const approveby = _.find(_.cloneDeep(this.signatureList), { id: this.dataInfo.approveId});

    let worksheet = workbook.addWorksheet('แผนจำหน่าย');

    const headerRow1 = [];
    headerRow1.push('เรียน ' + this.dataInfo.to);
    headerRow1.push('');
    headerRow1.push('');
    headerRow1.push('แผนจัดจำหน่ายผลิตภัณฑ์');
    headerRow1.push('');
    headerRow1.push('');
    headerRow1.push('');
    headerRow1.push('');
    headerRow1.push('');
    headerRow1.push('เลขที่ ' + this.dataInfo.docNo);
    headerRow1.push('');
    headerRow1.push('');
    headerRow1.push('');
    headerRow1.push('');
    headerRow1.push('');
    let title1 = worksheet.addRow(headerRow1);
    const rowNum1 = title1['_number'];
    worksheet.mergeCells('A'+rowNum1+':C'+rowNum1);
    worksheet.mergeCells('D'+rowNum1+':I'+rowNum1);
    worksheet.mergeCells('J'+rowNum1+':O'+rowNum1);

    const headerRow2 = [];
    headerRow2.push('สำเนา ' + this.dataInfo.cc);
    headerRow2.push('');
    headerRow2.push('');
    headerRow2.push('ประจำเดือน' + this.monthNamesThai[this.month-1] + ' ' + (this.year+543));
    headerRow2.push('');
    headerRow2.push('');
    headerRow2.push('');
    headerRow2.push('');
    headerRow2.push('');
    headerRow2.push('วันที่ ' + this.getThaiDate());
    headerRow2.push('');
    headerRow2.push('');
    headerRow2.push('');
    headerRow2.push('');
    headerRow2.push('');
    let title2 = worksheet.addRow(headerRow2);
    const rowNum2 = title2['_number'];
    worksheet.mergeCells('A'+rowNum2+':C'+rowNum2);
    worksheet.mergeCells('D'+rowNum2+':I'+rowNum2);
    worksheet.mergeCells('J'+rowNum2+':O'+rowNum2);

    const headerRow3 = [];
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('รับรองโดย');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    headerRow3.push('');
    let title3 = worksheet.addRow(headerRow3);
    const rowNum3 = title3['_number'];
    worksheet.mergeCells('A'+rowNum3+':C'+rowNum3);
    worksheet.mergeCells('D'+rowNum3+':I'+rowNum3);
    worksheet.mergeCells('J'+rowNum3+':O'+rowNum3);

    

    const headerRow4 = [];
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');//ลายเซ็น
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');//ลายเซ็น
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');
    headerRow4.push('');
    let title4 = worksheet.addRow(headerRow4);
    const rowNum4 = title4['_number'];
    worksheet.mergeCells('A'+rowNum4+':C'+rowNum4);
    worksheet.mergeCells('D'+rowNum4+':I'+rowNum4);
    worksheet.mergeCells('J'+rowNum4+':O'+rowNum4);

    const imageSignature = workbook.addImage({
      base64: signatureby.signatureImg,
      extension: 'png',
    });
    worksheet.addImage(imageSignature, 'D'+rowNum4+':E'+rowNum4);

    const imageSignatureApprove = workbook.addImage({
      base64: approveby.signatureImg,
      extension: 'png',
    });
    worksheet.addImage(imageSignatureApprove, 'J'+rowNum4+':K'+rowNum4);

    const headerRow5 = [];
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('(' + signatureby.firstName + ' ' + signatureby.lastName + ')');
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('(' + approveby.firstName + ' ' + approveby.lastName + ')');
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('');
    headerRow5.push('');
    let title5 = worksheet.addRow(headerRow5);
    const rowNum5 = title5['_number'];
    worksheet.mergeCells('A'+rowNum5+':C'+rowNum5);
    worksheet.mergeCells('D'+rowNum5+':I'+rowNum5);
    worksheet.mergeCells('J'+rowNum5+':O'+rowNum5);

    const headerRow6 = [];
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push(signatureby.positionName);
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push(approveby.positionName);
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push('');
    headerRow6.push('');
    let title6 = worksheet.addRow(headerRow6);
    const rowNum6 = title6['_number'];
    worksheet.mergeCells('A'+rowNum6+':C'+rowNum6);
    worksheet.mergeCells('D'+rowNum6+':I'+rowNum6);
    worksheet.mergeCells('J'+rowNum6+':O'+rowNum6);
    

    /// Data Ethane (KT) ///
    let ethaneKt1 = worksheet.addRow(['1. Ethane (KT)']);
    const rowNumethaneKt1 = ethaneKt1['_number'];
    worksheet.mergeCells('A'+rowNumethaneKt1+':O'+rowNumethaneKt1);
    ethaneKt1.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
      }
    });

    const dataRowEthaneKTHeader: any = ["ลูกค้า","",""];

    _.each(this.listMonth, (data,index) => {
      dataRowEthaneKTHeader.push(data.MonthName);
    });

    let rowDataEthaneKTHeader = worksheet.addRow(dataRowEthaneKTHeader);
    const rowNumethaneKtHeader = rowDataEthaneKTHeader['_number'];
    worksheet.mergeCells('A'+rowNumethaneKtHeader+':C'+rowNumethaneKtHeader);
    rowDataEthaneKTHeader.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FAFAFA' },
      }
    });

    // ข้อมูล Demand C2 ของ GC จาก Merge Allocation ในหน่วย KT
    let GCKT = _.filter(_.cloneDeep(this.mergeAlloC2List), { productionGroup: "dataListGC", 'unit': "KT"});
    let dataPrductGCKT = _.groupBy(GCKT, "production" )

    // console.log('GCKT',GCKT);
    // console.log('dataPrductGCKT',dataPrductGCKT);

    let dataAllEthaneKT = [];

    _.each(dataPrductGCKT, (data,index) => {
      const dataRow = [index,'GC',''];
      _.each(this.listMonth, (dataMonth,indexMonth) => {

        const findData = _.find(data, x => {
          return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
        });
        dataRow.push((findData?.value ? findData?.value : 0));

      });
      let rowData = worksheet.addRow(dataRow);
      const rowNum = rowData['_number'];
      worksheet.mergeCells('B'+rowNum+':C'+rowNum);
      dataAllEthaneKT.push(dataRow);
    });

    // ข้อมูล Demand C2 ของ SCG จาก Merge Allocation ในหน่วย KT
    let SCGKT = _.filter(_.cloneDeep(this.mergeAlloC2List), { productionGroup: "dataListSCG", 'unit': "KT"});
    let dataPrductSCGKT = _.groupBy(SCGKT, "production" )

    _.each(dataPrductSCGKT, (data,index) => {
      const dataRow = [index,'SCG',''];
      _.each(this.listMonth, (dataMonth,indexMonth) => {

        const findData = _.find(data, x => {
          return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
        });
        dataRow.push((findData?.value ? findData?.value : 0));
        
      });
      let rowData = worksheet.addRow(dataRow);
      const rowNum = rowData['_number'];
      worksheet.mergeCells('B'+rowNum+':C'+rowNum);
      dataAllEthaneKT.push(dataRow);
    });

    // console.log('dataAllDemand',dataAllDemand);

    const dataRowTotalDemand: any = ["Total",'',''];

    _.each(this.listMonth, (dataMonth,indexMonth) => {

      let sumTotal = 0;

      _.each(dataAllEthaneKT, (data,Index) => {
        sumTotal += (data[(indexMonth+2)] ? data[(indexMonth+2)] : 0);
      });

      dataRowTotalDemand.push(sumTotal);
    });

    let rowDataTotalDemand = worksheet.addRow(dataRowTotalDemand);
    const rowNum = rowDataTotalDemand['_number'];
    worksheet.mergeCells('A'+rowNum+':C'+rowNum);
    rowDataTotalDemand.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F5F5F5' },
      }
    });
    // ------------------ END ------------------- \\

    /// Data Propane/LPG (KT) ///
    let propaneKt2 = worksheet.addRow(['2. Propane/LPG (KT)']);
    const rowNumpropaneKt2 = propaneKt2['_number'];
    worksheet.mergeCells('A'+rowNumpropaneKt2+':O'+rowNumpropaneKt2);
    propaneKt2.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
      }
    });
    
    const dataRowPropaneKtHeader: any = ["ลูกค้า","",""];

    _.each(this.listMonth, (data,index) => {
      dataRowPropaneKtHeader.push(data.MonthName);
    });

    let rowDataPropaneKTHeader = worksheet.addRow(dataRowPropaneKtHeader);
    const rowNumePropaneKtHeader = rowDataPropaneKTHeader['_number'];
    worksheet.mergeCells('A'+rowNumePropaneKtHeader+':C'+rowNumePropaneKtHeader);
    rowDataPropaneKTHeader.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FAFAFA' },
      }
    });

    let demandAllo = _.orderBy(_.filter(_.cloneDeep(this.mergeAlloC3LpgList),{productionGroup: 'dataListDemand'}),['ASC']);
    const demandAllobyCustomerType = _.groupBy(demandAllo, 'customerType');

    // console.log('demandAllobyCustomerType',demandAllobyCustomerType);

    let dataAllPropaneKTGC = [];
    _.each(demandAllobyCustomerType, (data,index) => {
      let dataRow = [];
      let dataAllPropaneKT = [];
      const dataGroupby = _.groupBy(data, (item) => {
        return [item['source'], item['demand'], item['deliveryPoint']];
      });

      // console.log(index,dataGroupby);

      _.each(dataGroupby, (dataGB,indexGB) => {

        // console.log('dataGB',dataGB[0].source);

        var nameArr = indexGB.split(',');
        dataRow.push(nameArr[0]);
        dataRow.push(nameArr[1]);
        dataRow.push(nameArr[2]);
        // console.log('dataGB',dataGB);
        _.each(this.listMonth, (dataMonth,indexMonth) => {
          const findGB = _.find(dataGB, x => {
            return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
          });
          dataRow.push((findGB?.value ? findGB?.value : 0));
        });

        let rowData = worksheet.addRow(dataRow);
        dataAllPropaneKT.push(rowData);
        if(dataGB[0].source == 'GC'){
          dataAllPropaneKTGC.push(rowData);
        }
        dataRow = [];
        
      });

      const dataRowTotal: any = ["Total",'',''];

      _.each(this.listMonth, (dataMonth,indexMonth) => {

        let sumTotal = 0;

        _.each(dataAllPropaneKT, (data,Index) => {
          sumTotal += (data[(indexMonth+2)] ? data[(indexMonth+2)] : 0);
        });

        dataRowTotal.push(sumTotal);
      });

      let rowDataTotal = worksheet.addRow(dataRowTotal);
      const rowNum = rowDataTotal['_number'];
      worksheet.mergeCells('A'+rowNum+':C'+rowNum);
      rowDataTotal.eachCell((cell, number) => {
        cell.font = {
          bold: true
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F5F5F5' },
        }
      });

    });
    
    const dataRowTotal: any = ["Total-GC",'',''];

      _.each(this.listMonth, (dataMonth,indexMonth) => {

        let sumTotal = 0;

        _.each(dataAllPropaneKTGC, (data,Index) => {
          sumTotal += (data[(indexMonth+2)] ? data[(indexMonth+2)] : 0);
        });

        dataRowTotal.push(sumTotal);
      });

      let rowDataTotalGC = worksheet.addRow(dataRowTotal);
      const rowNumTotalGC = rowDataTotalGC['_number'];
      worksheet.mergeCells('A'+rowNumTotalGC+':C'+rowNumTotalGC);
      rowDataTotalGC.eachCell((cell, number) => {
        cell.font = {
          bold: true
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F5F5F5' },
        }
      });
    // ------------------ END ------------------- \\

    /// Data NGL (Km3) ///
    let nglKm3 = worksheet.addRow(['3. NGL (Km3)']);
    const rowNumnglKm3 = nglKm3['_number'];
    worksheet.mergeCells('A'+rowNumnglKm3+':O'+rowNumnglKm3);
    nglKm3.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
      }
    });

    const dataRowNglKm3Header: any = ["ลูกค้า","",""];

    _.each(this.listMonth, (data,index) => {
      dataRowNglKm3Header.push(data.MonthName);
    });

    let rowDataNglKm3Header = worksheet.addRow(dataRowNglKm3Header);
    const rowNumeNglKm3Header = rowDataNglKm3Header['_number'];
    worksheet.mergeCells('A'+rowNumeNglKm3Header+':C'+rowNumeNglKm3Header);
    rowDataNglKm3Header.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FAFAFA' },
      }
    });

    // ข้อมูล Demand NGL จาก Merge Allocation
    let nglDemand = _.filter(_.cloneDeep(this.mergeAlloNGLList), { productionGroup: "dataListDemandOut0" });
    let dataPrductnglDemand = _.groupBy(nglDemand, "production" );

    let dataRowNglDemand = [];
    let dataAllNGL = [];

    _.each(dataPrductnglDemand, (data,index) => {
      dataRowNglDemand = [index,'',''];
      _.each(this.listMonth, (dataMonth,indexMonth) => {

        const findData = _.find(data, x => {
          return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
        });
        dataRowNglDemand.push((findData?.value ? findData?.value : 0));

      });
      let rowDataNGLDemand = worksheet.addRow(dataRowNglDemand);
      dataAllNGL.push(dataRowNglDemand);
      const rowNumeNglDemand = rowDataNGLDemand['_number'];
      worksheet.mergeCells('A'+rowNumeNglDemand+':C'+rowNumeNglDemand);
    });

    const dataRowTotalNgl: any = ["Total",'',''];

    _.each(this.listMonth, (dataMonth,indexMonth) => {

      let sumTotal = 0;

      _.each(dataAllNGL, (data,Index) => {
        sumTotal += (data[(indexMonth+2)] ? data[(indexMonth+2)] : 0);
      });

      dataRowTotalNgl.push(sumTotal);
    });

    let rowDataTotalNgl = worksheet.addRow(dataRowTotalNgl);
    const rowNumTotalNgl = rowDataTotalNgl['_number'];
    worksheet.mergeCells('A'+rowNumTotalNgl+':C'+rowNumTotalNgl);
    rowDataTotalNgl.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F5F5F5' },
      }
    });
    // ------------------ END ------------------- \\

    /// Data Pentane (KT) ///
    let pentaneKt4 = worksheet.addRow(['4. Pentane (KT)']);
    const rowNumpentaneKt4 = pentaneKt4['_number'];
    worksheet.mergeCells('A'+rowNumpentaneKt4+':O'+rowNumpentaneKt4);
    pentaneKt4.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EEEEEE' },
      }
    });

    const dataRowPentaneKTHeader: any = ["ลูกค้า","",""];

    _.each(this.listMonth, (data,index) => {
      dataRowPentaneKTHeader.push(data.MonthName);
    });

    let rowDataPentaneKTHeader = worksheet.addRow(dataRowPentaneKTHeader);
    const rowNumePentaneKTHeader = rowDataPentaneKTHeader['_number'];
    worksheet.mergeCells('A'+rowNumePentaneKTHeader+':C'+rowNumePentaneKTHeader);
    rowDataPentaneKTHeader.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FAFAFA' },
      }
    });


    // Merge Allo Pentane
    const MergeAlloPentaneList = _.groupBy(this.mergeAlloPentaneList, 'production');

    // console.log('MergeAlloPentaneList',MergeAlloPentaneList);

    let dataRowMergeAlloPentane = [];
    let dataAllPentane = [];

    _.each(MergeAlloPentaneList, (data,index) => {
      dataRowMergeAlloPentane.push(index,'','');

      _.each(this.listMonth, (dataMonth,indexMonth) => {
        const findGB = _.find(data, x => {
          return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
        });
        dataRowMergeAlloPentane.push((findGB?.value ? findGB?.value : 0));
      });

      let rowDataPentane = worksheet.addRow(dataRowMergeAlloPentane);
      dataAllPentane.push(dataRowNglDemand);
      const rowNumPentane = rowDataPentane['_number'];
      worksheet.mergeCells('A'+rowNumPentane+':C'+rowNumPentane);
      dataRowMergeAlloPentane = [];
    });

    const dataRowTotalPentane: any = ["Total",'',''];

    _.each(this.listMonth, (dataMonth,indexMonth) => {

      let sumTotal = 0;

      _.each(dataAllPentane, (data,Index) => {
        sumTotal += (data[(indexMonth+2)] ? data[(indexMonth+2)] : 0);
      });

      dataRowTotalPentane.push(sumTotal);
    });

    let rowDataTotalPentane = worksheet.addRow(dataRowTotalPentane);
    const rowNumTotalPentane = rowDataTotalPentane['_number'];
    worksheet.mergeCells('A'+rowNumTotalPentane+':C'+rowNumTotalPentane);
    rowDataTotalPentane.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F5F5F5' },
      }
    });
    // ------------------ END ------------------- \\

    ///  Remark ///
    let remark = worksheet.addRow([this.dataInfo.remark]);
    const rowNumRemark = remark['_number'];
    worksheet.mergeCells('A'+rowNumRemark+':O'+rowNumRemark);
    // ------------------ END ------------------- \\

  }
}
