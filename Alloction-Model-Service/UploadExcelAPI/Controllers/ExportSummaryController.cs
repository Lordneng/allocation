using Microsoft.AspNetCore.Mvc;
using UploadExcelAPI.Domains.Output;
using UploadExcelAPI.Services;

namespace UploadExcelAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExportSummaryController : Controller
    {
        private readonly IExportSummaryService _exportSummaryService;

        public ExportSummaryController(IExportSummaryService exportSummaryService)
        {
            _exportSummaryService = exportSummaryService;
        }

        [HttpPost]
        public ResponseExportSummary ExportSummary(string Year)
        {
            return _exportSummaryService.ExportSummary(Year);
        }
    }
}
