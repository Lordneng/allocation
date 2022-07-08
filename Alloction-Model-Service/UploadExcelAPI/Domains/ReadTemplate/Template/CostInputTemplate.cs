using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public class CostInputTemplate : ICostInputTemplate
    {
        public int StartMonth { get; set; }
        public int StartYear { get; set; }
        public int FinishMonth { get; set; }
        public int FinishYear { get; set; }
        public IEnumerable<ICostInputTemplate.IItem> Items { get; set; }

        public class Item : ICostInputTemplate.IItem
        {
            public string Product { get; set; }
            public string Source { get; set; }
            public string Currency { get; set; }
            public int? Column { get; set; }
            public int? Row { get; set; }
            public ICostInputTemplate.IItem CreateInstance(string product, string source, string currency, int? column, int? row)
            {
                return new Item()
                {
                    Product = product,
                    Source = source,
                    Currency = currency,
                    Column = column,
                    Row = row
                };
            }
        }
    }
}
