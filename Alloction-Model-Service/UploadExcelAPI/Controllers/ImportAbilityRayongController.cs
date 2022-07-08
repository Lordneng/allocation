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
    public class ImportAbilityRayongController : Controller
    {
        private readonly IAbilityRayongService _abilityRayongService;

        public ImportAbilityRayongController(IAbilityRayongService abilityRayongService)
        {
            _abilityRayongService = abilityRayongService;
        }

        [HttpPost]
        public ResponseAbilityRayong ImportAbilityRayong(IFormFile file, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            return _abilityRayongService.ImportAbilityRayong(file, hostingEnvironment);
        }
    }
}
