using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IMarginPerUnitOutputTemplate
    {
        public IMarginPerUnitOutputTemplate CreateInstance(
            int startMonth, int startYear, int finishMonth, int finishYear,
            string product, string unitPrice, string source, string demand, string deliveryPoint,
            string equation, IEnumerable<IMarginPerUnitOutputTemplate.IParameters> parameters);

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
        public IEnumerable<IMarginPerUnitOutputTemplate.IParameters> GetParameters();

        public interface IParameters
        {
            public string GetName();
            public string GetCollection();
            public string GetCondition();
            public string GetQuery();
            public IMarginPerUnitOutputTemplate.IParameters CreateInstance(string name, string collection, string condition, string query);
        }
    }
}
