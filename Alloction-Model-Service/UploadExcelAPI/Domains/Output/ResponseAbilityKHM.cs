using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UploadExcelAPI.Domains.Output
{
    public class ResponseAbilityKHM : errMessage
    {
        public string path { get; set; }
        public string fileName { get; set; }
        public int month { get; set; }
        public int year { get; set; }
        public string dateFormat { get; set; }
        public List<AbilityItemsKHM> data { get; set; }
    }

    public class AbilityItemsKHM
    {
        public string rowOrder { get; set; }
        public string month { get; set; }
        public string year { get; set; }
        public string feedGas { get; set; }
        public string mp { get; set; }
        public string lp { get; set; }
        public string total { get; set; }
        public string GAS_USED { get; set; }
        public string lpg { get; set; }
        public string ngl { get; set; }
    }


}
