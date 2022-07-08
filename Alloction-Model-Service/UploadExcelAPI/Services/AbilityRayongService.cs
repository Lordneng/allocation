using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OfficeOpenXml;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Services
{
    public class AbilityRayongService : IAbilityRayongService
    {
        
        private readonly ILogger<AbilityRayongService> _logger;

        public AbilityRayongService(ILogger<AbilityRayongService> logger)
        {
            _logger = logger;
        }

        private string ErrMessage;

        public ResponseAbilityRayong ImportAbilityRayong(IFormFile fileInput, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            string fileInputName = fileInput.FileName.Replace(".xlsx", DateTime.Now.ToString("_yyyyMMdd_HHmmsss") + ".xlsx");
            string fileName = $"{hostingEnvironment.ContentRootPath}\\FileUpload\\AbilityRayong\\{fileInputName}";
            string returnPath = "FileUpload/AbilityRayong/" + fileInputName;
            var ResponseExcelData = new ResponseAbilityRayong();

            try
            {
                using (FileStream fileStream = File.Create(fileName))
                {
                    fileInput.CopyTo(fileStream);
                    fileStream.Flush();
                }
                ResponseExcelData = ReadExcel(fileInputName, returnPath);
            }
            catch (Exception ex)
            {
                ResponseExcelData.errCode = "404";
                ResponseExcelData.errDesc = ex.Message;

                //_logger.LogError("Error -> UploadExcelCostService -> UploadExcelCost -> Excption: {0}", ex.Message);
            }

            return ResponseExcelData;
        }

        private ResponseAbilityRayong ReadExcel(string fName, string returnPath)
        {
            var fileName = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\AbilityRayong\"}" + fName;
            var ExcelData = new ResponseAbilityRayong();

            try
            {
                if (CheckFileFormat(fileName))
                {
                    //ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using (var excelPack = new ExcelPackage())
                    {
                        //Load excel stream
                        using (var stream = File.OpenRead(fileName))
                        {
                            excelPack.Load(stream);
                        }

                        //Lets Deal with first worksheet.(You may iterate here if dealing with multiple sheets)
                        var ws = excelPack.Workbook.Worksheets[0];

                        ExcelData = new ResponseAbilityRayong
                        {
                            path = returnPath,
                            startDate = DateFomat(ws.Cells[3, 7].Value + string.Empty)
                        };
                        ExcelData.fileName = fName;
                        var ExcelData_items = ExcelData.ability = new List<AbilityItems>();
                        var ExcelData_monthNow = ExcelData.monthNow = new List<dynamic>();
                        var ExcelData_p1 = ExcelData.p1 = new List<dynamic>();
                        var ExcelData_p2 = ExcelData.p2 = new List<dynamic>();
                        var ExcelData_p3 = ExcelData.p3 = new List<dynamic>();
                        var ExcelData_p4 = ExcelData.p4 = new List<dynamic>();
                        var ExcelData_p5 = ExcelData.p5 = new List<dynamic>();
                        var ExcelData_p6 = ExcelData.p6 = new List<dynamic>();
                        var ExcelData_p7 = ExcelData.p7 = new List<dynamic>();
                        var ExcelData_p8 = ExcelData.p8 = new List<dynamic>();
                        var ExcelData_p9 = ExcelData.p9 = new List<dynamic>();
                        var ExcelData_p10 = ExcelData.p10 = new List<dynamic>();
                        var ExcelData_p11 = ExcelData.p11 = new List<dynamic>();
                        var ExcelData_p12 = ExcelData.p12 = new List<dynamic>();

                        int orderRows = 1;

                        //Row 36 Data date
                        var items = new AbilityItems
                        {
                            rowOrder = orderRows++.ToString(),
                            productHeadder = (ws.Cells[36, 2].Value + string.Empty).Trim(),
                            product = (ws.Cells[36, 2].Value + string.Empty).Trim(),
                            M1 = DateFomat(ws.Cells[36, 4].Value + string.Empty),
                            M2 = DateFomat(ws.Cells[36, 5].Value + string.Empty),
                            M3 = DateFomat(ws.Cells[36, 6].Value + string.Empty),
                            M4 = DateFomat(ws.Cells[36, 7].Value + string.Empty),
                            M5 = DateFomat(ws.Cells[36, 8].Value + string.Empty),
                            M6 = DateFomat(ws.Cells[36, 9].Value + string.Empty),
                            M7 = DateFomat(ws.Cells[36, 10].Value + string.Empty),
                            M8 = DateFomat(ws.Cells[36, 11].Value + string.Empty),
                            M9 = DateFomat(ws.Cells[36, 12].Value + string.Empty),
                            M10 = DateFomat(ws.Cells[36, 13].Value + string.Empty),
                            M11 = DateFomat(ws.Cells[36, 14].Value + string.Empty),
                            M12 = DateFomat(ws.Cells[36, 15].Value + string.Empty)
                        };

                        //items.Remark 

                        ExcelData_items.Add(items);

                        string productHeader = "";
                        for (var Rows = 37; Rows < 77; Rows++)
                        {
                            switch (Rows)
                            {
                                case 37:
                                    productHeader = "C2"; //Ethane (KTON)
                                    break;
                                case 46:
                                    productHeader = "Propane&Butane&LPG (KTON)";
                                    break;
                                case 47:
                                    productHeader = "C3";
                                    break;
                                case 53:
                                    productHeader = "LPG";
                                    break;
                                case 64:
                                    productHeader = "C3/LPG";
                                    break;
                                case 70:
                                    productHeader = "NGL";
                                    break;
                            }

                            items = new AbilityItems
                            {
                                rowOrder = orderRows++.ToString(),
                                productHeadder = productHeader,
                                product = (ws.Cells[Rows, 2].Value + string.Empty).Trim(),
                                M1 = ws.Cells[Rows, 4].Value + string.Empty,
                                M2 = ws.Cells[Rows, 5].Value + string.Empty,
                                M3 = ws.Cells[Rows, 6].Value + string.Empty,
                                M4 = ws.Cells[Rows, 7].Value + string.Empty,
                                M5 = ws.Cells[Rows, 8].Value + string.Empty,
                                M6 = ws.Cells[Rows, 9].Value + string.Empty,
                                M7 = ws.Cells[Rows, 10].Value + string.Empty,
                                M8 = ws.Cells[Rows, 11].Value + string.Empty,
                                M9 = ws.Cells[Rows, 12].Value + string.Empty,
                                M10 = ws.Cells[Rows, 13].Value + string.Empty,
                                M11 = ws.Cells[Rows, 14].Value + string.Empty,
                                M12 = ws.Cells[Rows, 15].Value + string.Empty
                            };
                            ExcelData_items.Add(items);
                        }

                        for (var Rows = 37; Rows < 77; Rows++)
                        {
                            switch (Rows)
                            {
                                case 37:
                                    productHeader = "C2"; //Ethane (KTON)
                                    break;
                                case 46:
                                    productHeader = "Propane&Butane&LPG (KTON)";
                                    break;
                                case 47:
                                    productHeader = "C3";
                                    break;
                                case 53:
                                    productHeader = "LPG";
                                    break;
                                case 64:
                                    productHeader = "C3/LPG";
                                    break;
                                case 70:
                                    productHeader = "NGL";
                                    break;
                            }

                            items = new AbilityItems
                            {
                                rowOrder = orderRows++.ToString(),
                                productHeadder = productHeader,
                                product = (ws.Cells[Rows, 2].Value + string.Empty).Trim(),
                                M1 = ws.Cells[Rows, 4].Value + string.Empty,
                                M2 = ws.Cells[Rows, 5].Value + string.Empty,
                                M3 = ws.Cells[Rows, 6].Value + string.Empty,
                                M4 = ws.Cells[Rows, 7].Value + string.Empty,
                                M5 = ws.Cells[Rows, 8].Value + string.Empty,
                                M6 = ws.Cells[Rows, 9].Value + string.Empty,
                                M7 = ws.Cells[Rows, 10].Value + string.Empty,
                                M8 = ws.Cells[Rows, 11].Value + string.Empty,
                                M9 = ws.Cells[Rows, 12].Value + string.Empty,
                                M10 = ws.Cells[Rows, 13].Value + string.Empty,
                                M11 = ws.Cells[Rows, 14].Value + string.Empty,
                                M12 = ws.Cells[Rows, 15].Value + string.Empty
                            };
                            ExcelData_items.Add(items);
                        }

                        var checkRemark = true;
                        var row = 78;
                        var rowNo = 1;
                        var rowRemark = 0;
                        var rowRemarkEnd = 0;
                        var maxRow = 50;
                        var cellRemarks = ws.Cells["1:300"];

                        var cellRemark = cellRemarks.Last(c => c.Value?.ToString().ToUpper().Contains("REMARK") ?? false);

                        if (cellRemark != null)
                        {
                            rowRemark = cellRemark.Start.Row;
                        }
                        var cellRemarkEnd = cellRemarks.First(c => c.Value?.ToString().ToUpper().Contains("จัดทำโดย") ?? false);

                        if (cellRemarkEnd != null)
                        {
                            rowRemarkEnd = cellRemarkEnd.Start.Row;
                        }
                        if (rowRemark > 0)
                        {
                            checkRemark = true;
                            for (int i = rowRemark; i < rowRemarkEnd; i++)
                            {
                                var Data = ws.Cells[i, 3].Value + string.Empty;

                                if (!string.IsNullOrEmpty(Data))
                                {
                                    ExcelData.Remark += $"{Data} \n";
                                }
                            }
                        }


                        // month now
                        #region month now
                        var orderRowsMonthNow = 1;
                        var monthNowSheet = excelPack.Workbook.Worksheets[1];
                        var dateMonthNow = Convert.ToDateTime(ExcelData.startDate).AddMonths(-1);
                        var firstDayOfmonthNow = new DateTime(dateMonthNow.Year, dateMonthNow.Month, 1);
                        var dayOfmonth = DateTime.DaysInMonth(dateMonthNow.Year, dateMonthNow.Month) + 4;
                        //var query3 = from cell in monthNowSheet.Cells["d:d"] where cell.Value?.ToString().ToUpper() == ProductNameExcal.Ethane.Value select cell;
                        var cells = monthNowSheet.Cells["1:4"];

                        #region Ethane
                        var cellEthane = cells.First(c => c.Value?.ToString().ToUpper() == ProductNameExcal.Ethane.Value);
                        string ProductName = "";
                        int rowProduct = 2, cellProduct = 8;
                        
                        if (cellEthane != null)
                        {
                            ProductName = cellEthane.Value?.ToString();
                            rowProduct = cellEthane.Start.Row;
                            cellProduct = cellEthane.Start.Column;
                        }
                        //  + 7 คือ จำนวน โรงใน emun
                        var cellRef = monthNowSheet.Cells[rowProduct + 1, cellProduct, rowProduct + 1, cellProduct + 7];
                        var cellEthaneGSP1 = cellRef.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP1.Value);
                        var cellEthaneGSP2 = cellRef.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP2.Value);
                        var cellEthaneGSP3 = cellRef.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP3.Value);
                        var cellEthaneESP = cellRef.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.ESP.Value);
                        var cellEthaneGSP5 = cellRef.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP5.Value);
                        var cellEthaneGSP6 = cellRef.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP6.Value);
                        var cellEthaneTOTAL = cellRef.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.TOTAL.Value);
                        var cellEthaneAVG = cellRef.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.AVG.Value);

                        int _cellEthaneGSP1 = 0,
                            _cellEthaneGSP2 = 0,
                            _cellEthaneGSP3 = 0,
                            _cellEthaneESP = 0,
                            _cellEthaneGSP5 = 0,
                            _cellEthaneGSP6 = 0,
                            _cellEthaneTOTAL = 0,
                            _cellEthaneAVG = 0;

                        _cellEthaneGSP1 = (cellEthaneGSP1 != null ? cellEthaneGSP1.Start.Column : 0);
                        _cellEthaneGSP2 = (cellEthaneGSP2 != null ? cellEthaneGSP2.Start.Column : 0);
                        _cellEthaneGSP3 = (cellEthaneGSP3 != null ? cellEthaneGSP3.Start.Column : 0);
                        _cellEthaneESP = (cellEthaneESP != null ? cellEthaneESP.Start.Column : 0);
                        _cellEthaneGSP5 = (cellEthaneGSP5 != null ? cellEthaneGSP5.Start.Column : 0);
                        _cellEthaneGSP6 = (cellEthaneGSP6 != null ? cellEthaneGSP6.Start.Column : 0);
                        _cellEthaneTOTAL = (cellEthaneTOTAL != null ? cellEthaneTOTAL.Start.Column : 0);
                        _cellEthaneAVG = (cellEthaneAVG != null ? cellEthaneAVG.Start.Column : 0);

                        #endregion

                        #region C3LPG
                        var cellC3Lpg = cells.First(c => c.Value?.ToString().ToUpper() == ProductNameExcal.C3_LPG.Value);
                        int rowProductC3Lpg = 0, cellProductC3Lpg = 0;

                        if (cellC3Lpg != null)
                        {
                            rowProductC3Lpg = cellC3Lpg.Start.Row;
                            cellProductC3Lpg = cellC3Lpg.Start.Column;
                        }
                        //  + 5 คือ จำนวน โรงใน emun
                        var cellC3LpgRef = monthNowSheet.Cells[rowProductC3Lpg + 1, cellProductC3Lpg, rowProductC3Lpg + 1, cellProductC3Lpg + 5];
                        var cellC3LpgGSP1 = cellC3LpgRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP1.Value);
                        var cellC3LpgGSP2 = cellC3LpgRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP2.Value);
                        var cellC3LpgGSP3 = cellC3LpgRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP3.Value);
                        var cellC3LpgGSP5 = cellC3LpgRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP5.Value);
                        var cellC3LpgGSP6 = cellC3LpgRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP6.Value);
                        var cellC3LpgTOTAL = cellC3LpgRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.TOTAL.Value);

                        int _cellC3LpgGSP1 = 0,
                            _cellC3LpgGSP2 = 0,
                            _cellC3LpgGSP3 = 0,
                            _cellC3LpgGSP5 = 0,
                            _cellC3LpgGSP6 = 0,
                            _cellC3LpgTOTAL = 0;

                        _cellC3LpgGSP1 = (cellC3LpgGSP1 != null ? cellC3LpgGSP1.Start.Column : 0);
                        _cellC3LpgGSP2 = (cellC3LpgGSP2 != null ? cellC3LpgGSP2.Start.Column : 0);
                        _cellC3LpgGSP3 = (cellC3LpgGSP3 != null ? cellC3LpgGSP3.Start.Column : 0);
                        _cellC3LpgGSP5 = (cellC3LpgGSP5 != null ? cellC3LpgGSP5.Start.Column : 0);
                        _cellC3LpgGSP6 = (cellC3LpgGSP6 != null ? cellC3LpgGSP6.Start.Column : 0);
                        _cellC3LpgTOTAL = (cellC3LpgTOTAL != null ? cellC3LpgTOTAL.Start.Column : 0);

                        #endregion

                        #region NGL
                        var cellNGL = cells.First(c => c.Value?.ToString().ToUpper() == ProductNameExcal.NGL.Value);
                        int rowProductNGL = 0, cellProductNGL = 0;

                        if (cellNGL != null)
                        {
                            rowProductNGL = cellNGL.Start.Row;
                            cellProductNGL = cellNGL.Start.Column;
                        }
                        //  + 6 คือ จำนวน โรงใน emun
                        var cellNGLRef = monthNowSheet.Cells[rowProductNGL + 1, cellProductNGL, rowProductNGL + 1, cellProductNGL + 6];
                        var cellNGLGSP1 = cellNGLRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP1.Value);
                        var cellNGLGSP2 = cellNGLRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP2.Value);
                        var cellNGLGSP3 = cellNGLRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP3.Value);
                        var cellNGLGSP5 = cellNGLRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP5.Value);
                        var cellNGLGSP6 = cellNGLRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP6.Value);
                        var cellNGLSTAB = cellNGLRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.STAB.Value);
                        var cellNGLTOTAL = cellNGLRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.TOTAL.Value);

                        int _cellNGLGSP1 = 0,
                            _cellNGLGSP2 = 0,
                            _cellNGLGSP3 = 0,
                            _cellNGLGSP5 = 0,
                            _cellNGLGSP6 = 0,
                            _cellNGLSTAB = 0,
                            _cellNGLTOTAL = 0;

                        _cellNGLGSP1 = (cellNGLGSP1 != null ? cellNGLGSP1.Start.Column : 0);
                        _cellNGLGSP2 = (cellNGLGSP2 != null ? cellNGLGSP2.Start.Column : 0);
                        _cellNGLGSP3 = (cellNGLGSP3 != null ? cellNGLGSP3.Start.Column : 0);
                        _cellNGLGSP5 = (cellNGLGSP5 != null ? cellNGLGSP5.Start.Column : 0);
                        _cellNGLGSP6 = (cellNGLGSP6 != null ? cellNGLGSP6.Start.Column : 0);
                        _cellNGLSTAB = (cellNGLSTAB != null ? cellNGLSTAB.Start.Column : 0);
                        _cellNGLTOTAL = (cellNGLTOTAL != null ? cellNGLTOTAL.Start.Column : 0);

                        #endregion

                        #region C3
                        var cellC3 = cells.First(c => c.Value?.ToString().ToUpper() == ProductNameExcal.C3.Value);
                        int rowProductC3 = 0, cellProductC3 = 0;

                        if (cellC3 != null)
                        {
                            rowProductC3 = cellC3.Start.Row;
                            cellProductC3 = cellC3.Start.Column;
                        }

                        //  + 5 คือ จำนวน โรงใน emun
                        var cellC3Ref = monthNowSheet.Cells[rowProductC3 + 1, cellProductC3, rowProductC3 + 1, cellProductC3 + 5];
                        var cellC3GSP1 = cellC3Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP1.Value);
                        var cellC3GSP2 = cellC3Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP2.Value);
                        var cellC3GSP3 = cellC3Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP3.Value);
                        var cellC3GSP5 = cellC3Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP5.Value);
                        var cellC3GSP6 = cellC3Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP6.Value);
                        //var cellC3TOTAL = cellC3Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.TOTAL.Value);
                        var cellC3TOTAL = cellC3Ref.LastOrDefault();

                        int _cellC3GSP1 = 0,
                            _cellC3GSP2 = 0,
                            _cellC3GSP3 = 0,
                            _cellC3GSP5 = 0,
                            _cellC3GSP6 = 0,
                            _cellC3TOTAL = 0;

                        _cellC3GSP1 = (cellC3GSP1 != null ? cellC3GSP1.Start.Column : 0);
                        _cellC3GSP2 = (cellC3GSP2 != null ? cellC3GSP2.Start.Column : 0);
                        _cellC3GSP3 = (cellC3GSP3 != null ? cellC3GSP3.Start.Column : 0);
                        _cellC3GSP5 = (cellC3GSP5 != null ? cellC3GSP5.Start.Column : 0);
                        _cellC3GSP6 = (cellC3GSP6 != null ? cellC3GSP6.Start.Column : 0);
                        _cellC3TOTAL = (cellC3TOTAL != null ? cellC3TOTAL.Start.Column : 0);

                        #endregion

                        #region LPG
                        var cellLPG = cells.First(c => c.Value?.ToString().Trim().ToUpper() == ProductNameExcal.LPG.Value);
                        int rowProductLPG = 0, cellProductLPG = 0;

                        if (cellLPG != null)
                        {
                            rowProductLPG = cellLPG.Start.Row;
                            cellProductLPG = cellLPG.Start.Column;
                        }

                        //  + 7 คือ จำนวน โรงใน emun
                        var cellLPGRef = monthNowSheet.Cells[rowProductLPG + 1, cellProductLPG, rowProductLPG + 1, cellProductLPG + 7];
                        var cellLPGGSP1 = cellLPGRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP1.Value);
                        var cellLPGGSP2 = cellLPGRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP2.Value);
                        var cellLPGGSP3 = cellLPGRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP3.Value);
                        var cellLPGGSP5 = cellLPGRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP5.Value);
                        var cellLPGGSP6 = cellLPGRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP6.Value);
                        var cellLPGTOTAL = cellLPGRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.TOTAL.Value);
                        var cellLPGPETRO = cellLPGRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.LPG_PETRO.Value);
                        var cellLPGDOMESTIC = cellLPGRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.LPG_DOMESTIC.Value);

                        int _cellLPGGSP1 = 0,
                            _cellLPGGSP2 = 0,
                            _cellLPGGSP3 = 0,
                            _cellLPGGSP5 = 0,
                            _cellLPGGSP6 = 0,
                            _cellLPGTOTAL = 0,
                            _cellLPGPETRO = 0,
                            _cellLPGDOMESTIC = 0;

                        _cellLPGGSP1 = (cellLPGGSP1 != null ? cellLPGGSP1.Start.Column : 0);
                        _cellLPGGSP2 = (cellLPGGSP2 != null ? cellLPGGSP2.Start.Column : 0);
                        _cellLPGGSP3 = (cellLPGGSP3 != null ? cellLPGGSP3.Start.Column : 0);
                        _cellLPGGSP5 = (cellLPGGSP5 != null ? cellLPGGSP5.Start.Column : 0);
                        _cellLPGGSP6 = (cellLPGGSP6 != null ? cellLPGGSP6.Start.Column : 0);
                        _cellLPGTOTAL = (cellLPGTOTAL != null ? cellLPGTOTAL.Start.Column : 0);
                        _cellLPGPETRO = (cellLPGPETRO != null ? cellLPGPETRO.Start.Column : 0);
                        _cellLPGDOMESTIC = (cellLPGDOMESTIC != null ? cellLPGDOMESTIC.Start.Column : 0);

                        #endregion

                        #region C2
                        var cellC2 = cells.First(c => c.Value?.ToString().Trim().ToUpper() == ProductNameExcal.C2.Value);
                        int rowProductC2 = 0, cellProductC2 = 0;

                        if (cellC2 != null)
                        {
                            rowProductC2 = cellC2.Start.Row;
                            cellProductC2 = cellC2.Start.Column;
                        }

                        //  + 3 คือ จำนวน โรงใน emun
                        var cellC2Ref = monthNowSheet.Cells[rowProductC2 + 1, cellProductC2, rowProductC2 + 1, cellProductC2 + 3];
                        var cellC2LOWCO2 = cellC2Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC2Excal.LOWCO2.Value);
                        var cellC2HIGHCO2 = cellC2Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC2Excal.HIGHCO2.Value);
                        var cellC2TOTAL = cellC2Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC2Excal.TOTAL.Value);
                        var cellC2TONHR = cellC2Ref.First(c => c.Value?.ToString().ToUpper() == RefineryC2Excal.TONHR.Value);

                        int _cellC2LOWCO2 = 0,
                            _cellC2HIGHCO2 = 0,
                            _cellC2TOTAL = 0,
                            _cellC2TONHR = 0;

                        _cellC2LOWCO2 = (cellC2LOWCO2 != null ? cellC2LOWCO2.Start.Column : 0);
                        _cellC2HIGHCO2 = (cellC2HIGHCO2 != null ? cellC2HIGHCO2.Start.Column : 0);
                        _cellC2TOTAL = (cellC2TOTAL != null ? cellC2TOTAL.Start.Column : 0);
                        _cellC2TONHR = (cellC2TONHR != null ? cellC2TONHR.Start.Column : 0);

                        #endregion

                        //วนข้อมูลจาก rowที่ product อยู่ไป 2 row (rowProduct + 2)

                        for (var Rows = rowProduct + 2; Rows < dayOfmonth; Rows++)
                        {
                            if (monthNowSheet.Cells[Rows, 1].Value + string.Empty != "")
                            {
                                var etheneMonthNow = new Items1
                                {
                                    rowOrder = orderRowsMonthNow.ToString(),
                                    name = monthNowSheet.Name,
                                    createDate = firstDayOfmonthNow.ToString("yyyy-MM-dd"),
                                    product = monthNowSheet.Cells[rowProduct, cellProduct].Value + string.Empty,
                                    GSP1 = monthNowSheet.Cells[Rows, _cellEthaneGSP1].Value + string.Empty,
                                    GSP2 = monthNowSheet.Cells[Rows, _cellEthaneGSP2].Value + string.Empty,
                                    GSP3 = monthNowSheet.Cells[Rows, _cellEthaneGSP3].Value + string.Empty,
                                    ESP = monthNowSheet.Cells[Rows, _cellEthaneESP].Value + string.Empty,
                                    GSP5 = monthNowSheet.Cells[Rows, _cellEthaneGSP5].Value + string.Empty,
                                    GSP6 = monthNowSheet.Cells[Rows, _cellEthaneGSP6].Value + string.Empty,
                                    TOTAL = monthNowSheet.Cells[Rows, _cellEthaneTOTAL].Value + string.Empty,
                                    AVG = monthNowSheet.Cells[Rows, _cellEthaneAVG].Value + string.Empty
                                };

                                ExcelData_monthNow.Add(etheneMonthNow);

                                var c3LpgMonthNow = new Items2
                                {
                                    rowOrder = orderRowsMonthNow.ToString(),
                                    name = monthNowSheet.Name,
                                    createDate = firstDayOfmonthNow.ToString("yyyy-MM-dd"),
                                    product = monthNowSheet.Cells[rowProductC3Lpg, cellProductC3Lpg].Value + string.Empty,
                                    GSP1 = monthNowSheet.Cells[Rows, _cellC3LpgGSP1].Value + string.Empty,
                                    GSP2 = monthNowSheet.Cells[Rows, _cellC3LpgGSP2].Value + string.Empty,
                                    GSP3 = monthNowSheet.Cells[Rows, _cellC3LpgGSP3].Value + string.Empty,
                                    GSP5 = monthNowSheet.Cells[Rows, _cellC3LpgGSP5].Value + string.Empty,
                                    GSP6 = monthNowSheet.Cells[Rows, _cellC3LpgGSP6].Value + string.Empty,
                                    TOTAL = monthNowSheet.Cells[Rows, _cellC3LpgTOTAL].Value + string.Empty,
                                };

                                ExcelData_monthNow.Add(c3LpgMonthNow);

                                var nglMonthNow = new Items3
                                {
                                    rowOrder = orderRowsMonthNow.ToString(),
                                    name = monthNowSheet.Name,
                                    createDate = firstDayOfmonthNow.ToString("yyyy-MM-dd"),
                                    product = monthNowSheet.Cells[rowProductNGL, cellProductNGL].Value + string.Empty,
                                    GSP1 = monthNowSheet.Cells[Rows, _cellNGLGSP1].Value + string.Empty,
                                    GSP2 = monthNowSheet.Cells[Rows, _cellNGLGSP2].Value + string.Empty,
                                    GSP3 = monthNowSheet.Cells[Rows, _cellNGLGSP3].Value + string.Empty,
                                    GSP5 = monthNowSheet.Cells[Rows, _cellNGLGSP5].Value + string.Empty,
                                    GSP6 = monthNowSheet.Cells[Rows, _cellNGLGSP6].Value + string.Empty,
                                    STAB = monthNowSheet.Cells[Rows, _cellNGLSTAB].Value + string.Empty,
                                    TOTAL = monthNowSheet.Cells[Rows, _cellNGLTOTAL].Value + string.Empty

                                };

                                ExcelData_monthNow.Add(nglMonthNow);

                                var c3MonthNow = new Items6
                                {
                                    rowOrder = orderRowsMonthNow.ToString(),
                                    name = monthNowSheet.Name,
                                    createDate = firstDayOfmonthNow.ToString("yyyy-MM-dd"),
                                    product = monthNowSheet.Cells[rowProductC3, cellProductC3].Value + string.Empty,
                                    GSP1 = monthNowSheet.Cells[Rows, _cellC3GSP1].Value + string.Empty,
                                    GSP2 = monthNowSheet.Cells[Rows, _cellC3GSP2].Value + string.Empty,
                                    GSP3 = monthNowSheet.Cells[Rows, _cellC3GSP3].Value + string.Empty,
                                    GSP5 = monthNowSheet.Cells[Rows, _cellC3GSP5].Value + string.Empty,
                                    GSP6 = monthNowSheet.Cells[Rows, _cellC3GSP6].Value + string.Empty,
                                    TOTAL = monthNowSheet.Cells[Rows, _cellC3TOTAL].Value + string.Empty

                                };

                                ExcelData_monthNow.Add(c3MonthNow);

                                var lpgMonthNow = new Items4
                                {
                                    rowOrder = orderRowsMonthNow.ToString(),
                                    name = monthNowSheet.Name,
                                    createDate = firstDayOfmonthNow.ToString("yyyy-MM-dd"),
                                    product = monthNowSheet.Cells[rowProductLPG, cellProductLPG].Value + string.Empty,
                                    GSP1 = monthNowSheet.Cells[Rows, _cellLPGGSP1].Value + string.Empty,
                                    GSP2 = monthNowSheet.Cells[Rows, _cellLPGGSP2].Value + string.Empty,
                                    GSP3 = monthNowSheet.Cells[Rows, _cellLPGGSP3].Value + string.Empty,
                                    GSP5 = monthNowSheet.Cells[Rows, _cellLPGGSP5].Value + string.Empty,
                                    GSP6 = monthNowSheet.Cells[Rows, _cellLPGGSP6].Value + string.Empty,
                                    TOTAL = monthNowSheet.Cells[Rows, _cellLPGTOTAL].Value + string.Empty,
                                    LPGPetro = monthNowSheet.Cells[Rows, _cellLPGPETRO].Value + string.Empty,
                                    LPGDomestic = monthNowSheet.Cells[Rows, _cellLPGDOMESTIC].Value + string.Empty

                                };

                                ExcelData_monthNow.Add(lpgMonthNow);

                                var c2MonthNow = new Items5
                                {
                                    rowOrder = orderRowsMonthNow.ToString(),
                                    name = monthNowSheet.Name,
                                    createDate = firstDayOfmonthNow.ToString("yyyy-MM-dd"),
                                    product = monthNowSheet.Cells[rowProductC2, cellProductC2].Value + string.Empty,
                                    LOWCO2 = monthNowSheet.Cells[Rows, _cellC2LOWCO2].Value + string.Empty,
                                    HIGHCO2 = monthNowSheet.Cells[Rows, _cellC2HIGHCO2].Value + string.Empty,
                                    TOTAL = monthNowSheet.Cells[Rows, _cellC2TOTAL].Value + string.Empty,
                                    TONHR = monthNowSheet.Cells[Rows, _cellC2TONHR].Value + string.Empty
                                };

                                ExcelData_monthNow.Add(c2MonthNow);

                                //var gcMonthNow = new Items5
                                //{
                                //    rowOrder = orderRowsMonthNow.ToString(),
                                //    name = monthNowSheet.Name,
                                //    createDate = firstDayOfmonthNow.ToString("yyyy-MM-dd"),
                                //    product = monthNowSheet.Cells[2, 51].Value + string.Empty,
                                //    LOWCO2 = monthNowSheet.Cells[Rows, 51].Value + string.Empty,
                                //    HIGHCO2 = monthNowSheet.Cells[Rows, 52].Value + string.Empty,
                                //    TOTAL = monthNowSheet.Cells[Rows, 53].Value + string.Empty,
                                //    TONHR = monthNowSheet.Cells[Rows, 54].Value + string.Empty
                                //};

                                //ExcelData_monthNow.Add(gcMonthNow);

                                orderRowsMonthNow++;
                                firstDayOfmonthNow = firstDayOfmonthNow.AddDays(1);
                            }
                        }
                        #endregion

                        // p1-p12
                        #region p1 - p12
                        var p = 1;
                        var monthP = dateMonthNow;

                        for (int i = 2; i < excelPack.Workbook.Worksheets.Count; i++)
                        {
                            monthP = monthP.AddMonths(1);
                            var wsP = excelPack.Workbook.Worksheets[i];
                            var firstDayOfp = new DateTime(monthP.Year, monthP.Month, 1);
                            var dayOfp = DateTime.DaysInMonth(monthP.Year, monthP.Month) + 4;
                            var orderRowsP = 1;

                            var cellsPx = wsP.Cells["1:4"];

                            #region Ethane
                            var cellEthanePx = cellsPx.First(c => c.Value?.ToString().Trim().ToUpper() == ProductNameExcal.Ethane.Value);
                            string ProductNamePx = "";
                            int rowProductPx = 2, cellProductPx = 8;

                            if (cellEthanePx != null)
                            {
                                ProductNamePx = cellEthanePx.Value?.ToString();
                                rowProductPx = cellEthanePx.Start.Row;
                                cellProductPx = cellEthanePx.Start.Column;
                            }
                            //  + 7 คือ จำนวน โรงใน emun
                            var cellRefPx = wsP.Cells[rowProductPx + 1, cellProductPx, rowProductPx + 1, cellProductPx + 7];
                            var cellEthanePxGSP1 = cellRefPx.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP1.Value);
                            var cellEthanePxGSP2 = cellRefPx.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP2.Value);
                            var cellEthanePxGSP3 = cellRefPx.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP3.Value);
                            var cellEthanePxESP = cellRefPx.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.ESP.Value);
                            var cellEthanePxGSP5 = cellRefPx.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP5.Value);
                            var cellEthanePxGSP6 = cellRefPx.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.GSP6.Value);
                            var cellEthanePxTOTAL = cellRefPx.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.TOTAL.Value);
                            var cellEthanePxAVG = cellRefPx.First(c => c.Value?.ToString().ToUpper() == RefineryEthaneExcal.AVG.Value);

                            int _cellEthanePxGSP1 = 0,
                                _cellEthanePxGSP2 = 0,
                                _cellEthanePxGSP3 = 0,
                                _cellEthanePxESP = 0,
                                _cellEthanePxGSP5 = 0,
                                _cellEthanePxGSP6 = 0,
                                _cellEthanePxTOTAL = 0,
                                _cellEthanePxAVG = 0;

                            _cellEthanePxGSP1 = (cellEthanePxGSP1 != null ? cellEthanePxGSP1.Start.Column : 0);
                            _cellEthanePxGSP2 = (cellEthanePxGSP2 != null ? cellEthanePxGSP2.Start.Column : 0);
                            _cellEthanePxGSP3 = (cellEthanePxGSP3 != null ? cellEthanePxGSP3.Start.Column : 0);
                            _cellEthanePxESP = (cellEthanePxESP != null ? cellEthanePxESP.Start.Column : 0);
                            _cellEthanePxGSP5 = (cellEthanePxGSP5 != null ? cellEthanePxGSP5.Start.Column : 0);
                            _cellEthanePxGSP6 = (cellEthanePxGSP6 != null ? cellEthanePxGSP6.Start.Column : 0);
                            _cellEthanePxTOTAL = (cellEthanePxTOTAL != null ? cellEthanePxTOTAL.Start.Column : 0);
                            _cellEthanePxAVG = (cellEthanePxAVG != null ? cellEthanePxAVG.Start.Column : 0);

                            #endregion

                            #region C3LPG
                            var cellC3LpgPx = cellsPx.First(c => c.Value?.ToString().Trim().ToUpper() == ProductNameExcal.C3_LPG.Value);
                            int rowProductC3LpgPx = 0, cellProductC3LpgPx = 0;

                            if (cellC3Lpg != null)
                            {
                                rowProductC3LpgPx = cellC3LpgPx.Start.Row;
                                cellProductC3LpgPx = cellC3LpgPx.Start.Column;
                            }
                            //  + 5 คือ จำนวน โรงใน emun
                            var cellC3LpgPxRef = wsP.Cells[rowProductC3LpgPx + 1, cellProductC3LpgPx, rowProductC3LpgPx + 1, cellProductC3LpgPx + 5];
                            var cellC3LpgPxGSP1 = cellC3LpgPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP1.Value);
                            var cellC3LpgPxGSP2 = cellC3LpgPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP2.Value);
                            var cellC3LpgPxGSP3 = cellC3LpgPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP3.Value);
                            var cellC3LpgPxGSP5 = cellC3LpgPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP5.Value);
                            var cellC3LpgPxGSP6 = cellC3LpgPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.GSP6.Value);
                            var cellC3LpgPxTOTAL = cellC3LpgPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3_LPGExcal.TOTAL.Value);

                            int _cellC3LpgPxGSP1 = 0,
                                _cellC3LpgPxGSP2 = 0,
                                _cellC3LpgPxGSP3 = 0,
                                _cellC3LpgPxGSP5 = 0,
                                _cellC3LpgPxGSP6 = 0,
                                _cellC3LpgPxTOTAL = 0;

                            _cellC3LpgPxGSP1 = (cellC3LpgPxGSP1 != null ? cellC3LpgPxGSP1.Start.Column : 0);
                            _cellC3LpgPxGSP2 = (cellC3LpgPxGSP2 != null ? cellC3LpgPxGSP2.Start.Column : 0);
                            _cellC3LpgPxGSP3 = (cellC3LpgPxGSP3 != null ? cellC3LpgPxGSP3.Start.Column : 0);
                            _cellC3LpgPxGSP5 = (cellC3LpgPxGSP5 != null ? cellC3LpgPxGSP5.Start.Column : 0);
                            _cellC3LpgPxGSP6 = (cellC3LpgPxGSP6 != null ? cellC3LpgPxGSP6.Start.Column : 0);
                            _cellC3LpgPxTOTAL = (cellC3LpgPxTOTAL != null ? cellC3LpgPxTOTAL.Start.Column : 0);

                            #endregion

                            #region NGL
                            var cellPxNGL = cellsPx.First(c => c.Value?.ToString().Trim().ToUpper() == ProductNameExcal.NGL.Value);
                            int rowProductPxNGL = 0, cellProductPxNGL = 0;

                            if (cellPxNGL != null)
                            {
                                rowProductPxNGL = cellPxNGL.Start.Row;
                                cellProductPxNGL = cellPxNGL.Start.Column;
                            }
                            //  + 6 คือ จำนวน โรงใน emun
                            var cellNGLPxRef = wsP.Cells[rowProductPxNGL + 1, cellProductPxNGL, rowProductPxNGL + 1, cellProductPxNGL + 6];
                            var cellNGLPxGSP1 = cellNGLPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP1.Value);
                            var cellNGLPxGSP2 = cellNGLPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP2.Value);
                            var cellNGLPxGSP3 = cellNGLPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP3.Value);
                            var cellNGLPxGSP5 = cellNGLPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP5.Value);
                            var cellNGLPxGSP6 = cellNGLPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.GSP6.Value);
                            var cellNGLPxSTAB = cellNGLPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.STAB.Value);
                            var cellNGLPxTOTAL = cellNGLPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryNGLExcal.TOTAL.Value);

                            int _cellNGLPxGSP1 = 0,
                                _cellNGLPxGSP2 = 0,
                                _cellNGLPxGSP3 = 0,
                                _cellNGLPxGSP5 = 0,
                                _cellNGLPxGSP6 = 0,
                                _cellNGLPxSTAB = 0,
                                _cellNGLPxTOTAL = 0;

                            _cellNGLPxGSP1 = (cellNGLPxGSP1 != null ? cellNGLPxGSP1.Start.Column : 0);
                            _cellNGLPxGSP2 = (cellNGLPxGSP2 != null ? cellNGLPxGSP2.Start.Column : 0);
                            _cellNGLPxGSP3 = (cellNGLPxGSP3 != null ? cellNGLPxGSP3.Start.Column : 0);
                            _cellNGLPxGSP5 = (cellNGLPxGSP5 != null ? cellNGLPxGSP5.Start.Column : 0);
                            _cellNGLPxGSP6 = (cellNGLPxGSP6 != null ? cellNGLPxGSP6.Start.Column : 0);
                            _cellNGLPxSTAB = (cellNGLPxSTAB != null ? cellNGLPxSTAB.Start.Column : 0);
                            _cellNGLPxTOTAL = (cellNGLPxTOTAL != null ? cellNGLPxTOTAL.Start.Column : 0);

                            #endregion

                            #region C3
                            var cellPxC3 = cellsPx.First(c => c.Value?.ToString().Trim().ToUpper() == ProductNameExcal.C3.Value);
                            int rowProductPxC3 = 0, cellProductPxC3 = 0;

                            if (cellPxC3 != null)
                            {
                                rowProductPxC3 = cellPxC3.Start.Row;
                                cellProductPxC3 = cellPxC3.Start.Column;
                            }

                            //  + 5 คือ จำนวน โรงใน emun
                            var cellC3PxRef = wsP.Cells[rowProductPxC3 + 1, cellProductPxC3, rowProductPxC3 + 1, cellProductPxC3 + 5];
                            var cellC3PxGSP1 = cellC3PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP1.Value);
                            var cellC3PxGSP2 = cellC3PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP2.Value);
                            var cellC3PxGSP3 = cellC3PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP3.Value);
                            var cellC3PxGSP5 = cellC3PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP5.Value);
                            var cellC3PxGSP6 = cellC3PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC3Excal.GSP6.Value);
                            var cellC3PxTOTAL = cellC3PxRef.LastOrDefault();

                            int _cellC3PxGSP1 = 0,
                                _cellC3PxGSP2 = 0,
                                _cellC3PxGSP3 = 0,
                                _cellC3PxGSP5 = 0,
                                _cellC3PxGSP6 = 0,
                                _cellC3PxTOTAL = 0;

                            _cellC3PxGSP1 = (cellC3PxGSP1 != null ? cellC3PxGSP1.Start.Column : 0);
                            _cellC3PxGSP2 = (cellC3PxGSP2 != null ? cellC3PxGSP2.Start.Column : 0);
                            _cellC3PxGSP3 = (cellC3PxGSP3 != null ? cellC3PxGSP3.Start.Column : 0);
                            _cellC3PxGSP5 = (cellC3PxGSP5 != null ? cellC3PxGSP5.Start.Column : 0);
                            _cellC3PxGSP6 = (cellC3PxGSP6 != null ? cellC3PxGSP6.Start.Column : 0);
                            _cellC3PxTOTAL = (cellC3PxTOTAL != null ? cellC3PxTOTAL.Start.Column : 0);

                            #endregion

                            #region LPG
                            var cellLPGPx = cellsPx.First(c => c.Value?.ToString().Trim().ToUpper() == ProductNameExcal.LPG.Value);
                            int rowProductPxLPG = 0, cellProductPxLPG = 0;

                            if (cellLPGPx != null)
                            {
                                rowProductPxLPG = cellLPGPx.Start.Row;
                                cellProductPxLPG = cellLPGPx.Start.Column;
                            }

                            //  + 7 คือ จำนวน โรงใน emun
                            var cellLPGPxRef = wsP.Cells[rowProductPxLPG + 1, cellProductPxLPG, rowProductPxLPG + 1, cellProductPxLPG + 7];
                            var cellLPGPxGSP1 = cellLPGPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP1.Value);
                            var cellLPGPxGSP2 = cellLPGPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP2.Value);
                            var cellLPGPxGSP3 = cellLPGPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP3.Value);
                            var cellLPGPxGSP5 = cellLPGPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP5.Value);
                            var cellLPGPxGSP6 = cellLPGPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.GSP6.Value);
                            var cellLPGPxTOTAL = cellLPGPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.TOTAL.Value);
                            var cellLPGPxPETRO = cellLPGPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.LPG_PETRO.Value);
                            var cellLPGPxDOMESTIC = cellLPGPxRef.First(c => c.Value?.ToString().ToUpper() == RefineryLPGExcal.LPG_DOMESTIC.Value);

                            int _cellLPGPxGSP1 = 0,
                                _cellLPGPxGSP2 = 0,
                                _cellLPGPxGSP3 = 0,
                                _cellLPGPxGSP5 = 0,
                                _cellLPGPxGSP6 = 0,
                                _cellLPGPxTOTAL = 0,
                                _cellLPGPxPETRO = 0,
                                _cellLPGPxDOMESTIC = 0;

                            _cellLPGPxGSP1 = (cellLPGPxGSP1 != null ? cellLPGPxGSP1.Start.Column : 0);
                            _cellLPGPxGSP2 = (cellLPGPxGSP2 != null ? cellLPGPxGSP2.Start.Column : 0);
                            _cellLPGPxGSP3 = (cellLPGPxGSP3 != null ? cellLPGPxGSP3.Start.Column : 0);
                            _cellLPGPxGSP5 = (cellLPGPxGSP5 != null ? cellLPGPxGSP5.Start.Column : 0);
                            _cellLPGPxGSP6 = (cellLPGPxGSP6 != null ? cellLPGPxGSP6.Start.Column : 0);
                            _cellLPGPxTOTAL = (cellLPGPxTOTAL != null ? cellLPGPxTOTAL.Start.Column : 0);
                            _cellLPGPxPETRO = (cellLPGPxPETRO != null ? cellLPGPxPETRO.Start.Column : 0);
                            _cellLPGPxDOMESTIC = (cellLPGPxDOMESTIC != null ? cellLPGPxDOMESTIC.Start.Column : 0);

                            #endregion

                            #region C2
                            var cellC2Px = cellsPx.First(c => c.Value?.ToString().Trim().ToUpper() == ProductNameExcal.C2.Value);
                            int rowProductPxC2 = 0, cellProductPxC2 = 0;

                            if (cellC2Px != null)
                            {
                                rowProductPxC2 = cellC2Px.Start.Row;
                                cellProductPxC2 = cellC2Px.Start.Column;
                            }

                            //  + 3 คือ จำนวน โรงใน emun
                            var cellC2PxRef = wsP.Cells[rowProductPxC2 + 1, cellProductPxC2, rowProductPxC2 + 1, cellProductPxC2 + 3];
                            var cellC2PxLOWCO2 = cellC2PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC2Excal.LOWCO2.Value);
                            var cellC2PxHIGHCO2 = cellC2PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC2Excal.HIGHCO2.Value);
                            var cellC2PxTOTAL = cellC2PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC2Excal.TOTAL.Value);
                            var cellC2PxTONHR = cellC2PxRef.First(c => c.Value?.ToString().ToUpper() == RefineryC2Excal.TONHR.Value);

                            int _cellC2PxLOWCO2 = 0,
                                _cellC2PxHIGHCO2 = 0,
                                _cellC2PxTOTAL = 0,
                                _cellC2PxTONHR = 0;

                            _cellC2PxLOWCO2 = (cellC2PxLOWCO2 != null ? cellC2PxLOWCO2.Start.Column : 0);
                            _cellC2PxHIGHCO2 = (cellC2PxHIGHCO2 != null ? cellC2PxHIGHCO2.Start.Column : 0);
                            _cellC2PxTOTAL = (cellC2PxTOTAL != null ? cellC2PxTOTAL.Start.Column : 0);
                            _cellC2PxTONHR = (cellC2PxTONHR != null ? cellC2PxTONHR.Start.Column : 0);

                            #endregion


                            // ทำตรงนี้
                            for (var Rows = 4; Rows < dayOfp; Rows++)
                            {
                                if (wsP.Cells[Rows, 1].Value + string.Empty != "")
                                {
                                    var etheneP = new Items1
                                    {
                                        rowOrder = orderRowsP.ToString(),
                                        name = wsP.Name,
                                        createDate = firstDayOfp.ToString("yyyy-MM-dd"),
                                        product = wsP.Cells[rowProductPx, cellProductPx].Value + string.Empty,
                                        GSP1 = wsP.Cells[Rows, _cellEthanePxGSP1].Value + string.Empty,
                                        GSP2 = wsP.Cells[Rows, _cellEthanePxGSP2].Value + string.Empty,
                                        GSP3 = wsP.Cells[Rows, _cellEthanePxGSP3].Value + string.Empty,
                                        ESP = wsP.Cells[Rows, _cellEthanePxESP].Value + string.Empty,
                                        GSP5 = wsP.Cells[Rows, _cellEthanePxGSP5].Value + string.Empty,
                                        GSP6 = wsP.Cells[Rows, _cellEthanePxGSP6].Value + string.Empty,
                                        TOTAL = wsP.Cells[Rows, _cellEthanePxTOTAL].Value + string.Empty,
                                        AVG = wsP.Cells[Rows, _cellEthanePxAVG].Value + string.Empty
                                    };

                                    var c3LpgP = new Items2
                                    {
                                        rowOrder = orderRowsP.ToString(),
                                        name = wsP.Name,
                                        createDate = firstDayOfp.ToString("yyyy-MM-dd"),
                                        product = wsP.Cells[rowProductC3LpgPx, cellProductC3LpgPx].Value + string.Empty,
                                        GSP1 = wsP.Cells[Rows, _cellC3LpgPxGSP1].Value + string.Empty,
                                        GSP2 = wsP.Cells[Rows, _cellC3LpgPxGSP2].Value + string.Empty,
                                        GSP3 = wsP.Cells[Rows, _cellC3LpgPxGSP3].Value + string.Empty,
                                        GSP5 = wsP.Cells[Rows, _cellC3LpgPxGSP5].Value + string.Empty,
                                        GSP6 = wsP.Cells[Rows, _cellC3LpgPxGSP6].Value + string.Empty,
                                        TOTAL = wsP.Cells[Rows, _cellC3LpgPxTOTAL].Value + string.Empty,
                                    };

                                    var nglP = new Items3
                                    {
                                        rowOrder = orderRowsP.ToString(),
                                        name = wsP.Name,
                                        createDate = firstDayOfp.ToString("yyyy-MM-dd"),
                                        product = wsP.Cells[rowProductPxNGL, cellProductPxNGL].Value + string.Empty,
                                        GSP1 = wsP.Cells[Rows, _cellNGLPxGSP1].Value + string.Empty,
                                        GSP2 = wsP.Cells[Rows, _cellNGLPxGSP2].Value + string.Empty,
                                        GSP3 = wsP.Cells[Rows, _cellNGLPxGSP3].Value + string.Empty,
                                        GSP5 = wsP.Cells[Rows, _cellNGLPxGSP5].Value + string.Empty,
                                        GSP6 = wsP.Cells[Rows, _cellNGLPxGSP6].Value + string.Empty,
                                        STAB = wsP.Cells[Rows, _cellNGLPxSTAB].Value + string.Empty,
                                        TOTAL = wsP.Cells[Rows, _cellNGLPxTOTAL].Value + string.Empty
                                    };

                                    var c3P = new Items6
                                    {
                                        rowOrder = orderRowsP.ToString(),
                                        name = wsP.Name,
                                        createDate = firstDayOfp.ToString("yyyy-MM-dd"),
                                        product = wsP.Cells[rowProductPxC3, cellProductPxC3].Value + string.Empty,
                                        GSP1 = wsP.Cells[Rows, _cellC3PxGSP1].Value + string.Empty,
                                        GSP2 = wsP.Cells[Rows, _cellC3PxGSP2].Value + string.Empty,
                                        GSP3 = wsP.Cells[Rows, _cellC3PxGSP3].Value + string.Empty,
                                        GSP5 = wsP.Cells[Rows, _cellC3PxGSP5].Value + string.Empty,
                                        GSP6 = wsP.Cells[Rows, _cellC3PxGSP6].Value + string.Empty,
                                        TOTAL = wsP.Cells[Rows, _cellC3PxTOTAL].Value + string.Empty
                                    };

                                    var lpgP = new Items4
                                    {
                                        rowOrder = orderRowsP.ToString(),
                                        name = wsP.Name,
                                        createDate = firstDayOfp.ToString("yyyy-MM-dd"),
                                        product = wsP.Cells[rowProductPxLPG, cellProductPxLPG].Value + string.Empty,
                                        GSP1 = wsP.Cells[Rows, _cellLPGPxGSP1].Value + string.Empty,
                                        GSP2 = wsP.Cells[Rows, _cellLPGPxGSP2].Value + string.Empty,
                                        GSP3 = wsP.Cells[Rows, _cellLPGPxGSP3].Value + string.Empty,
                                        GSP5 = wsP.Cells[Rows, _cellLPGPxGSP5].Value + string.Empty,
                                        GSP6 = wsP.Cells[Rows, _cellLPGPxGSP6].Value + string.Empty,
                                        TOTAL = wsP.Cells[Rows, _cellLPGPxTOTAL].Value + string.Empty,
                                        LPGPetro = wsP.Cells[Rows, _cellLPGPxPETRO].Value + string.Empty,
                                        LPGDomestic = wsP.Cells[Rows, _cellLPGPxDOMESTIC].Value + string.Empty
                                    };

                                    var c2P = new Items5
                                    {
                                        rowOrder = orderRowsP.ToString(),
                                        name = wsP.Name,
                                        createDate = firstDayOfp.ToString("yyyy-MM-dd"),
                                        product = wsP.Cells[rowProductPxC2, cellProductPxC2].Value + string.Empty,
                                        LOWCO2 = wsP.Cells[Rows, _cellC2PxLOWCO2].Value + string.Empty,
                                        HIGHCO2 = wsP.Cells[Rows, _cellC2PxHIGHCO2].Value + string.Empty,
                                        TOTAL = wsP.Cells[Rows, _cellC2PxTOTAL].Value + string.Empty,
                                        TONHR = wsP.Cells[Rows, _cellC2PxTONHR].Value + string.Empty
                                    };

                                    switch (p)
                                    {
                                        case 1:
                                            ExcelData_p1.Add(etheneP);
                                            ExcelData_p1.Add(c3LpgP);
                                            ExcelData_p1.Add(nglP);
                                            ExcelData_p1.Add(c3P);
                                            ExcelData_p1.Add(lpgP);
                                            ExcelData_p1.Add(c2P);
                                            break;
                                        case 2:
                                            ExcelData_p2.Add(etheneP);
                                            ExcelData_p2.Add(c3LpgP);
                                            ExcelData_p2.Add(nglP);
                                            ExcelData_p2.Add(c3P);
                                            ExcelData_p2.Add(lpgP);
                                            ExcelData_p2.Add(c2P);
                                            break;
                                        case 3:
                                            ExcelData_p3.Add(etheneP);
                                            ExcelData_p3.Add(c3LpgP);
                                            ExcelData_p3.Add(nglP);
                                            ExcelData_p3.Add(c3P);
                                            ExcelData_p3.Add(lpgP);
                                            ExcelData_p3.Add(c2P);
                                            break;
                                        case 4:
                                            ExcelData_p4.Add(etheneP);
                                            ExcelData_p4.Add(c3LpgP);
                                            ExcelData_p4.Add(nglP);
                                            ExcelData_p4.Add(c3P);
                                            ExcelData_p4.Add(lpgP);
                                            ExcelData_p4.Add(c2P);
                                            break;
                                        case 5:
                                            ExcelData_p5.Add(etheneP);
                                            ExcelData_p5.Add(c3LpgP);
                                            ExcelData_p5.Add(nglP);
                                            ExcelData_p5.Add(c3P);
                                            ExcelData_p5.Add(lpgP);
                                            ExcelData_p5.Add(c2P);
                                            break;
                                        case 6:
                                            ExcelData_p6.Add(etheneP);
                                            ExcelData_p6.Add(c3LpgP);
                                            ExcelData_p6.Add(nglP);
                                            ExcelData_p6.Add(c3P);
                                            ExcelData_p6.Add(lpgP);
                                            ExcelData_p6.Add(c2P);
                                            break;
                                        case 7:
                                            ExcelData_p7.Add(etheneP);
                                            ExcelData_p7.Add(c3LpgP);
                                            ExcelData_p7.Add(nglP);
                                            ExcelData_p7.Add(c3P);
                                            ExcelData_p7.Add(lpgP);
                                            ExcelData_p7.Add(c2P);
                                            break;
                                        case 8:
                                            ExcelData_p8.Add(etheneP);
                                            ExcelData_p8.Add(c3LpgP);
                                            ExcelData_p8.Add(nglP);
                                            ExcelData_p8.Add(c3P);
                                            ExcelData_p8.Add(lpgP);
                                            ExcelData_p8.Add(c2P);
                                            break;
                                        case 9:
                                            ExcelData_p9.Add(etheneP);
                                            ExcelData_p9.Add(c3LpgP);
                                            ExcelData_p9.Add(nglP);
                                            ExcelData_p9.Add(c3P);
                                            ExcelData_p9.Add(lpgP);
                                            ExcelData_p9.Add(c2P);
                                            break;
                                        case 10:
                                            ExcelData_p10.Add(etheneP);
                                            ExcelData_p10.Add(c3LpgP);
                                            ExcelData_p10.Add(nglP);
                                            ExcelData_p10.Add(c3P);
                                            ExcelData_p10.Add(lpgP);
                                            ExcelData_p10.Add(c2P);
                                            break;
                                        case 11:
                                            ExcelData_p11.Add(etheneP);
                                            ExcelData_p11.Add(c3LpgP);
                                            ExcelData_p11.Add(nglP);
                                            ExcelData_p11.Add(c3P);
                                            ExcelData_p11.Add(lpgP);
                                            ExcelData_p11.Add(c2P);
                                            break;
                                        case 12:
                                            ExcelData_p12.Add(etheneP);
                                            ExcelData_p12.Add(c3LpgP);
                                            ExcelData_p12.Add(nglP);
                                            ExcelData_p12.Add(c3P);
                                            ExcelData_p12.Add(lpgP);
                                            ExcelData_p12.Add(c2P);
                                            break;
                                    }

                                    orderRowsP++;
                                    firstDayOfp = firstDayOfp.AddDays(1);
                                }
                            }

                            p++;
                        }
                        #endregion
                    }
                }
                else
                {
                    ExcelData.errCode = "404";
                    ExcelData.errDesc = ErrMessage;
                }
            }
            catch (Exception ex)
            {

                ExcelData.errCode = "404";
                ExcelData.errDesc = ex.Message;
                //_logger.LogError("Error -> UploadExcelCostService -> ReadExcel -> Excption: {0}", ex.Message);

            }

            return ExcelData;
        }

        private bool CheckFileFormat(string fName)
        {
            var fileTemp = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ExcelTemplate\Template AbilityPlan.xlsx"}";
            var excelPack = new ExcelPackage();
            var excelPackTemp = new ExcelPackage();

            try
            {
                using (var stream = File.OpenRead(fileTemp))
                {
                    excelPackTemp.Load(stream);
                }

                using (var stream = File.OpenRead(fName))
                {
                    excelPack.Load(stream);
                }

                var ws = excelPack.Workbook.Worksheets[1];
                var wsTemp = excelPackTemp.Workbook.Worksheets[0];

                //for (var Rows = 35; Rows < 77; Rows++)
                //{
                //    var Data = ws.Cells[Rows, 2].Value + string.Empty;
                //    var TempData = wsTemp.Cells[Rows, 2].Value + string.Empty;

                //    if (Data != TempData)
                //    {
                //        ErrMessage = "ข้อมูล B" + Rows + " จาก Template = " + TempData + " Upload = " + Data;
                //        File.Delete(fName);
                //        return false;
                //    }
                //}

            }
            catch (Exception ex)
            {
                //_logger.LogError("Error -> UploadExcelCostService -> CheckFileFormat -> Excption: {0}", ex.Message);
                ErrMessage = ex.Message;
                File.Delete(fName);
                return false;
            }

            return true;
        }

        public string DateFomat(string strDate)
        {
            try
            {

                strDate = DateTime.Parse(strDate).ToString("yyyy-MM-dd", new CultureInfo("en-US"));
            }
            catch
            {
                double d = double.Parse(strDate);
                strDate = DateTime.FromOADate(d).ToString("yyyy-MM-dd", new CultureInfo("en-US"));
            }

            return strDate;
        }
    }
    public class ProductNameExcal
    {
        private ProductNameExcal(string value) { Value = value; }

        public string Value { get; private set; }

        public static ProductNameExcal Ethane { get { return new ProductNameExcal("ETHANE"); } }
        public static ProductNameExcal C3_LPG { get { return new ProductNameExcal("C3/LPG"); } }
        public static ProductNameExcal C3 { get { return new ProductNameExcal("C3"); } }
        public static ProductNameExcal LPG { get { return new ProductNameExcal("LPG"); } }
        public static ProductNameExcal C2 { get { return new ProductNameExcal("C2"); } }
        public static ProductNameExcal NGL { get { return new ProductNameExcal("NGL"); } }
    }
    public class RefineryEthaneExcal
    {
        private RefineryEthaneExcal(string value) { Value = value; }

        public string Value { get; private set; }

        public static RefineryEthaneExcal GSP1 { get { return new RefineryEthaneExcal("GSP1"); } }
        public static RefineryEthaneExcal GSP2 { get { return new RefineryEthaneExcal("GSP2"); } }
        public static RefineryEthaneExcal GSP3 { get { return new RefineryEthaneExcal("GSP3"); } }
        public static RefineryEthaneExcal ESP { get { return new RefineryEthaneExcal("ESP"); } }
        public static RefineryEthaneExcal GSP5 { get { return new RefineryEthaneExcal("GSP5"); } }
        public static RefineryEthaneExcal GSP6 { get { return new RefineryEthaneExcal("GSP6"); } }
        public static RefineryEthaneExcal TOTAL { get { return new RefineryEthaneExcal("TOTAL"); } }
        public static RefineryEthaneExcal AVG { get { return new RefineryEthaneExcal("AVG"); } }
    }
    public class RefineryC3_LPGExcal
    {
        private RefineryC3_LPGExcal(string value) { Value = value; }

        public string Value { get; private set; }

        public static RefineryC3_LPGExcal GSP1 { get { return new RefineryC3_LPGExcal("GSP1"); } }
        public static RefineryC3_LPGExcal GSP2 { get { return new RefineryC3_LPGExcal("GSP2"); } }
        public static RefineryC3_LPGExcal GSP3 { get { return new RefineryC3_LPGExcal("GSP3"); } }
        public static RefineryC3_LPGExcal ESP { get { return new RefineryC3_LPGExcal("ESP"); } }
        public static RefineryC3_LPGExcal GSP5 { get { return new RefineryC3_LPGExcal("GSP5"); } }
        public static RefineryC3_LPGExcal GSP6 { get { return new RefineryC3_LPGExcal("GSP6"); } }
        public static RefineryC3_LPGExcal TOTAL { get { return new RefineryC3_LPGExcal("TOTAL"); } }
    }
    public class RefineryC3Excal
    {
        private RefineryC3Excal(string value) { Value = value; }

        public string Value { get; private set; }

        public static RefineryC3Excal GSP1 { get { return new RefineryC3Excal("GSP1"); } }
        public static RefineryC3Excal GSP2 { get { return new RefineryC3Excal("GSP2"); } }
        public static RefineryC3Excal GSP3 { get { return new RefineryC3Excal("GSP3"); } }
        public static RefineryC3Excal GSP5 { get { return new RefineryC3Excal("GSP5"); } }
        public static RefineryC3Excal GSP6 { get { return new RefineryC3Excal("GSP6"); } }
        public static RefineryC3Excal TOTAL { get { return new RefineryC3Excal("TOTAL"); } }
    }
    public class RefineryLPGExcal
    {
        private RefineryLPGExcal(string value) { Value = value; }

        public string Value { get; private set; }

        public static RefineryLPGExcal GSP1 { get { return new RefineryLPGExcal("GSP1"); } }
        public static RefineryLPGExcal GSP2 { get { return new RefineryLPGExcal("GSP2"); } }
        public static RefineryLPGExcal GSP3 { get { return new RefineryLPGExcal("GSP3"); } }
        public static RefineryLPGExcal GSP5 { get { return new RefineryLPGExcal("GSP5"); } }
        public static RefineryLPGExcal GSP6 { get { return new RefineryLPGExcal("GSP6"); } }
        public static RefineryLPGExcal TOTAL { get { return new RefineryLPGExcal("TOTAL"); } }
        public static RefineryLPGExcal LPG_PETRO { get { return new RefineryLPGExcal("LPG-PETRO"); } }
        public static RefineryLPGExcal LPG_DOMESTIC { get { return new RefineryLPGExcal("LPG-DOMESTIC"); } }
    }
    public class RefineryC2Excal
    {
        private RefineryC2Excal(string value) { Value = value; }

        public string Value { get; private set; }

        public static RefineryC2Excal LOWCO2 { get { return new RefineryC2Excal("LOW CO2"); } }
        public static RefineryC2Excal HIGHCO2 { get { return new RefineryC2Excal("HIGH CO2"); } }
        public static RefineryC2Excal TOTAL { get { return new RefineryC2Excal("TOTAL"); } }
        public static RefineryC2Excal TONHR { get { return new RefineryC2Excal("TON/HR"); } }

    }
    public class RefineryNGLExcal
    {
        private RefineryNGLExcal(string value) { Value = value; }

        public string Value { get; private set; }

        public static RefineryNGLExcal GSP1 { get { return new RefineryNGLExcal("GSP1"); } }
        public static RefineryNGLExcal GSP2 { get { return new RefineryNGLExcal("GSP2"); } }
        public static RefineryNGLExcal GSP3 { get { return new RefineryNGLExcal("GSP3"); } }
        //public static RefineryNGLExcal ESP { get { return new RefineryNGLExcal("ESP"); } }
        public static RefineryNGLExcal GSP5 { get { return new RefineryNGLExcal("GSP5"); } }
        public static RefineryNGLExcal GSP6 { get { return new RefineryNGLExcal("GSP6"); } }
        public static RefineryNGLExcal STAB { get { return new RefineryNGLExcal("STAB"); } }
        public static RefineryNGLExcal TOTAL { get { return new RefineryNGLExcal("TOTAL"); } }
    }

}
