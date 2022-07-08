using Newtonsoft.Json.Linq;
using UploadExcelAPI.Utility;

namespace UploadExcelAPI.Domains.ReadMapping
{
    public class ReadInputMapping : IReadInputMapping
    {
        public string TabName { get; set; }
        public string ReadDirection { get; set; }

        public ReadInputMapping(string path)
        {
            var mapping = JObject.Parse(FileUtility.GetStringByPath(path));
            this.TabName = mapping["tab_name"]?.ToObject<string>();
            this.ReadDirection = mapping["read_direction"]?.ToObject<string>();
        }
    }
}
