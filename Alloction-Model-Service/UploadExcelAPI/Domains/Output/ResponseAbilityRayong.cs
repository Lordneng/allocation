using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Domains.Output
{
    public class ResponseAbilityRayong : errMessage
    {
        public string path { get; set; }
        public string fileName { get; set; }
        public string startDate { get; set; }
        public List<AbilityItems> ability { get; set; }
        public string Remark { get; set; }
        public List<dynamic> monthNow { get; set; }
        public List<dynamic> p1 { get; set; }
        public List<dynamic> p2 { get; set; }
        public List<dynamic> p3 { get; set; }
        public List<dynamic> p4 { get; set; }
        public List<dynamic> p5 { get; set; }
        public List<dynamic> p6 { get; set; }
        public List<dynamic> p7 { get; set; }
        public List<dynamic> p8 { get; set; }
        public List<dynamic> p9 { get; set; }
        public List<dynamic> p10 { get; set; }
        public List<dynamic> p11 { get; set; }
        public List<dynamic> p12 { get; set; }
    }

    public class AbilityItems
    {
        public string productHeadder { get; set; }
        public string product { get; set; }
        public string rowOrder { get; set; }
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
    }

    public class Items1
    {
        public string name { get; set; }
        public string createDate { get; set; }
        public string product { get; set; }
        public string rowOrder { get; set; }
        public string GSP1 { get; set; }
        public string GSP2 { get; set; }
        public string GSP3 { get; set; }
        public string ESP { get; set; }
        public string GSP5 { get; set; }
        public string GSP6 { get; set; }
        public string TOTAL { get; set; }
        public string AVG { get; set; }

    }

    public class Items2
    {
        public string name { get; set; }
        public string createDate { get; set; }
        public string product { get; set; }
        public string rowOrder { get; set; }
        public string GSP1 { get; set; }
        public string GSP2 { get; set; }
        public string GSP3 { get; set; }
        public string GSP5 { get; set; }
        public string GSP6 { get; set; }
        public string TOTAL { get; set; }

    }

    public class Items3
    {
        public string name { get; set; }
        public string createDate { get; set; }
        public string product { get; set; }
        public string rowOrder { get; set; }
        public string GSP1 { get; set; }
        public string GSP2 { get; set; }
        public string GSP3 { get; set; }
        public string GSP5 { get; set; }
        public string GSP6 { get; set; }
        public string STAB { get; set; }
        public string TOTAL { get; set; }

    }

    public class Items4
    {
        public string name { get; set; }
        public string createDate { get; set; }
        public string product { get; set; }
        public string rowOrder { get; set; }
        public string GSP1 { get; set; }
        public string GSP2 { get; set; }
        public string GSP3 { get; set; }
        public string GSP5 { get; set; }
        public string GSP6 { get; set; }
        public string TOTAL { get; set; }
        public string LPGPetro { get; set; }
        public string LPGDomestic { get; set; }

    }

    public class Items5
    {
        public string name { get; set; }
        public string createDate { get; set; }
        public string product { get; set; }
        public string rowOrder { get; set; }
        public string LOWCO2 { get; set; }
        public string HIGHCO2 { get; set; }
        public string TOTAL { get; set; }
        public string TONHR { get; set; }

    }

    public class Items6
    {
        public string name { get; set; }
        public string createDate { get; set; }
        public string product { get; set; }
        public string rowOrder { get; set; }
        public string GSP1 { get; set; }
        public string GSP2 { get; set; }
        public string GSP3 { get; set; }
        //public string ESP { get; set; }
        public string GSP5 { get; set; }
        public string GSP6 { get; set; }
        public string TOTAL { get; set; }
    }

}
