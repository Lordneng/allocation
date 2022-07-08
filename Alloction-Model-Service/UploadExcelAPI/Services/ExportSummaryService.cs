using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Services
{
    public class ExportSummaryService : IExportSummaryService
    {
        private readonly ILogger<ExportSummaryService> _logger;
        private readonly IConfiguration _configuration;

        public ExportSummaryService(ILogger<ExportSummaryService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public ResponseExportSummary ExportSummary(string Year)
        {
            var respone = new ResponseExportSummary();

            try
            {
                var CostData = GetCostData(Year).GetAwaiter().GetResult();
                var PriceData = GetReferencePricesData(Year).GetAwaiter().GetResult();
                var CostManualsData = GetFullCostManualsData(Year).GetAwaiter().GetResult();
                var PricesManualData = GetSellingPricesManualData(Year).GetAwaiter().GetResult();
                                
                string fileName = "CalcMargin" + DateTime.Now.ToString("_yyyyMMdd_HHmmss") + ".xlsx";
                var templatePath = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\ExcelTemplate\Template Calc Margin.xlsx"}";
                var exportPath = $"{Directory.GetCurrentDirectory()}{@"\FileUpload\Summary\"}" +  fileName;
                string returnPath = "FileUpload/Summary/" + fileName;
                FileInfo template = new FileInfo(templatePath);

                using (var package = new ExcelPackage(template))
                {
                    var workbook = package.Workbook;
                    int r = 0;

                    #region *** Sheet 1 Cost Data

                    var worksheet = workbook.Worksheets[0];
                    string[] strWhere = { "ต้นทุน Ethane", "ต้นทุน Propane", "ต้นทุน LPG - Feedstock", "ต้นทุน LPG - Domistic ผ่าน PTT Tank (ยังไม่รวมค่า Tariff ของ PTT Tank)", "ต้นทุน LPG - Domestic (MT & BRP)", "ต้นทุน LPG - สนพ. (Deloitte)", "ต้นทุน NGL" };
                    int[] rowStart = { 4, 13, 22, 31, 40, 48, 56 };

                    for (int i = 0; i < 7; i++)
                    {
                        r = rowStart[i];
                        var lstData = CostData.Where(x => x.cost.Contains(strWhere[i])).OrderBy(o => o.rowOrder);

                        foreach (var item in lstData)
                        {
                            worksheet.Cells["B" + r].Value = item.product;
                            worksheet.Cells["C" + r].Value = item.M1;
                            worksheet.Cells["D" + r].Value = item.M2;
                            worksheet.Cells["E" + r].Value = item.M3;
                            worksheet.Cells["F" + r].Value = item.M4;
                            worksheet.Cells["G" + r].Value = item.M5;
                            worksheet.Cells["H" + r].Value = item.M6;
                            worksheet.Cells["I" + r].Value = item.M7;
                            worksheet.Cells["J" + r].Value = item.M8;
                            worksheet.Cells["K" + r].Value = item.M9;
                            worksheet.Cells["L" + r].Value = item.M10;
                            worksheet.Cells["M" + r].Value = item.M11;
                            worksheet.Cells["N" + r].Value = item.M12;
                            r++;
                        }
                    }

                    #endregion

                    #region *** Sheet 2 ReferencePrices Data

                    var worksheet2 = workbook.Worksheets[1];
                    var lstRefPrice = PriceData.OrderBy(o => o.rowOrder);
                    r = 4;

                    foreach (var item in lstRefPrice)
                    {
                        worksheet2.Cells["A" + r].Value = item.product;
                        worksheet2.Cells["B" + r].Value = item.unit;

                        worksheet2.Cells["D" + r].Value = item.M1;
                        worksheet2.Cells["E" + r].Value = item.M2;
                        worksheet2.Cells["F" + r].Value = item.M3;
                        worksheet2.Cells["G" + r].Value = item.M4;
                        worksheet2.Cells["H" + r].Value = item.M5;
                        worksheet2.Cells["I" + r].Value = item.M6;
                        worksheet2.Cells["J" + r].Value = item.M7;
                        worksheet2.Cells["K" + r].Value = item.M8;
                        worksheet2.Cells["L" + r].Value = item.M9;
                        worksheet2.Cells["M" + r].Value = item.M10;
                        worksheet2.Cells["N" + r].Value = item.M11;
                        worksheet2.Cells["O" + r].Value = item.M12;
                        r++;
                    }
                    #endregion

                    #region *** Sheet 3 Full Cost Manuals Data

                    var worksheet3 = workbook.Worksheets[3];

                    foreach (var item in CostManualsData)
                    {
                        string _cell = FindCellNumber(item.month, item.product, item.source, item.demand, item.deliveryPoint);

                        if (!string.IsNullOrEmpty(_cell))
                            worksheet3.Cells[_cell].Value = item.value;
                    }

                    #endregion

                    #region *** Sheet 4 Selling Prices Manual Data

                    var worksheet4 = workbook.Worksheets[4];

                    foreach (var item in PricesManualData)
                    {
                        string _cell = FindCellNumber(item.month, item.product, item.source, item.demand, item.deliveryPoint);

                        if (!string.IsNullOrEmpty(_cell))
                            worksheet4.Cells[_cell].Value = item.value;
                    }

                    #endregion

                    package.SaveAs(new FileInfo(exportPath));
                }
                respone = new ResponseExportSummary
                {
                    path = returnPath
                };
                
            }
            catch (Exception ex)
            {
                respone = new ResponseExportSummary
                {
                    errCode = "404",
                    errDesc= ex.Message
                };
            }

            return respone;
        }

        public async Task<List<ResponseExportCostData>> GetCostData(string Year)
        {
            var response = new List<ResponseExportCostData>();
            HttpClient client = new HttpClient();
            var url = _configuration.GetSection("ApiNestJs").GetSection("Url").Value + "costs/" + Year + "/10";

            var responseMessage = await client.GetAsync(url);

            if (responseMessage.IsSuccessStatusCode)
            {
                var resultMessage = await responseMessage.Content.ReadAsStringAsync();

                response = JsonConvert.DeserializeObject<List<ResponseExportCostData>>(resultMessage);
            }

            return response;
        }

        public async Task<List<ResponseExportPriceData>> GetReferencePricesData(string Year)
        {
            var response = new List<ResponseExportPriceData>();
            HttpClient client = new HttpClient();
            var url = _configuration.GetSection("ApiNestJs").GetSection("Url").Value + "reference-prices/" + Year + "/1";

            var responseMessage = await client.GetAsync(url);

            if (responseMessage.IsSuccessStatusCode)
            {
                var resultMessage = await responseMessage.Content.ReadAsStringAsync();

                response = JsonConvert.DeserializeObject<List<ResponseExportPriceData>>(resultMessage);
            }

            return response;
        }

        public async Task<List<ResponseExportManualData>> GetFullCostManualsData(string Year)
        {
            var response = new List<ResponseExportManualData>();
            HttpClient client = new HttpClient();
            var url = _configuration.GetSection("ApiNestJs").GetSection("Url").Value + "full-cost-manuals/" + Year;

            var responseMessage = await client.GetAsync(url);

            if (responseMessage.IsSuccessStatusCode)
            {
                var resultMessage = await responseMessage.Content.ReadAsStringAsync();

                response = JsonConvert.DeserializeObject<List<ResponseExportManualData>>(resultMessage);
            }

            return response;
        }

        public async Task<List<ResponseExportManualData>> GetSellingPricesManualData(string Year)
        {
            var response = new List<ResponseExportManualData>();
            HttpClient client = new HttpClient();
            var url = _configuration.GetSection("ApiNestJs").GetSection("Url").Value + "full-cost-manuals/" + Year;

            var responseMessage = await client.GetAsync(url);

            if (responseMessage.IsSuccessStatusCode)
            {
                var resultMessage = await responseMessage.Content.ReadAsStringAsync();

                response = JsonConvert.DeserializeObject<List<ResponseExportManualData>>(resultMessage);
            }

            return response;
        }

        public string FindCellNumber(int month, string product, string source, string demand, string deliveryPoint)
        {
            string _cell = string.Empty;

            //source = "GSP RY";
            //demand = "PAP";
            //deliveryPoint = "PTT TANK (Truck)";
            //product = "LPG";

            switch (month)
            {
                case 1:
                    _cell = "E";
                    break;
                case 2:
                    _cell = "F";
                    break;
                case 3:
                    _cell = "G";
                    break;
                case 4:
                    _cell = "H";
                    break;
                case 5:
                    _cell = "I";
                    break;
                case 6:
                    _cell = "J";
                    break;
                case 7:
                    _cell = "K";
                    break;
                case 8:
                    _cell = "L";
                    break;
                case 9:
                    _cell = "M";
                    break;
                case 10:
                    _cell = "N";
                    break;
                case 11:
                    _cell = "O";
                    break;
                case 12:
                    _cell = "P";
                    break;
                default:
                    break;
            }

            switch (product.ToUpper())
            {
                case "C2":
                    if (demand.Contains("C2 - OLE1"))
                    {
                        return _cell += "25";
                    }
                    else if (demand.Contains("C2 - OLE2"))
                    {
                        return _cell += "26";
                    }
                    else if (demand.Contains("C2 - OLE3"))
                    {
                        return _cell += "27";
                    }
                    else if (demand.Contains("C2 - OLE3(Vol > 274T / Hr)"))
                    {
                        return _cell += "28";
                    }
                    else if (demand.Contains("C2 - OLE3(SPOT) GSP5"))
                    {
                        return _cell += "29";
                    }
                    else if (demand.Contains("C2 - OLE3(Hybrid) supplement C2"))
                    {
                        return _cell += "30";
                    }
                    else if (demand.Contains("C2 - SCG"))
                    {
                        return _cell += "31";
                    }

                    break;
                case "C3":
                    if (source.Contains("GSP RY") && demand.Contains("GC") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "36";
                    }
                    else if (source.Contains("Import") && demand.Contains("GC") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "37";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("HMC") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "39";
                    }
                    else if (source.Contains("Import") && demand.Contains("HMC") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "40";
                    }
                    else if (source.Contains("GSP RY") && demand == "PTTAC" && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "42";
                    }
                    else if (source.Contains("Import") && demand.Contains("PTTAC") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "43";
                    }
                    else if (source.Contains("GSP RY") && demand == "PTTAC (Spot)" && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "44";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("SCG Tier 1 : 0 - 48 KT") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "46";
                    }
                    else if (source.Contains("Import") && demand.Contains("SCG Tier 1 : 0 - 48 KT") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "47";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("SCG Tier 2 : 48.001 - 400 KT") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "48";
                    }
                    else if (source.Contains("Import") && demand.Contains("SCG Tier 2 : 48.001 - 400 KT") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "49";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Ssubstitued C3 - SCG") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "50";
                    }
                    else if (source.Contains("Import") && demand.Contains("Ssubstitued C3 - SCG") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "51";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("C3 truck") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "52";
                    }
                    break;
                case "LPG":
                    if (source.Contains("GSP RY") && demand.Contains("GSP (LPG) to GC") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "57";
                    }
                    else if (source.Contains("Import") && demand.Contains("Import (LPG) to GC") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "58";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("LPG : 48 - 240 KT") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "60";
                    }
                    else if (source.Contains("GSP RY") && demand == "Additional LPG Tier 1 : 1 - 384 KT" && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "61";
                    }
                    else if (source.Contains("GSP RY") && demand == "Additional LPG Tier 2 : 384.001 - 720 KT" && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "62";
                    }
                    else if (source.Contains("Import") && demand.Contains("SWAP LPG : Max 400 KT") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "63";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("PTTOR (LPG ไม่มีกลิ่น)") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "64";
                    }
                    else if (source.Contains("Export") && demand.Contains("TBU") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "65";
                    }
                    else if (source.Contains("Import") && demand.Contains("PTTOR") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "66";
                    }
                    else if (source.Contains("Import") && demand.Contains("SGP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "67";
                    }
                    else if (source.Contains("Import") && demand.Contains("UGP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "68";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("PTTOR") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "69";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("PTTOR") && deliveryPoint.Contains("BRP"))
                    {
                        return _cell += "70";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("PTTOR") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "71";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("PTTOR") && deliveryPoint == "PTT TANK (Truck)")
                    {
                        return _cell += "72";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("SGP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "73";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("UGP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "74";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("BCP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "75";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("BCP") && deliveryPoint.Contains("PTT TANK"))
                    {
                        return _cell += "76";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Big gas") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "77";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Big gas") && deliveryPoint.Contains("PTT TANK"))
                    {
                        return _cell += "78";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("PAP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "79";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("PAP") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "80";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("PAP") && deliveryPoint == "PTT TANK (Truck)")
                    {
                        return _cell += "81";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("WP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "82";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("WP") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "83";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Chevron") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "84";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("IRPC") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "85";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("IRPC") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "86";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Atlas") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "87";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Atlas") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "88";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("ESSO") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "89";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("ESSO") && deliveryPoint.Contains("BRP"))
                    {
                        return _cell += "90";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("ESSO") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "91";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("UNO") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "92";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Orchid") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "93";
                    }
                    else if (source.Contains("IRPC") && demand.Contains("PTTOR") && deliveryPoint.Contains("IRPC"))
                    {
                        return _cell += "94";
                    }
                    else if (source.Contains("IRPC") && demand.Contains("WP") && deliveryPoint.Contains("IRPC"))
                    {
                        return _cell += "95";
                    }
                    else if (source.Contains("IRPC") && demand.Contains("Atlas") && deliveryPoint.Contains("IRPC"))
                    {
                        return _cell += "96";
                    }
                    else if (source.Contains("GC") && demand.Contains("PTTOR") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "97";
                    }
                    else if (source.Contains("GC") && demand.Contains("PTTOR") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "98";
                    }
                    else if (source.Contains("GC") && demand.Contains("PTTOR") && deliveryPoint == "PTT TANK (Truck)")
                    {
                        return _cell += "99";
                    }
                    else if (source.Contains("GC") && demand.Contains("BCP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "100";
                    }
                    else if (source.Contains("GC") && demand.Contains("BCP") && deliveryPoint.Contains("PTT TANK"))
                    {
                        return _cell += "101";
                    }
                    else if (source.Contains("GC") && demand.Contains("PAP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "102";
                    }
                    else if (source.Contains("GC") && demand.Contains("PAP") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "103";
                    }
                    else if (source.Contains("GC") && demand.Contains("PAP") && deliveryPoint == "PTT TANK (Truck)")
                    {
                        return _cell += "104";
                    }
                    else if (source.Contains("GC") && demand.Contains("WP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "105";
                    }
                    else if (source.Contains("GC") && demand.Contains("WP") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "106";
                    }
                    else if (source.Contains("GC") && demand.Contains("IRPC") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "107";
                    }
                    else if (source.Contains("GC") && demand.Contains("IRPC") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "108";
                    }
                    else if (source.Contains("GC") && demand.Contains("Atlas") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "109";
                    }
                    else if (source.Contains("GC") && demand.Contains("Atlas") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "110";
                    }
                    else if (source.Contains("GC") && demand.Contains("ESSO") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "111";
                    }
                    else if (source.Contains("GC") && demand.Contains("ESSO") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "112";
                    }
                    else if (source.Contains("GC") && demand.Contains("Orchid") && deliveryPoint == "PTT TANK")
                    {
                        return _cell += "113";
                    }
                    else if (source.Contains("SPRC") && demand.Contains("SGP") && deliveryPoint.Contains("MT"))
                    {
                        return _cell += "114";
                    }
                    else if (source.Contains("SPRC") && demand.Contains("PTTOR") && deliveryPoint.Contains("SPRC"))
                    {
                        return _cell += "115";
                    }
                    else if (source.Contains("SPRC") && demand.Contains("PAP") && deliveryPoint.Contains("SPRC"))
                    {
                        return _cell += "116";
                    }
                    else if (source.Contains("SPRC") && demand.Contains("WP") && deliveryPoint.Contains("SPRC"))
                    {
                        return _cell += "117";
                    }
                    else if (source.Contains("SPRC") && demand.Contains("Atlas") && deliveryPoint.Contains("SPRC"))
                    {
                        return _cell += "118";
                    }
                    else if (source.Contains("PTTEP (LKB)") && demand.Contains("PTTOR") && deliveryPoint == "PTTEP/LKB (Truck)")
                    {
                        return _cell += "119";
                    }
                    else if (source.Contains("GSP KHM") && demand.Contains("PTTOR") && deliveryPoint.Contains("GSP KHM"))
                    {
                        return _cell += "120";
                    }
                    break;
                case "NGL":
                    if (source.Contains("GSP RY") && demand.Contains("GC") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "124";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("SCG") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "125";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Export") && deliveryPoint.Contains("MT/PTT TANK"))
                    {
                        return _cell += "126";
                    }
                    else if (source.Contains("GSP KHM") && demand.Contains("Export") && deliveryPoint.Contains("GSP KHM"))
                    {
                        return _cell += "127";
                    }
                    else if (source.Contains("GSP KHM") && demand.Contains("IRPC") && deliveryPoint.Contains("GSP KHM"))
                    {
                        return _cell += "128";
                    }
                    break;
                case "PENTANE":
                    if (source.Contains("GSP RY") && demand.Contains("SCG") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "132";
                    }
                    break;
                case "CO2":
                    if (source.Contains("GSP RY") && demand.Contains("Praxair") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "136";
                    }
                    else if (source.Contains("GSP RY") && demand.Contains("Linde") && deliveryPoint.Contains("GSP RY"))
                    {
                        return _cell += "137";
                    }
                    break;
                default:
                    break;
            }

            return _cell;
        }
    }

}
