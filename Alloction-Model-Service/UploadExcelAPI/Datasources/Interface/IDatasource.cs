using System.Collections.Generic;
using MongoDB.Driver;

namespace UploadExcelAPI.Datasources
{
    public interface IDatasource<T>
    {
        public T GetDocuments(string filter, string collectionName);
        public void InsertDocuments(IEnumerable<T> input, string collectionName);
    }
}
