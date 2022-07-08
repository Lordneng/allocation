using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Domains
{
    public class ResponseExcelPrice : errMessage
    {
        public string filePath1 { get; set; }
        public string filePath2 { get; set; }
        public string filePath3 { get; set; }
        public string fileName1 { get; set; }
        public string fileName2 { get; set; }
        public string fileName3 { get; set; }
        public string fileType1 { get; set; }
        public string fileType2 { get; set; }
        public string fileType3 { get; set; }
        public List<PriceDataItems> data { get; set; }
    }

    public class ResponseCheckFile
    {
        public bool checkFile { get; set; }
        public string fileType { get; set; }
    }

    public class PriceDataItems
    {
        public string M1 { get; set; }
        public string M2 { get; set; }
        public string M3 { get; set; }
        public string M4 { get; set; }
        public string M5 { get; set; }
        public string M6 { get; set; }
        public string M7 { get; set; }
        public string M8 { get; set; }
        public string M9 { get; set; }
        public string M10 { get; set; }
        public string M11 { get; set; }
        public string M12 { get; set; }
        public string Product { get; set; }
        public string Unit { get; set; }
    }
}
