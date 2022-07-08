using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IVolumeKTInputTemplate
    {
        public int StartMonth { get; set; }
        public int StartYear { get; set; }
        public int FinishMonth { get; set; }
        public int FinishYear { get; set; }
        public IEnumerable<IItem> Items { get; set; }

        public interface IItem
        {
            public string Product { get; set; }
            public string Unit { get; set; }
            public string Source { get; set; }
            public string Demand { get; set; }
            public string DeliveryPoint { get; set; }
            public int? Column { get; set; }
            public int? Row { get; set; }

            public IVolumeKTInputTemplate.IItem CreateInstance(string product, string unit, string source, string demand, string deliveryPoint, int? column,
                int? row);
        }
    }
}
