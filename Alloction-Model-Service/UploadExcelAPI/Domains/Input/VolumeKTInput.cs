using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace UploadExcelAPI.Domains.Input
{
    public class VolumeKTInput : IInput, IVolumeKTInputConstructor
    {
        [BsonId]
        public ObjectId _id { get; set; }

        public string Version { get; set; }

        public DateTime DateCreated { get; set; }

        public string Product { get; set; }

        public string Unit { get; set; }

        public string Source { get; set; }

        public string Demand { get; set; }

        public string DeliveryPoint { get; set; }

        public IEnumerable<IInput.IItem> Items { get; set; }

        public class VolumeKTInputItem : IInput.IItem
        {
            public int? Month { get; set; }

            public int? Year { get; set; }

            public double? Value { get; set; }

            public IInput.IItem CreateInstance(int? month, int? year, double? value)
            {
                return new VolumeKTInputItem()
                {
                    Month = month,
                    Year = year,
                    Value = value
                };
            }
        }

        public IInput CreateInstance(string version, DateTime dateCreated, string product, string unit,
            string source, string demand, string deliveryPoint, List<IInput.IItem> items)
        {
            return new VolumeKTInput()
            {
                _id = ObjectId.GenerateNewId(),
                Version = version,
                DateCreated = dateCreated,
                Product = product,
                Unit = unit,
                Source = source,
                Demand = demand,
                DeliveryPoint = deliveryPoint,
                Items = items
            };
        }
    }
}
