using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IRevenueMBOutputTemplate
    {
        public IRevenueMBOutputTemplate CreateInstance(
            int startMonth, int startYear, int finishMonth, int finishYear,
            string product, string unitPrice, string source, string demand, string deliveryPoint,
            string equation, IEnumerable<IRevenueMBOutputTemplate.IParameters> parameters);

        public int GetStartMonth();
        public int GetStartYear();
        public int GetFinishMonth();
        public int GetFinishYear();
        public string GetProduct();
        public string GetUnitPrice();
        public string GetSource();
        public string GetDemand();
        public string GetDeliveryPoint();
        public string GetEquation();
        public IEnumerable<IRevenueMBOutputTemplate.IParameters> GetParameters();

        public interface IParameters
        {
            public string GetName();
            public string GetCollection();
            public string GetCondition();
            public string GetQuery();
            public IRevenueMBOutputTemplate.IParameters CreateInstance(string name, string collection, string condition, string query);
        }
    }
}
