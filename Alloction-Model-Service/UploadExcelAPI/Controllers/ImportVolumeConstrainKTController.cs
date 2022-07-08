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
    public class ImportVolumeConstrainKTController : Controller
    {
        private readonly IVolumeConstrainKTService _volumeConstrainKTService;

        public ImportVolumeConstrainKTController(IVolumeConstrainKTService volumeConstrainKTService)
        {
            _volumeConstrainKTService = volumeConstrainKTService;
        }

        [HttpPost]
        public ResponseVolumeConstrain ImportVolumeConstrainKT(IFormFile file, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            return _volumeConstrainKTService.ImportVolumeConstrainKT(file, hostingEnvironment);
        }
    }
}
