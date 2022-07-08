using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public class PriceInputTemplate : IPriceInputTemplate
    {
        public int StartMonth { get; set; }
        public int StartYear { get; set; }
        public int FinishMonth { get; set; }
        public int FinishYear { get; set; }
        public IEnumerable<IPriceInputTemplate.IItem> Items { get; set; }

        public class Item : IPriceInputTemplate.IItem
        {
            public string Product { get; set; }
            public string Currency { get; set; }
            public int? Column { get; set; }
            public int? Row { get; set; }
            public IPriceInputTemplate.IItem CreateInstance(string product, string currency, int? column, int? row)
            {
                return new Item()
                {
                    Product = product,
                    Currency = currency,
                    Column = column,
                    Row = row
                };
            }
        }
    }
}
