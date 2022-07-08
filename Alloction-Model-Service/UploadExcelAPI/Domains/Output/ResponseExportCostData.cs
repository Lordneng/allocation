using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UploadExcelAPI.Domains.Output
{
    public class ResponseExportCostData
    {
        public string _id { get; set; }
        public int year { get; set; }
        public string cost { get; set; }
        public string product { get; set; }
        public int rowOrder { get; set; }
        public int version { get; set; }
        public decimal M1 { get; set; }
        public decimal M2 { get; set; }
        public decimal M3 { get; set; }
        public decimal M4 { get; set; }
        public decimal M5 { get; set; }
        public decimal M6 { get; set; }
        public decimal M7 { get; set; }
        public decimal M8 { get; set; }
        public decimal M9 { get; set; }
        public decimal M10 { get; set; }
        public decimal M11 { get; set; }
        public decimal M12 { get; set; }
        public string createDate { get; set; }
        public string updateDate { get; set; }
    }

    public class ResponseExportPriceData
    {
        public string _id { get; set; }
        public int rowOrder { get; set; }
        public string product { get; set; }
        public string unit { get; set; }
        public string createDate { get; set; }
        public string updateDate { get; set; }
        public string referencePriceNameTo { get; set; }
        public string referencePriceNameFrom { get; set; }
        public int year { get; set; }
        public int version { get; set; }
        public decimal M1 { get; set; }
        public decimal M2 { get; set; }
        public decimal M3 { get; set; }
        public decimal M4 { get; set; }
        public decimal M5 { get; set; }
        public decimal M6 { get; set; }
        public decimal M7 { get; set; }
        public decimal M8 { get; set; }
        public decimal M9 { get; set; }
        public decimal M10 { get; set; }
        public decimal M11 { get; set; }
        public decimal M12 { get; set; }
    }

    public class ResponseExportManualData 
    {
        public string _id { get; set; }
        public string product { get; set; }
        public string unit { get; set; }
        public string source { get; set; }
        public string demand { get; set; }
        public string deliveryPoint { get; set; }
        public int month { get; set; }
        public int year { get; set; }
        public string value { get; set; }
        public string rowOrder { get; set; }
        public int version { get; set; }
        public string createDate { get; set; }
        public string updateDate { get; set; }
    }

    public class ResponseExportSummary : errMessage
    {
        public string path { get; set; }
    }

}
