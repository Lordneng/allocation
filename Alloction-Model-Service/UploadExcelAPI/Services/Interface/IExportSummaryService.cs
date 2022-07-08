using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Services
{
    public interface IExportSummaryService
    {
        public ResponseExportSummary ExportSummary(string Year);
    }
}
