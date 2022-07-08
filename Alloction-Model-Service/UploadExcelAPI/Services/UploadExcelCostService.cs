using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Services
{
    public class UploadExcelCostService : IUploadExcelCostService
    {
        private readonly ILogger<UploadExcelCostService> _logger;

        public UploadExcelCostService(ILogger<UploadExcelCostService> logger)
        {
            _logger = logger;
        }
        private string ErrMessage;

        public ResponseExcelCost UploadExcelCost(IFormFile fileInput, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            string fileInputName = fileInput.FileName.Replace(".xlsx", DateTime.Now.ToString("_yyyyMMdd_HHmmsss") + ".xlsx");
            string fileName = $"{hostingEnvironment.ContentRootPath}\\FileUpload\\Cost\\{fileInputName}";
            string returnPath = "FileUpload/Cost/" + fileInputName;
            var ExcelCost = new ResponseExcelCost();

            try
            {
                //if (File.Exists(fileName))
                //{
                //    File.Delete(fileName);
                //}

                using (FileStream fileStream = File.Create(fileName))
                {
                    fileInput.CopyTo(fileStream);
                    fileStream.Flush();
                }

                string respone = JsonConvert.SerializeObject(ReadExcel(fileInputName, returnPath));
                ExcelCost = JsonConvert.DeserializeObject<ResponseExcelCost>(respone);
            }
            catch (Exception ex)
            {
                ExcelCost.errCode = "404";
                ExcelCost.errDesc = ex.Message;

                //_logger.LogError("Error -> UploadExcelCostService -> UploadExcelCost -> Excption: {0}", ex.Message);
            }


            return ExcelCost;
        }

        private ResponseExcelCost ReadExcel(string fName, string returnPath)
        {
            var fileName = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\Cost\"}" + fName;
            var ExcelCostData = new ResponseExcelCost();

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

                        ExcelCostData = new ResponseExcelCost
                        {
                            path = returnPath,
                            fileName = fName,
                            date = ws.Cells[3, 4].Value.ToString()
                        };

                        var ExcelCostData_items = ExcelCostData.data = new List<DataItems>();
                        string CostData = "";

                        for (var Rows = 2; Rows < 61; Rows++)
                        {
                            if (Rows == 2 || Rows == 11 || Rows == 20 || Rows == 29 || Rows == 38 || Rows == 46 || Rows == 54)
                            {
                                CostData = ws.Cells[Rows, 3].Value + string.Empty;
                            }

                            var ChkData = (ws.Cells[Rows, 3].Value == null) ? "" : ws.Cells[Rows, 3].Value + string.Empty;

                            if (!string.IsNullOrEmpty(ChkData) && ChkData != CostData && (ChkData.Contains("Dubai") || ChkData.Contains("FX") || ChkData.Contains("NG Cost") || ChkData.Contains("GSP Cash") || ChkData.Contains("GSP Full")))
                            {
                                //Dubai($/ BBL)
                                //FX(Baht /$)
                                //NG Cost +Fuel($/ Ton)
                                //GSP Cash Cost($/ Ton)
                                //GSP Full Cost($/ Ton)

                                var items = new DataItems
                                {
                                    Cost = CostData,
                                    product = ws.Cells[Rows, 3].Value + string.Empty,
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
                                ExcelCostData_items.Add(items);
                            }
                        }
                    }
                }
                else
                {
                    //ExcelCostData = new ResponseExcelCost
                    //{
                    //    path = "Invalid Input File"
                    //};

                    ExcelCostData.errCode = "404";
                    ExcelCostData.errDesc = ErrMessage;
                }
            }
            catch (Exception ex)
            {

                ExcelCostData.errCode = "404";
                ExcelCostData.errDesc = ex.Message;
                //_logger.LogError("Error -> UploadExcelCostService -> ReadExcel -> Excption: {0}", ex.Message);

            }

            return ExcelCostData;
        }

        private bool CheckFileFormat(string fName)
        {
            var fileTemp = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ExcelTemplate\Template_cost_วผก.xlsx"}";
            var excelPack = new ExcelPackage();
            var excelPackTemp = new ExcelPackage();
            int[] RowsYear = { 3 };

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

                var ws = excelPack.Workbook.Worksheets[0];
                var wsTemp = excelPackTemp.Workbook.Worksheets[0];

                if (ws.Name != wsTemp.Name)
                {
                    for (var Rows = 1; Rows < 61; Rows++)
                    {
                        var Data = (ws.Cells[Rows, 2].Value == null) ? "" : ws.Cells[Rows, 2].Value + string.Empty;
                        var TempData = (wsTemp.Cells[Rows, 2].Value == null) ? "" : wsTemp.Cells[Rows, 2].Value + string.Empty;

                        if (Data != TempData)
                        {
                            ErrMessage = "ข้อมูล C" + Rows + " จาก Template = " + TempData + " Upload = " + Data;
                            File.Delete(fName);
                            return false;
                        }
                    }

                    ////check year
                    //foreach (var row in RowsYear)
                    //{
                    //    for (var col = 4; col < 16; col++)
                    //    {
                    //        string strDate = ws.Cells[row, col].Value.ToString();
                    //        var DataY = DateTime.Parse(strDate).ToString("yyyy", new CultureInfo("en-US"));

                    //        if (DataY != year)
                    //        {
                    //            File.Delete(fName);
                    //            return false;
                    //        }
                    //    }
                    //}
                }
                else
                {
                    for (var Rows = 1; Rows < 61; Rows++)
                    {
                        var Data = (ws.Cells[Rows, 2].Value == null) ? "" : ws.Cells[Rows, 2].Value.ToString();
                        var TempData = (wsTemp.Cells[Rows, 2].Value == null) ? "" : wsTemp.Cells[Rows, 2].Value.ToString();

                        if (Data != TempData)
                        {
                            ErrMessage = "ข้อมูล C" + Rows + " จาก Template = " + TempData + " Upload = " + Data;
                            File.Delete(fName);
                            return false;
                        }
                    }

                    ////check year
                    //foreach (var row in RowsYear)
                    //{
                    //    for (var col = 4; col < 16; col++)
                    //    {
                    //        string strDate = ws.Cells[row, col].Value.ToString();
                    //        var DataY = DateTime.Parse(strDate).ToString("yyyy", new CultureInfo("en-US"));

                    //        if (DataY != year)
                    //        {
                    //            File.Delete(fName);
                    //            return false;
                    //        }
                    //    }
                    //}
                }
            }
            catch (Exception ex)
            {
                //_logger.LogError("Error -> UploadExcelCostService -> CheckFileFormat -> Excption: {0}", ex.Message);
                File.Delete(fName);
                return false;
            }

            return true;
        }


    }
}
