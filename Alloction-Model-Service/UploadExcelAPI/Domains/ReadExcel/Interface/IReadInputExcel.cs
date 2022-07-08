namespace UploadExcelAPI.Domains.ReadExcel
{
    public interface IReadInputExcel
    {
        double? GetCell(int row, int column);
    }
}
