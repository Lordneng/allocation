using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class ImportVolumeConstrainMeterController : Controller
    {
        private readonly IVolumeConstrainMeterService _volumeConstrainMeterService;

        public ImportVolumeConstrainMeterController(IVolumeConstrainMeterService volumeConstrainMeterService)
        {
            _volumeConstrainMeterService = volumeConstrainMeterService;
        }

        [HttpPost]
        public ResponseVolumeConstrain ImportVolumeConstrainMeter(IFormFile file, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            return _volumeConstrainMeterService.ImportVolumeConstrainMeter(file, hostingEnvironment);
        }
    }
}
