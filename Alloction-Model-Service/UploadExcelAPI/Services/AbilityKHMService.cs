using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Services
{
    public class AbilityKHMService : IAbilityKHMService
    {
        private readonly ILogger<AbilityKHMService> _logger;

        public AbilityKHMService(ILogger<AbilityKHMService> logger)
        {
            _logger = logger;
        }

        private string ErrMessage;

        public ResponseAbilityKHM ImportAbilityKHM(IFormFile fileInput, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            string fileInputName = fileInput.FileName.Replace(".xlsx", DateTime.Now.ToString("_yyyyMMdd_HHmmsss") + ".xlsx");
            string fileName = $"{hostingEnvironment.ContentRootPath}\\FileUpload\\AbilityKHM\\{fileInputName}";
            string returnPath = "FileUpload/AbilityKHM/" + fileInputName;
            var ResponseExcelData = new ResponseAbilityKHM();

            try
            {
                using (FileStream fileStream = File.Create(fileName))
                {
                    fileInput.CopyTo(fileStream);
                    fileStream.Flush();
                }

                string respone = JsonConvert.SerializeObject(ReadExcel(fileInputName,returnPath));
                ResponseExcelData = JsonConvert.DeserializeObject<ResponseAbilityKHM>(respone);
            }
            catch (Exception ex)
            {
                ResponseExcelData.errCode = "404";
                ResponseExcelData.errDesc = ex.Message;

                //_logger.LogError("Error -> UploadExcelCostService -> UploadExcelCost -> Excption: {0}", ex.Message);
            }


            return ResponseExcelData;
        }

        private ResponseAbilityKHM ReadExcel(string fName,string returnPath)
        {
            var fileName = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\AbilityKHM\"}" + fName;
            var ExcelData = new ResponseAbilityKHM();

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
                        
                        ExcelData = new ResponseAbilityKHM
                        {
                            path = returnPath
                        };

                        var date = Convert.ToDateTime(ws.Cells[6, 1].Value + string.Empty);
                        ExcelData.fileName = fName;
                        ExcelData.month = date.Month;
                        ExcelData.year = date.Year - 543;
                        ExcelData.dateFormat = $"{ExcelData.year}-{ExcelData.month.ToString("00")}-01";
                        var ExcelData_items = ExcelData.data = new List<AbilityItemsKHM>();
                        int orderRows = 1;

                        for (var Rows = 6; Rows < 19; Rows++)
                        {
                            var dateRow = Convert.ToDateTime(ws.Cells[Rows, 1].Value + string.Empty);
                            var items = new AbilityItemsKHM
                            {
                                rowOrder = orderRows++.ToString(),
                                month = dateRow.Month.ToString(),
                                year = (dateRow.Year - 543).ToString(),
                                feedGas = ws.Cells[Rows, 2].Value + string.Empty,
                                mp = ws.Cells[Rows, 3].Value + string.Empty,
                                lp = ws.Cells[Rows, 4].Value + string.Empty,
                                total = ws.Cells[Rows, 5].Value + string.Empty,
                                GAS_USED = ws.Cells[Rows, 6].Value + string.Empty,
                                lpg = ws.Cells[Rows, 7].Value + string.Empty,
                                ngl = ws.Cells[Rows, 8].Value + string.Empty
                            };
                            ExcelData_items.Add(items);
                        }
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
            var fileTemp = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ExcelTemplate\Template AbilityKHM.xlsx"}";
            var excelPack = new ExcelPackage();
            var excelPackTemp = new ExcelPackage();
            string[] ColName = { "", "A", "B", "C", "D", "E", "F", "G", "H" };

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

                //if (month != monthCheck || year != yearCheck)
                //{
                //    ErrMessage = "ไฟล์ Excel ไม่ถูกต้อง";
                //    File.Delete(fName);
                //    return false;
                //}

                for (var col = 1; col < 9; col++)
                {
                    var Data = ws.Cells[4, col].Value + string.Empty;
                    var TempData = wsTemp.Cells[4, col].Value + string.Empty;

                    if (Data != TempData)
                    {
                        ErrMessage = "ข้อมูล " + ColName[col] + col + " จาก Template = " + TempData + " Upload = " + Data;
                        File.Delete(fName);
                        return false;
                    }
                }

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

        public int MonthNumber(object strMont)
        {
            int Number = 0;
            switch (strMont)
            {
                case "มกราคม":
                    Number = 1;
                    break;
                case "กุมภาพันธ์":
                    Number = 2;
                    break;
                case "มีนาคม":
                    Number = 3;
                    break;
                case "เมษายน":
                    Number = 4;
                    break;
                case "พฤษภาคม":
                    Number = 5;
                    break;
                case "มิถุนายน":
                    Number = 6;
                    break;
                case "กรกฎาคม":
                    Number = 7;
                    break;
                case "สิงหาคม":
                    Number = 8;
                    break;
                case "กันยายน":
                    Number = 9;
                    break;
                case "ตุลาคม":
                    Number = 10;
                    break;
                case "พฤศจิกายน":
                    Number = 11;
                    break;
                case "ธันวาคม":
                    Number = 12;
                    break;
                default:
                    Number = 0;
                    break;
            }

            return Number;
        }
    }
}
