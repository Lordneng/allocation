using OfficeOpenXml;
using UploadExcelAPI.Domains.ReadMapping;
using UploadExcelAPI.Utility;

namespace UploadExcelAPI.Domains.ReadExcel
{
    public class ReadInputExcel : IReadInputExcel
    {
        private ExcelWorksheet _sheet;
        private IReadInputMapping _readMapping;

        public ReadInputExcel(IReadInputMapping readMapping, string path)
        {
            _readMapping = readMapping;
            _sheet = ExcelUtility.GetExcelWorksheet(path, _readMapping.TabName);
        }

        public double? GetCell(int row, int column)
        {
            return (double?)_sheet.Cells[row, column].Value;
        }
    }
}
