using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public class PlanInputTemplate : IPlanInputTemplate
    {
        public int StartMonth { get; set; }
        public int StartYear { get; set; }
        public int FinishMonth { get; set; }
        public int FinishYear { get; set; }
        public IEnumerable<IPlanInputTemplate.IItem> Items { get; set; }

        public class Item : IPlanInputTemplate.IItem
        {
            public string Product { get; set; }
            public string Source { get; set; }
            public int? Column { get; set; }
            public int? Row { get; set; }
            public IPlanInputTemplate.IItem CreateInstance(string product, string source, int? column, int? row)
            {
                return new Item()
                {
                    Product = product,
                    Source = source,
                    Column = column,
                    Row = row
                };
            }
        }
    }
}
