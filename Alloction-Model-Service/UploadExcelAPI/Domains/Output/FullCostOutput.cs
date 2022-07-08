using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using UploadExcelAPI.Domains.Input;

namespace UploadExcelAPI.Domains.Output
{
    public class FullCostOutput : IOutput, IFullCostOutputConstructor
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public IEnumerable<IOutput.IItem> Items { get; set; }
        public string Version { get; set; }
        public DateTime DateCreated { get; set; }
        public string Product { get; set; }
        public string UnitPrice { get; set; }
        public string Source { get; set; }
        public string Demand { get; set; }
        public string DeliveryPoint { get; set; }

        public class FullCostOutputItem : IOutput.IItem
        {
            public int? Month { get; set; }
            public int? Year { get; set; }
            public double? Value { get; set; }

            public IOutput.IItem CreateInstance(int? month, int? year, double? value)
            {
                return new FullCostOutputItem()
                {
                    Month = month,
                    Year = year,
                    Value = value
                };
            }
        }

        public IOutput CreateInstance(string version, DateTime dateCreated, 
            string product, string unitPrice, string source, string demand, string deliveryPoint,
            List<IOutput.IItem> items)
        {
            return new FullCostOutput()
            {
                _id = ObjectId.GenerateNewId(),
                Version = version,
                DateCreated = dateCreated,
                Product = product,
                UnitPrice = unitPrice,
                Source = source,
                Demand = demand,
                DeliveryPoint = deliveryPoint,
                Items = items
            };
        }
    }
}
