using System.Collections.Generic;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using UploadExcelAPI.Domains.Input;
using UploadExcelAPI.Domains.Output;

namespace UploadExcelAPI.Datasources
{
    public class MongoDatasource<T> : IDatasource<T>
    {
        private string _connectionString = string.Empty;
        private string _databaseName = string.Empty;
        private MongoClient _client;
        private IMongoDatabase _database;

        public MongoDatasource(string connectionString, string databaseName)
        {
            _connectionString = connectionString;
            _databaseName = databaseName;
            _client = new MongoClient(_connectionString);
            _database = _client.GetDatabase(_databaseName);
            
            ClassMapRegister();
        }
        
        private void ClassMapRegister()
        {
            RegisterMapIfNeeded<CostInput>();
            RegisterMapIfNeeded<CostInput.CostInputItem>();
            RegisterMapIfNeeded<PriceInput>();
            RegisterMapIfNeeded<PriceInput.PriceInputItem>();
            RegisterMapIfNeeded<PlanInput>();
            RegisterMapIfNeeded<PlanInput.PlanInputItem>();
            RegisterMapIfNeeded<VolumeKTInput>();
            RegisterMapIfNeeded<VolumeKTInput.VolumeKTInputItem>();
            RegisterMapIfNeeded<FullCostOutput>();
            RegisterMapIfNeeded<FullCostOutput.FullCostOutputItem>();
            RegisterMapIfNeeded<SellingPriceOutput>();
            RegisterMapIfNeeded<SellingPriceOutput.SellingPriceOutputItem>(); 
            RegisterMapIfNeeded<MarginPerUnitOutput>();
            RegisterMapIfNeeded<MarginPerUnitOutput.MarginPerUnitOutputItem>();
            RegisterMapIfNeeded<RevenueMBOutput>();
            RegisterMapIfNeeded<RevenueMBOutput.RevenueMBOutputItem>();
        }

        public void RegisterMapIfNeeded<TClass>()
        {
            if (!BsonClassMap.IsClassMapRegistered(typeof(TClass)))
                BsonClassMap.RegisterClassMap<TClass>();
        }

        public T GetDocuments(string filter, string collectionName)
        {
            return _database.GetCollection<T>(collectionName).Find(filter).FirstOrDefault();
        }

        public void InsertDocuments(IEnumerable<T> inputs, string collectionName)
        {
            _database.GetCollection<T>(collectionName).InsertMany(inputs);
        }

    }
}
