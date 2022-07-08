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
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using UploadExcelAPI.Domains;

namespace UploadExcelAPI.Services
{
    public class UploadExcelReferencePriceService : IUploadExcelReferencePriceService
    {
        private readonly ILogger<UploadExcelReferencePriceService> _logger;
        private ResponseExcelPrice ExcelPriceData;// = new ResponseExcelPrice();
        private List<PriceDataItems> ExcelPriceData_items1;// = new List<PriceDataItems>();

        private string ErrMessage;

        public UploadExcelReferencePriceService(ILogger<UploadExcelReferencePriceService> logger)
        {
            _logger = logger;
        }

        public ResponseExcelPrice UploadExcelReferencePrice(IFormFile fileInput1, IFormFile fileInput2, IFormFile fileInput3, string Year, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            string fileName1 = "", fileName2 = "", fileName3 = "",
                   returnPath1 = "", returnPath2 = "", returnPath3 = "",
                   fileInputName1 = "", fileInputName2 = "", fileInputName3 = "",
                   fileInputType1 = "", fileInputType2 = "", fileInputType3 = "";

            var ExcelData = new ResponseExcelPrice();

            ExcelPriceData = new ResponseExcelPrice();
            ExcelPriceData_items1 = ExcelPriceData.data = new List<PriceDataItems>();

            try
            {
                if (fileInput1 != null)
                {
                    fileInputName1 = fileInput1.FileName.Replace(".xlsx", DateTime.Now.ToString("_yyyyMMdd_HHmmsss") + ".xlsx");

                    fileName1 = $"{hostingEnvironment.ContentRootPath}\\FileUpload\\ReferencePrice\\{fileInputName1}";
                    if (File.Exists(fileName1))
                    {
                        File.Delete(fileName1);
                    }

                    using (FileStream fileStream = File.Create(fileName1))
                    {
                        fileInput1.CopyTo(fileStream);
                        fileStream.Flush();
                    }

                    returnPath1 = "FileUpload/ReferencePrice/" + fileInputName1;

                    var checkFile = CheckFile(fileInputName1, Year);

                    fileInputType1 = checkFile.fileType;

                    if (!checkFile.checkFile)
                    {
                        ExcelPriceData = new ResponseExcelPrice
                        {
                            errCode = "404",
                            errDesc = ErrMessage
                        };

                        string respone1 = JsonConvert.SerializeObject(ExcelPriceData);
                        ExcelData = JsonConvert.DeserializeObject<ResponseExcelPrice>(respone1);
                        return ExcelData;
                    }
                }

                if (fileInput2 != null)
                {
                    fileInputName2 = fileInput2.FileName.Replace(".xlsx", DateTime.Now.ToString("_yyyyMMdd_HHmmsss") + ".xlsx");
                    fileName2 = $"{hostingEnvironment.ContentRootPath}\\FileUpload\\ReferencePrice\\{fileInputName2}";
                    if (File.Exists(fileName2))
                    {
                        File.Delete(fileName2);
                    }

                    using (FileStream fileStream = File.Create(fileName2))
                    {
                        fileInput2.CopyTo(fileStream);
                        fileStream.Flush();
                    }

                    returnPath2 += "FileUpload/ReferencePrice/" + fileInputName2;

                    var checkFile = CheckFile(fileInputName2, Year);

                    fileInputType2 = checkFile.fileType;

                    if (!checkFile.checkFile)
                    {
                        ExcelPriceData = new ResponseExcelPrice
                        {
                            errCode = "404",
                            errDesc = ErrMessage
                        };

                        string respone1 = JsonConvert.SerializeObject(ExcelPriceData);
                        ExcelData = JsonConvert.DeserializeObject<ResponseExcelPrice>(respone1);
                        return ExcelData;
                    }
                }

                if (fileInput3 != null)
                {
                    fileInputName3 = fileInput3.FileName.Replace(".xlsx", DateTime.Now.ToString("_yyyyMMdd_HHmmsss") + ".xlsx");
                    fileName3 = $"{hostingEnvironment.ContentRootPath}\\FileUpload\\ReferencePrice\\{fileInputName3}";
                    if (File.Exists(fileName3))
                    {
                        File.Delete(fileName3);
                    }

                    using (FileStream fileStream = File.Create(fileName3))
                    {
                        fileInput3.CopyTo(fileStream);
                        fileStream.Flush();
                    }

                    returnPath3 += "FileUpload/ReferencePrice/" + fileInputName3;

                    var checkFile = CheckFile(fileInputName3, Year);

                    fileInputType3 = checkFile.fileType;

                    if (!checkFile.checkFile)
                    {
                        ExcelPriceData = new ResponseExcelPrice
                        {
                            errCode = "404",
                            errDesc = ErrMessage
                        };

                        string respone1 = JsonConvert.SerializeObject(ExcelPriceData);
                        ExcelData = JsonConvert.DeserializeObject<ResponseExcelPrice>(respone1);
                        return ExcelData;
                    }
                }

                ExcelData = new ResponseExcelPrice
                {
                    filePath1 = returnPath1,
                    filePath2 = returnPath2,
                    filePath3 = returnPath3,
                    fileName1 = fileInputName1,
                    fileName2 = fileInputName2,
                    fileName3 = fileInputName3,
                    fileType1 = fileInputType1,
                    fileType2 = fileInputType2,
                    fileType3 = fileInputType3,
                };

                ExcelData.data = ExcelPriceData_items1;

                //string respone = JsonConvert.SerializeObject(ExcelData);
                //ExcelData = JsonConvert.DeserializeObject<ResponseExcelPrice>(respone);
            }
            catch (Exception ex)
            {
                ExcelData.errCode = "404";
                ExcelData.errDesc = ex.Message;
                //_logger.LogError("Error -> UploadExcelReferencePriceService -> UploadExcelReferencePrice -> Excption: {0}", ex.Message);
            }

            return ExcelData;
        }

        private ResponseCheckFile CheckFile(string fName, string year)
        {
            string sheetName1 = "LPG Forecast";
            string sheetName2 = "กบน.";
            string sheetName3 = "Summary";
            ResponseCheckFile respone = new ResponseCheckFile { checkFile = true };
            int idx = 0;
            int Type = 0;
            int rowRead = 0;
            int colRead = 0;

            var fileName = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ReferencePrice\"}" + fName;
            var excelPack = new ExcelPackage();
            using (var stream = File.OpenRead(fileName))
            {
                excelPack.Load(stream);
            }

            foreach (var ws in excelPack.Workbook.Worksheets)
            {
                if (ws.Name.Contains(sheetName1))
                {
                    idx = ws.Index;
                    Type = 1;
                    respone.fileType = sheetName1;
                    break;
                }
                else if (ws.Name.Contains(sheetName2))
                {
                    idx = ws.Index;
                    Type = 2;
                    respone.fileType = sheetName2;
                    break;
                }
                else if (ws.Name.Contains(sheetName3))
                {
                    idx = ws.Index;
                    Type = 3;
                    respone.fileType = sheetName3;
                    break;
                }
            }

            switch (Type)
            {
                case 1:
                    if (CheckFileFormat1(fileName, idx, year, out rowRead, out colRead))
                    {
                        ReadExcel1(fileName, idx, rowRead, colRead);
                    }
                    else
                    {
                        ErrMessage = string.Format(ErrMessage, fName);
                        respone.checkFile = false;
                    }
                    break;
                case 2:
                    if (CheckFileFormat2(fileName, idx, year, out rowRead, out colRead))
                    {
                        ReadExcel2(fileName, idx, rowRead, colRead);
                    }
                    else
                    {
                        ErrMessage = string.Format(ErrMessage, fName);
                        respone.checkFile = false;
                    }
                    break;
                case 3:
                    if (CheckFileFormat3(fileName, idx, year, out rowRead))
                    {
                        ReadExcel3(fileName, idx, year, rowRead);
                    }
                    else
                    {
                        ErrMessage = string.Format(ErrMessage, fName);
                        respone.checkFile = false;
                    }
                    break;
                default:
                    ErrMessage = "ไฟล์ที่ Import ไม่ใช่ Excel Template สำหรับ Reference Price";
                    respone.checkFile = false;
                    break;
            }

            return respone;
        }

        /// <summary>
        /// ReadExcel Monthly
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="index"></param>
        /// <param name="rowRead"></param>
        /// <param name="colRead"></param>
        private void ReadExcel1(string fileName, int index, int rowRead, int colRead)
        {
            try
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
                    var ws = excelPack.Workbook.Worksheets[excelPack.Workbook.Worksheets.Count - 1];
                    List<int> listMonth = new List<int>();
                    for (int i = colRead; i < colRead + 13; i++)
                    {
                        string strDate = ws.Cells[3, i].Value + string.Empty;
                        try
                        {
                            listMonth.Add(DateTime.Parse(strDate).Month);
                        }
                        catch
                        {
                            double d = 0;
                            double.TryParse(strDate, out d);
                            if (d != 0)
                            {
                                listMonth.Add(DateTime.FromOADate(d).Month);
                            }

                        }
                    }

                    int checkInt = 0;
                    for (var Rows = 4; Rows < rowRead; Rows++)
                    {
                        if (!string.IsNullOrEmpty(ws.Cells[Rows, colRead].Value + string.Empty) && int.TryParse(ws.Cells[Rows, colRead].Value + string.Empty, out checkInt))
                        {
                            PriceDataItems items = new PriceDataItems();
                            items.Product = ws.Cells[Rows, 1].Value + string.Empty;
                            items.Unit = (Rows == 4 || Rows == 5) ? "USD/BBL" : "USD/TON";
                            foreach (var item in listMonth)
                            {
                                switch (item)
                                {
                                    case 1: items.M1 = (ws.Cells[Rows, colRead].Value == null) ? "0" : ws.Cells[Rows, colRead].Value + string.Empty; break;
                                    case 2: items.M2 = (ws.Cells[Rows, colRead + 1].Value == null) ? "0" : ws.Cells[Rows, colRead + 1].Value + string.Empty; break;
                                    case 3: items.M3 = (ws.Cells[Rows, colRead + 2].Value == null) ? "0" : ws.Cells[Rows, colRead + 2].Value + string.Empty; break;
                                    case 4: items.M4 = (ws.Cells[Rows, colRead + 3].Value == null) ? "0" : ws.Cells[Rows, colRead + 3].Value + string.Empty; break;
                                    case 5: items.M5 = (ws.Cells[Rows, colRead + 4].Value == null) ? "0" : ws.Cells[Rows, colRead + 4].Value + string.Empty; break;
                                    case 6: items.M6 = (ws.Cells[Rows, colRead + 5].Value == null) ? "0" : ws.Cells[Rows, colRead + 5].Value + string.Empty; break;
                                    case 7: items.M7 = (ws.Cells[Rows, colRead + 6].Value == null) ? "0" : ws.Cells[Rows, colRead + 6].Value + string.Empty; break;
                                    case 8: items.M8 = (ws.Cells[Rows, colRead + 7].Value == null) ? "0" : ws.Cells[Rows, colRead + 7].Value + string.Empty; break;
                                    case 9: items.M9 = (ws.Cells[Rows, colRead + 8].Value == null) ? "0" : ws.Cells[Rows, colRead + 8].Value + string.Empty; break;
                                    case 10: items.M10 = (ws.Cells[Rows, colRead + 9].Value == null) ? "0" : ws.Cells[Rows, colRead + 9].Value + string.Empty; break;
                                    case 11: items.M11 = (ws.Cells[Rows, colRead + 10].Value == null) ? "0" : ws.Cells[Rows, colRead + 10].Value + string.Empty; break;
                                    case 12: items.M12 = (ws.Cells[Rows, colRead + 11].Value == null) ? "0" : ws.Cells[Rows, colRead + 11].Value + string.Empty; break;
                                    default:
                                        break;
                                }
                            }
                            //var items = new PriceDataItems
                            //{
                            //    Product = ws.Cells[Rows, 1].Value + string.Empty,
                            //    Unit = (Rows == 4 || Rows == 5) ? "USD/BBL" : "USD/TON",

                            //    M1 = (ws.Cells[Rows, colRead].Value == null) ? "0" : ws.Cells[Rows, colRead].Value + string.Empty,
                            //    M2 = (ws.Cells[Rows, (colRead + 1)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 1)].Value + string.Empty,
                            //    M3 = (ws.Cells[Rows, (colRead + 2)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 2)].Value + string.Empty,
                            //    M4 = (ws.Cells[Rows, (colRead + 3)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 3)].Value + string.Empty,
                            //    M5 = (ws.Cells[Rows, (colRead + 4)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 4)].Value + string.Empty,
                            //    M6 = (ws.Cells[Rows, (colRead + 5)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 5)].Value + string.Empty,
                            //    M7 = (ws.Cells[Rows, (colRead + 6)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 6)].Value + string.Empty,
                            //    M8 = (ws.Cells[Rows, (colRead + 7)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 7)].Value + string.Empty,
                            //    M9 = (ws.Cells[Rows, (colRead + 8)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 8)].Value + string.Empty,
                            //    M10 = (ws.Cells[Rows, (colRead + 9)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 9)].Value + string.Empty,
                            //    M11 = (ws.Cells[Rows, (colRead + 10)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 10)].Value + string.Empty,
                            //    M12 = (ws.Cells[Rows, (colRead + 11)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 11)].Value + string.Empty
                            //};
                            ExcelPriceData_items1.Add(items);
                        }

                    }
                }

            }
            catch (Exception ex)
            {

                //_logger.LogError("Error -> UploadExcelReferencePriceService -> ReadExcel -> Excption: {0}", ex.Message);
            }

            //return ExcelPriceData;
        }

        /// <summary>
        /// ReadExcel GSPCost
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="index"></param>
        /// <param name="rowRead"></param>
        /// <param name="colRead"></param>
        private void ReadExcel2(string fileName, int index, int rowRead, int colRead)
        {
            try
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
                    var ws = excelPack.Workbook.Worksheets[index];

                    for (var Rows = 3; Rows < rowRead; Rows++)
                    {
                        if (!string.IsNullOrEmpty(ws.Cells[Rows, 1].Value + string.Empty))
                        {
                            var items = new PriceDataItems
                            {
                                Product = ws.Cells[Rows, 1].Value + string.Empty,
                                Unit = ws.Cells[Rows, 2].Value + string.Empty,

                                M1 = (ws.Cells[Rows, colRead].Value == null) ? "0" : ws.Cells[Rows, colRead].Value + string.Empty,
                                M2 = (ws.Cells[Rows, (colRead + 1)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 1)].Value + string.Empty,
                                M3 = (ws.Cells[Rows, (colRead + 2)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 2)].Value + string.Empty,
                                M4 = (ws.Cells[Rows, (colRead + 3)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 3)].Value + string.Empty,
                                M5 = (ws.Cells[Rows, (colRead + 4)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 4)].Value + string.Empty,
                                M6 = (ws.Cells[Rows, (colRead + 5)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 5)].Value + string.Empty,
                                M7 = (ws.Cells[Rows, (colRead + 6)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 6)].Value + string.Empty,
                                M8 = (ws.Cells[Rows, (colRead + 7)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 7)].Value + string.Empty,
                                M9 = (ws.Cells[Rows, (colRead + 8)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 8)].Value + string.Empty,
                                M10 = (ws.Cells[Rows, (colRead + 9)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 9)].Value + string.Empty,
                                M11 = (ws.Cells[Rows, (colRead + 10)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 10)].Value + string.Empty,
                                M12 = (ws.Cells[Rows, (colRead + 11)].Value == null) ? "0" : ws.Cells[Rows, (colRead + 11)].Value + string.Empty
                            };
                            ExcelPriceData_items1.Add(items);
                        }

                    }
                }

            }
            catch (Exception ex)
            {
                //_logger.LogError("Error -> UploadExcelReferencePriceService -> ReadExcel -> Excption: {0}", ex.Message);
            }

            //return ExcelPriceData;
        }

        /// <summary>
        /// ReadExcel PRISM
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="index"></param>
        /// <param name="rowRead"></param>
        private void ReadExcel3(string fileName, int index, string year, int rowRead)
        {
            try
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
                    var ws = excelPack.Workbook.Worksheets[index];

                    string unit = ws.Cells[8, 2].Value + string.Empty;

                    // ========== Find First index Start by Year  =============== //
                    List<string> ColumnNames = new List<string>();
                    for (int i = 1; i <= ws.Dimension.End.Column + 1; i++)
                    {
                        ColumnNames.Add((ws.Cells[6, i].Value == null) ? "" : ws.Cells[6, i].Value + string.Empty);
                    }

                    int columnIndexStart = ColumnNames.FindIndex(x => x == year);

                    // ========================================================== //

                    for (var Rows = 9; Rows < rowRead; Rows++)
                    {
                        var items = new PriceDataItems
                        {
                            Product = ws.Cells[Rows, 2].Value + string.Empty,
                            Unit = unit,

                            M1 = (ws.Cells[Rows, (columnIndexStart + 1)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 1)].Value + string.Empty,
                            M2 = (ws.Cells[Rows, (columnIndexStart + 2)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 2)].Value + string.Empty,
                            M3 = (ws.Cells[Rows, (columnIndexStart + 3)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 3)].Value + string.Empty,
                            M4 = (ws.Cells[Rows, (columnIndexStart + 4)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 4)].Value + string.Empty,
                            M5 = (ws.Cells[Rows, (columnIndexStart + 5)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 5)].Value + string.Empty,
                            M6 = (ws.Cells[Rows, (columnIndexStart + 6)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 6)].Value + string.Empty,
                            M7 = (ws.Cells[Rows, (columnIndexStart + 7)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 7)].Value + string.Empty,
                            M8 = (ws.Cells[Rows, (columnIndexStart + 8)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 8)].Value + string.Empty,
                            M9 = (ws.Cells[Rows, (columnIndexStart + 9)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 9)].Value + string.Empty,
                            M10 = (ws.Cells[Rows, (columnIndexStart + 10)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 10)].Value + string.Empty,
                            M11 = (ws.Cells[Rows, (columnIndexStart + 11)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 11)].Value + string.Empty,
                            M12 = (ws.Cells[Rows, (columnIndexStart + 12)].Value == null) ? "0" : ws.Cells[Rows, (columnIndexStart + 12)].Value + string.Empty
                        };
                        ExcelPriceData_items1.Add(items);
                    }
                }

            }
            catch (Exception ex)
            {
                //_logger.LogError("Error -> UploadExcelReferencePriceService -> ReadExcel -> Excption: {0}", ex.Message);
            }

            //return ExcelPriceData;
        }

        /// <summary>
        /// CheckFileFormat Monthly
        /// </summary>
        /// <param name="fName"></param>
        /// <param name="index"></param>
        /// <param name="year"></param>
        /// <param name="rowRead"></param>
        /// <param name="colRead"></param>
        /// <returns></returns>
        private bool CheckFileFormat1(string fName, int index, string year, out int rowRead, out int colRead)
        {
            var fileTemp = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ExcelTemplate\Template LPG Monthly Report.xlsx"}";
            var excelPack = new ExcelPackage();
            var excelPackTemp = new ExcelPackage();
            rowRead = 0;
            colRead = 0;

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

                var ws = excelPack.Workbook.Worksheets[excelPack.Workbook.Worksheets.Count - 1];
                var wsTemp = excelPackTemp.Workbook.Worksheets[excelPackTemp.Workbook.Worksheets.Count - 1];

                rowRead = wsTemp.Dimension.End.Row + 1;
                var colCnt = ws.Dimension.End.Column;

                //for (var Rows = 3; Rows < rowRead; Rows++)
                //{
                int Rows = 3;
                var Data = (ws.Cells[Rows, 1].Value == null) ? "" : ws.Cells[Rows, 1].Value + string.Empty;
                var TempData = (wsTemp.Cells[Rows, 1].Value == null) ? "" : wsTemp.Cells[Rows, 1].Value + string.Empty;

                Data = replaceSpecialCharacters(Data);
                TempData = replaceSpecialCharacters(TempData);

                if (Data != TempData)
                {
                    ErrMessage += "ไฟล์ที่ Import ไม่ตรงกับ Template LPG Monthly Report.xlsx ที่มีในระบบกรุณาตรวจสอบไฟล์อีกครั้ง </br>";
                    File.Delete(fName);
                    return false;
                }
                // }

                for (var col = 2; col < colCnt; col++)
                {
                    string DataY = "";
                    string strDate = ws.Cells[3, col].Value + string.Empty;

                    if (!strDate.Contains("Q"))
                    {
                        try
                        {

                            DataY = DateTime.Parse(strDate).ToString("yyyy", new CultureInfo("en-US"));
                        }
                        catch
                        {
                            double d = 0;
                            double.TryParse(strDate, out d);
                            if (d != 0)
                            {
                                DataY = DateTime.FromOADate(d).ToString("yyyy", new CultureInfo("en-US"));
                            }

                        }

                        if (DataY == year)
                        {
                            colRead = col;
                            break;
                        }
                    }
                }

                if (colRead == 0)
                {
                    ErrMessage += "ไฟล์ที่ Import {0} ไม่มีข้อมูลปี " + year + "</br>";
                    File.Delete(fName);

                    return false;
                }

            }
            catch (Exception ex)
            {
                //_logger.LogError("Error -> UploadExcelReferencePriceService -> CheckFileFormat -> Excption: {0}", ex.Message);
                ErrMessage += "Error ระบบ " + ex.Message + "</br>";
                File.Delete(fName);
                return false;
            }

            return true;
        }

        /// <summary>
        /// CheckFileFormat GSPCost
        /// </summary>
        /// <param name="fName"></param>
        /// <param name="index"></param>
        /// <param name="year"></param>
        /// <param name="rowRead"></param>
        /// <param name="colRead"></param>
        /// <returns></returns>
        private bool CheckFileFormat2(string fName, int index, string year, out int rowRead, out int colRead)
        {
            var fileTemp = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ExcelTemplate\\Template GSPCost_จผก.xlsx"}";
            var excelPack = new ExcelPackage();
            var excelPackTemp = new ExcelPackage();
            rowRead = 0;
            colRead = 0;

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

                var ws = excelPack.Workbook.Worksheets[index];
                var wsTemp = excelPackTemp.Workbook.Worksheets[0];

                rowRead = wsTemp.Dimension.End.Row + 1;
                var colCnt = wsTemp.Dimension.End.Column + 1;

                for (var Rows = 1; Rows < rowRead; Rows++)
                {
                    var Data = (ws.Cells[Rows, 1].Value == null) ? "" : ws.Cells[Rows, 1].Value + string.Empty;
                    var TempData = (wsTemp.Cells[Rows, 1].Value == null) ? "" : wsTemp.Cells[Rows, 1].Value + string.Empty;

                    Data = replaceSpecialCharacters(Data);
                    TempData = replaceSpecialCharacters(TempData);

                    if (Data != TempData)
                    {
                        ErrMessage += "ไฟล์ที่ Import ไม่ตรงกับ Template GSPCost_จผก.xlsx ที่มีในระบบกรุณาตรวจสอบไฟล์อีกครั้ง </br>";
                        File.Delete(fName);
                        return false;
                    }
                }

                for (var col = 3; col < colCnt; col++)
                {
                    string DataY = "";
                    try
                    {
                        string strDate = ws.Cells[2, col].Value + string.Empty;
                        DataY = DateTime.Parse(strDate).ToString("yyyy", new CultureInfo("en-US"));
                    }
                    catch
                    {
                        double d = 0;
                        double.TryParse(ws.Cells[2, col].Value + string.Empty, out d);
                        if (d != 0)
                        {
                            DataY = DateTime.FromOADate(d).ToString("yyyy", new CultureInfo("en-US"));
                        }
                    }

                    if (DataY == year)
                    {
                        colRead = col;
                        break;
                    }
                }

                if (colRead == 0)
                {
                    ErrMessage += "ไฟล์ที่ Import {0} ไม่มีข้อมูลปี " + year + "</br>";
                    File.Delete(fName);
                    return false;
                }
            }
            catch (Exception ex)
            {
                //_logger.LogError("Error -> UploadExcelReferencePriceService -> CheckFileFormat -> Excption: {0}", ex.Message);
                ErrMessage += "Error ระบบ " + ex.Message + "</br>";
                File.Delete(fName);
                return false;
            }

            return true;
        }

        /// <summary>
        /// CheckFileFormat PRISM
        /// </summary>
        /// <param name="fName"></param>
        /// <param name="index"></param>
        /// <param name="year"></param>
        /// <param name="rowRead"></param>
        /// <returns></returns>
        private bool CheckFileFormat3(string fName, int index, string year, out int rowRead)
        {
            var fileTemp = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ExcelTemplate\Template PRISM Petrochemical Price Forecast.xlsx"}";
            var excelPack = new ExcelPackage();
            var excelPackTemp = new ExcelPackage();
            rowRead = 0;

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

                var ws = excelPack.Workbook.Worksheets[index];
                var wsTemp = excelPackTemp.Workbook.Worksheets[0];

                rowRead = wsTemp.Dimension.End.Row + 1;
                //var colCnt = wsTemp.Dimension.End.Column;

                for (var Rows = 2; Rows <= 8; Rows++)
                {
                    var Data = (ws.Cells[Rows, 2].Value == null) ? "" : ws.Cells[Rows, 2].Value + string.Empty;
                    var TempData = (wsTemp.Cells[Rows, 2].Value == null) ? "" : wsTemp.Cells[Rows, 2].Value + string.Empty;

                    Data = replaceSpecialCharacters(Data);
                    TempData = replaceSpecialCharacters(TempData);

                    if (Data != TempData)
                    {

                        ErrMessage += "ไฟล์ที่ Import ไม่ตรงกับ Template PRISM Petrochemical Price Forecast.xlsx ที่มีในระบบกรุณาตรวจสอบไฟล์อีกครั้ง </br>";
                        File.Delete(fName);
                        return false;
                    }
                }

                List<string> ColumnNames = new List<string>();
                for (int i = 1; i <= ws.Dimension.End.Column + 1; i++)
                {
                    ColumnNames.Add((ws.Cells[6, i].Value == null) ? "" : ws.Cells[6, i].Value + string.Empty);
                }

                int columnIndex = ColumnNames.FindIndex(x => x == year);
                if (columnIndex.Equals(-1)) {
                    ErrMessage += "ไฟล์ที่ Import {0} ไม่มีข้อมูลปี " + year + "</br>";
                    File.Delete(fName);
                    return false;
                }

                //string sDate = ws.Cells[6, 3].Value + string.Empty;
                //if (sDate != year)
                //{
                //    ErrMessage += "ไฟล์ที่ Import {0} ไม่มีข้อมูลปี " + year + "</br>";
                //    File.Delete(fName);
                //    return false;
                //}

            }
            catch (Exception ex)
            {
                //_logger.LogError("Error -> UploadExcelReferencePriceService -> CheckFileFormat -> Excption: {0}", ex.Message);

                ErrMessage += "Error ระบบ " + ex.Message + "</br>";
                File.Delete(fName);
                return false;
            }

            return true;
        }

        private String replaceSpecialCharacters(String strMaster)
        {
            String strReplace = strMaster;
            try
            {
                strReplace = Regex.Replace(strReplace, @"[^0-9a-zA-Zก-ฮ]+", "").ToString().ToLower();
            }
            catch (Exception ex)
            {
                ErrMessage += "Error ระบบ " + ex.Message + "</br>";
                return ErrMessage;
            }

            return strReplace;
        }

    }
}
