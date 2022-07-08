namespace UploadExcelAPI.Domains.ReadMapping
{
    public interface IReadInputMapping
    {
        public string TabName { get; set; }
        public string ReadDirection { get; set; }
    }
}
