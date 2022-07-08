using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains;

namespace UploadExcelAPI.Services
{
    public interface IUploadExcelReferencePriceService
    {
        public ResponseExcelPrice UploadExcelReferencePrice(IFormFile file1, IFormFile file2, IFormFile file3, string Year, [FromServices] IHostingEnvironment hostingEnvironment);
    }
}
