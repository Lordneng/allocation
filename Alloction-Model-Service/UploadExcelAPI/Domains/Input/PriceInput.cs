using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace UploadExcelAPI.Domains.Input
{
    public class PriceInput : IInput, IPriceInputConstructor
    {
        [BsonId]
        public ObjectId _id { get; set; }

        public string Version { get; set; }

        public DateTime DateCreated { get; set; }

        public string Product { get; set; }

        public string Currency { get; set; }

        public IEnumerable<IInput.IItem> Items { get; set; }

        public class PriceInputItem : IInput.IItem
        {
            public int? Month { get; set; }

            public int? Year { get; set; }

            public double? Value { get; set; }

            public IInput.IItem CreateInstance(int? month, int? year, double? value)
            {
                return new PriceInputItem()
                {
                    Month = month,
                    Year = year,
                    Value = value
                };
            }
        }

        public IInput CreateInstance(string version, DateTime dateCreated, string product, string currency, List<IInput.IItem> items)
        {
            return new PriceInput()
            {
                _id = ObjectId.GenerateNewId(),
                Version = version,
                DateCreated = dateCreated,
                Product = product,
                Currency = currency,
                Items = items
            };
        }
    }
}
