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
    public class VolumeConstrainMeterService : IVolumeConstrainMeterService
    {
        private readonly ILogger<VolumeConstrainMeterService> _logger;

        public VolumeConstrainMeterService(ILogger<VolumeConstrainMeterService> logger)
        {
            _logger = logger;
        }

        private string ErrMessage;

        public ResponseVolumeConstrain ImportVolumeConstrainMeter(IFormFile fileInput, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            string fileInputName = fileInput.FileName.Replace(".xlsx", DateTime.Now.ToString("_yyyyMMdd_HHmmsss") + ".xlsx");
            string fileName = $"{hostingEnvironment.ContentRootPath}\\FileUpload\\VolumeMeter\\{fileInputName}";
            string returnPath = "FileUpload/VolumeMeter/" + fileInputName;
            var ResponseExcelData = new ResponseVolumeConstrain();

            try
            {
                using (FileStream fileStream = File.Create(fileName))
                {
                    fileInput.CopyTo(fileStream);
                    fileStream.Flush();
                }

                string respone = JsonConvert.SerializeObject(ReadExcel(fileInputName, returnPath));
                ResponseExcelData = JsonConvert.DeserializeObject<ResponseVolumeConstrain>(respone);
            }
            catch (Exception ex)
            {
                ResponseExcelData.errCode = "404";
                ResponseExcelData.errDesc = ex.Message;

                //_logger.LogError("Error -> UploadExcelCostService -> UploadExcelCost -> Excption: {0}", ex.Message);
            }

            return ResponseExcelData;
        }

        private ResponseVolumeConstrain ReadExcel(string fName, string returnPath)
        {
            var fileName = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\VolumeMeter\"}" + fName;
            var ExcelData = new ResponseVolumeConstrain();

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
                        var ws = excelPack.Workbook.Worksheets[2];

                        ExcelData = new ResponseVolumeConstrain
                        {
                            path = returnPath,
                            fileName = fName
                        };

                        var ExcelData_items = ExcelData.data = new List<VolumeItems>();
                        int orderRows = 1;

                        //C2
                        for (var Rows = 4; Rows < 11; Rows++)
                        {
                            string minVal = string.Empty;
                            string maxVal = string.Empty;
                            var isCalMin = IsCalMin(ws.Cells[Rows, 5].FormulaR1C1 + string.Empty, out minVal);
                            var isCalMax = IsCalMax(ws.Cells[Rows, 6].FormulaR1C1 + string.Empty, out maxVal);
                            var isCal = false;
                            if (isCalMin || isCalMax)
                                isCal = true;

                            var items = new VolumeItems
                            {
                                rowOrder = orderRows++.ToString(),
                                product = "C2",
                                unit = ws.Cells[Rows, 1].Value + string.Empty,
                                source = ws.Cells[Rows, 2].Value + string.Empty,
                                demand = ws.Cells[Rows, 3].Value + string.Empty,
                                deliveryPoint = ws.Cells[Rows, 4].Value + string.Empty,
                                min = isCalMin ? minVal : ws.Cells[Rows, 5].Value + string.Empty,
                                max = isCalMax ? maxVal : ws.Cells[Rows, 6].Value + string.Empty,
                                isCalculate = isCal
                            };
                            ExcelData_items.Add(items);
                        }

                        //C3
                        for (var Rows = 15; Rows < 32; Rows++)
                        {
                            string minVal = string.Empty;
                            string maxVal = string.Empty;
                            var isCalMin = IsCalMin(ws.Cells[Rows, 5].FormulaR1C1 + string.Empty, out minVal);
                            var isCalMax = IsCalMax(ws.Cells[Rows, 6].FormulaR1C1 + string.Empty, out maxVal);
                            var isCal = false;
                            if (isCalMin || isCalMax)
                                isCal = true;

                            var items = new VolumeItems
                            {
                                rowOrder = orderRows++.ToString(),
                                product = "C3",
                                unit = ws.Cells[Rows, 1].Value + string.Empty,
                                source = ws.Cells[Rows, 2].Value + string.Empty,
                                demand = ws.Cells[Rows, 3].Value + string.Empty,
                                deliveryPoint = ws.Cells[Rows, 4].Value + string.Empty,
                                min = isCalMin ? minVal : ws.Cells[Rows, 5].Value + string.Empty,
                                max = isCalMax ? maxVal : ws.Cells[Rows, 6].Value + string.Empty,
                                isCalculate = isCal
                            };
                            ExcelData_items.Add(items);
                        }

                        //LPG
                        for (var Rows = 36; Rows < 100; Rows++)
                        {
                            string minVal = string.Empty;
                            string maxVal = string.Empty;
                            var isCalMin = IsCalMin(ws.Cells[Rows, 5].FormulaR1C1 + string.Empty, out minVal);
                            var isCalMax = IsCalMax(ws.Cells[Rows, 6].FormulaR1C1 + string.Empty, out maxVal);
                            var isCal = false;
                            if (isCalMin || isCalMax)
                                isCal = true;

                            var items = new VolumeItems
                            {
                                rowOrder = orderRows++.ToString(),
                                product = "LPG",
                                unit = ws.Cells[Rows, 1].Value + string.Empty,
                                source = ws.Cells[Rows, 2].Value + string.Empty,
                                demand = ws.Cells[Rows, 3].Value + string.Empty,
                                deliveryPoint = ws.Cells[Rows, 4].Value + string.Empty,
                                min = isCalMin ? minVal : ws.Cells[Rows, 5].Value + string.Empty,
                                max = isCalMax ? maxVal : ws.Cells[Rows, 6].Value + string.Empty,
                                isCalculate = isCal
                            };
                            ExcelData_items.Add(items);
                        }

                        //NGL
                        for (var Rows = 103; Rows < 108; Rows++)
                        {
                            string minVal = string.Empty;
                            string maxVal = string.Empty;
                            var isCalMin = IsCalMin(ws.Cells[Rows, 5].FormulaR1C1 + string.Empty, out minVal);
                            var isCalMax = IsCalMax(ws.Cells[Rows, 6].FormulaR1C1 + string.Empty, out maxVal);
                            var isCal = false;
                            if (isCalMin || isCalMax)
                                isCal = true;

                            var items = new VolumeItems
                            {
                                rowOrder = orderRows++.ToString(),
                                product = "NGL",
                                unit = ws.Cells[Rows, 1].Value + string.Empty,
                                source = ws.Cells[Rows, 2].Value + string.Empty,
                                demand = ws.Cells[Rows, 3].Value + string.Empty,
                                deliveryPoint = ws.Cells[Rows, 4].Value + string.Empty,
                                min = isCalMin ? minVal : ws.Cells[Rows, 5].Value + string.Empty,
                                max = isCalMax ? maxVal : ws.Cells[Rows, 6].Value + string.Empty,
                                isCalculate = isCal
                            };
                            ExcelData_items.Add(items);
                        }

                        //Pentane
                        for (var Rows = 111; Rows < 112; Rows++)
                        {
                            string minVal = string.Empty;
                            string maxVal = string.Empty;
                            var isCalMin = IsCalMin(ws.Cells[Rows, 5].FormulaR1C1 + string.Empty, out minVal);
                            var isCalMax = IsCalMax(ws.Cells[Rows, 6].FormulaR1C1 + string.Empty, out maxVal);
                            var isCal = false;
                            if (isCalMin || isCalMax)
                                isCal = true;

                            var items = new VolumeItems
                            {
                                rowOrder = orderRows++.ToString(),
                                product = "Pentane",
                                unit = ws.Cells[Rows, 1].Value + string.Empty,
                                source = ws.Cells[Rows, 2].Value + string.Empty,
                                demand = ws.Cells[Rows, 3].Value + string.Empty,
                                deliveryPoint = ws.Cells[Rows, 4].Value + string.Empty,
                                min = isCalMin ? minVal : ws.Cells[Rows, 5].Value + string.Empty,
                                max = isCalMax ? maxVal : ws.Cells[Rows, 6].Value + string.Empty,
                                isCalculate = isCal
                            };
                            ExcelData_items.Add(items);
                        }

                        //CO2
                        for (var Rows = 115; Rows < 117; Rows++)
                        {
                            string minVal = string.Empty;
                            string maxVal = string.Empty;
                            var isCalMin = IsCalMin(ws.Cells[Rows, 5].FormulaR1C1 + string.Empty, out minVal);
                            var isCalMax = IsCalMax(ws.Cells[Rows, 6].FormulaR1C1 + string.Empty, out maxVal);
                            var isCal = false;
                            if (isCalMin || isCalMax)
                                isCal = true;

                            var items = new VolumeItems
                            {
                                rowOrder = orderRows++.ToString(),
                                product = "CO2",
                                unit = ws.Cells[Rows, 1].Value + string.Empty,
                                source = ws.Cells[Rows, 2].Value + string.Empty,
                                demand = ws.Cells[Rows, 3].Value + string.Empty,
                                deliveryPoint = ws.Cells[Rows, 4].Value + string.Empty,
                                min = isCalMin ? minVal : ws.Cells[Rows, 5].Value + string.Empty,
                                max = isCalMax ? maxVal : ws.Cells[Rows, 6].Value + string.Empty,
                                isCalculate = isCal
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
            var fileTemp = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ExcelTemplate\Template VolumeConstrainMeter.xlsx"}";
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

                var ws = excelPack.Workbook.Worksheets[2];
                var wsTemp = excelPackTemp.Workbook.Worksheets[0];

                for (var Rows = 1; Rows < 117; Rows++)
                {
                    var Data = ws.Cells[Rows, 1].Value + string.Empty;
                    var TempData = wsTemp.Cells[Rows, 1].Value + string.Empty;

                    if (Data != TempData)
                    {
                        ErrMessage = "ข้อมูล A" + Rows + " จาก Template = " + TempData + " Upload = " + Data;
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

        public bool IsCalMin(object min, out string minVal)
        {
            var response = false;
            minVal = min.ToString();

            var minV1 = min.ToString().Split('/');
            var minV2 = min.ToString().Split('*');

            if (minV1.Length > 1 || minV2.Length > 1)
            {
                if (minV1.Length > 1)
                {
                    minVal = minV1[0];
                }

                if (minV2.Length > 1)
                {
                    minVal = minV2[0];
                }
                response = true;
            }

            return response;
        }

        public bool IsCalMax(object max, out string maxVal)
        {
            var response = false;
            maxVal = max.ToString();

            var maxV1 = max.ToString().Split('/');
            var maxV2 = max.ToString().Split('*');

            if (maxV1.Length > 1 || maxV2.Length > 1)
            {
                if (maxV1.Length > 1)
                {
                    maxVal = maxV1[0];
                }

                if (maxV2.Length > 1)
                {
                    maxVal = maxV2[0];
                }
                response = true;
            }

            return response;
        }
    }
}
