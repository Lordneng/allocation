using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UploadExcelAPI.Domains.Output
{
    public class ResponseVolumeConstrain : errMessage
    {
        public string path { get; set; }
        public string fileName { get; set; }
        public string startDate { get; set; }
        public List<VolumeItems> data { get; set; }
    }

    public class VolumeItems
    {
        public string rowOrder { get; set; }
        public string product { get; set; }
        public string unit { get; set; }
        public string source { get; set; }
        public string demand { get; set; }
        public string deliveryPoint { get; set; }
        public string min { get; set; }
        public string max { get; set; }
        public bool isCalculate { get; set; }
    }
}
