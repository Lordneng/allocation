using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;
using UploadExcelAPI.Services;

namespace UploadExcelAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadExcelCostController : Controller
    {
        private readonly IUploadExcelCostService _uploadExcelCostService;

        public UploadExcelCostController(IUploadExcelCostService uploadExcelCostService)
        {
            _uploadExcelCostService = uploadExcelCostService;
        }

        [HttpPost]
        public ResponseExcelCost UploadExcelCost(IFormFile file, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            return _uploadExcelCostService.UploadExcelCost(file, hostingEnvironment);
        }
    }
}
