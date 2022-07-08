using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UploadExcelAPI.Utility
{
    public class FileUtility
    {
        public static string GetStringByPath(string path)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            int thaiCodePage = 874;
            var x = Directory.GetCurrentDirectory();
            return File.ReadAllText(Directory.GetCurrentDirectory() + path, Encoding.GetEncoding(thaiCodePage));
        }
    }
}
