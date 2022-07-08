using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Services
{
    public interface IVolumeConstrainKTService
    {
        public ResponseVolumeConstrain ImportVolumeConstrainKT(IFormFile file, [FromServices] IHostingEnvironment hostingEnvironment);
    }
}
