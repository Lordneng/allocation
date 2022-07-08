using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UploadExcelAPI.Domains;
using UploadExcelAPI.Services;

namespace UploadExcelAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadExcelReferencePriceController : Controller
    {
        private readonly IUploadExcelReferencePriceService _uploadExcelReferencePriceService;

        public UploadExcelReferencePriceController(IUploadExcelReferencePriceService uploadExcelReferencePriceService)
        {
            _uploadExcelReferencePriceService = uploadExcelReferencePriceService;
        }

        [HttpPost]
        public ResponseExcelPrice UploadExcelReferencePrice(IFormFile file1, IFormFile file2, IFormFile file3, string Year, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            return _uploadExcelReferencePriceService.UploadExcelReferencePrice(file1, file2, file3, Year, hostingEnvironment);
        }
    }
}
