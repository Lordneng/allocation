using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using OfficeOpenXml;

namespace UploadExcelAPI.Utility
{
    public class ExcelUtility
    {
        public static ExcelWorksheet GetExcelWorksheet(string path, string sheetName)
        {
            var package = new ExcelPackage(new FileInfo(Directory.GetCurrentDirectory() + path));
            return package.Workbook.Worksheets[sheetName];
        }
    }
}
