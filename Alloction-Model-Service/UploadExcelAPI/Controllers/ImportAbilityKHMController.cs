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
    public class ImportAbilityKHMController : Controller
    {
        private readonly IAbilityKHMService _abilityKHMService;

        public ImportAbilityKHMController(IAbilityKHMService abilityKHMService)
        {
            _abilityKHMService = abilityKHMService;
        }

        [HttpPost]
        public ResponseAbilityKHM ImportAbilityRayong(IFormFile file, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            return _abilityKHMService.ImportAbilityKHM(file,hostingEnvironment);
        }
    }
}
