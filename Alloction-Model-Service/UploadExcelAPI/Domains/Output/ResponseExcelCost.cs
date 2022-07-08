using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UploadExcelAPI.Domains.Output
{
    public class ResponseExcelCost : errMessage
    {
        public string path { get; set; }
        public string fileName { get; set; }
        public string date { get; set; }
        public List<DataItems> data { get; set; }
    }

    public class DataItems
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
        public string product { get; set; }
        public string Cost { get; set; }
    }

    public class errMessage
    {
        public string errCode { get; set; }
        public string errDesc { get; set; }
    }

}
