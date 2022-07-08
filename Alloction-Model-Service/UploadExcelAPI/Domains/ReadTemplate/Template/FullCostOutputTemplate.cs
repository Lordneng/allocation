using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public class FullCostOutputTemplate : IFullCostOutputTemplate
    {
        private int _startMonth { get; set; }
        private int _startYear { get; set; }
        private int _finishMonth { get; set; }
        private int _finishYear { get; set; }
        private string _product { get; set; }
        private string _unitPrice { get; set; }
        private string _source { get; set; }
        private string _demand { get; set; }
        private string _deliveryPoint { get; set; }
        private string _equation { get; set; }
        private IEnumerable<IFullCostOutputTemplate.IParameters> _parameters { get; set; }

        public IFullCostOutputTemplate CreateInstance(
            int startMonth, int startYear, int finishMonth, int finishYear,
            string product, string unitPrice, string source, string demand, string deliveryPoint,
            string equation, IEnumerable<IFullCostOutputTemplate.IParameters> parameters)
        {
            return new FullCostOutputTemplate()
            {
                _startMonth = startMonth,
                _startYear = startYear,
                _finishMonth = finishMonth,
                _finishYear = finishYear,
                _product = product,
                _unitPrice = unitPrice,
                _source = source,
                _demand = demand,
                _deliveryPoint = deliveryPoint,
                _equation = equation,
                _parameters = parameters
            };
        }

        public int GetStartMonth()
        {
            return _startMonth;
        }

        public int GetStartYear()
        {
            return _startYear;
        }

        public int GetFinishMonth()
        {
            return _finishMonth;
        }

        public int GetFinishYear()
        {
            return _finishYear;
        }

        public string GetProduct()
        {
            return _product;
        }

        public string GetUnitPrice()
        {
            return _unitPrice;
        }

        public string GetSource()
        {
            return _source;
        }

        public string GetDemand()
        {
            return _demand;
        }

        public string GetDeliveryPoint()
        {
            return _deliveryPoint;
        }

        public string GetEquation()
        {
            return _equation;
        }

        public IEnumerable<IFullCostOutputTemplate.IParameters> GetParameters()
        {
            return _parameters;
        }

        public class Parameters : IFullCostOutputTemplate.IParameters
        {
            private string _name;
            public string _collection { get; set; }
            public string _condition { get; set; }
            public string _query { get; set; }
            public IFullCostOutputTemplate.IParameters CreateInstance(string name, string collection, string condition, string query)
            {
                return new Parameters()
                {
                    _name = name,
                    _collection = collection,
                    _condition = condition,
                    _query = query
                };
            }

            public string GetName()
            {
                return _name;
            }

            public string GetCollection()
            {
                return _collection;
            }

            public string GetCondition()
            {
                return _condition;
            }

            public string GetQuery()
            {
                return _query;
            }
        }
    }
}
