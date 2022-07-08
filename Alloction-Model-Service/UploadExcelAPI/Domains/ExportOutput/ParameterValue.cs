using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Domains.ExportOutput
{
    public class ParameterValue
    {
        public string Collection { get; set; }
        public string Query { get; set; }
        public string Condition { get; set; }

        public IEnumerable<IInput.IItem> Items { get; set; }
    }

    public class OutputParameterValue
    {
        public string Collection { get; set; }
        public string Query { get; set; }
        public string Condition { get; set; }

        public IEnumerable<IOutput.IItem> Items { get; set; }
    }
}
