using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IPlanInputTemplate
    {
        public int StartMonth { get; set; }
        public int StartYear { get; set; }
        public int FinishMonth { get; set; }
        public int FinishYear { get; set; }
        public IEnumerable<IItem> Items { get; set; }

        public interface IItem
        {
            public string Product { get; set; }
            public string Source { get; set; }
            public int? Column { get; set; }
            public int? Row { get; set; }
            public IPlanInputTemplate.IItem CreateInstance(string product, string source, int? column,
                int? row);
        }
    }
}
