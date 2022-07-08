using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public class VolumeKTInputTemplate : IVolumeKTInputTemplate
    {
        public int StartMonth { get; set; }
        public int StartYear { get; set; }
        public int FinishMonth { get; set; }
        public int FinishYear { get; set; }
        public IEnumerable<IVolumeKTInputTemplate.IItem> Items { get; set; }

        public class Item : IVolumeKTInputTemplate.IItem
        {
            public string Product { get; set; }
            public string Unit { get; set; }
            public string Source { get; set; }
            public string Demand { get; set; }
            public string DeliveryPoint { get; set; }
            public int? Column { get; set; }
            public int? Row { get; set; }
            public IVolumeKTInputTemplate.IItem CreateInstance(string product, string unit, string source, string demand, string deliveryPoint, int? column, int? row)
            {
                return new Item()
                {
                    Product = product,
                    Unit = unit,
                    Source = source,
                    Demand = demand,
                    DeliveryPoint = deliveryPoint,
                    Column = column,
                    Row = row
                };
            }
        }
    }
}
