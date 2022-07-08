using System;
using System.Collections.Generic;
using System.Linq;
using NCalc;
using UploadExcelAPI.Datasources;
using UploadExcelAPI.Domains.Output;
using UploadExcelAPI.Domains.ReadMapping;
using UploadExcelAPI.Domains.ReadTemplate;
using UploadExcelAPI.Utility;

namespace UploadExcelAPI.Domains.ExportOutput
{
    public class ExportRevenueMBOutput : IExportOutput
    {
        private IReadInputMapping _readMapping;
        private IReadRevenueMBOutputTemplate _readOutputTemplate;
        private IDatasource<IInput> _datasourceInput;
        private IDatasource<IOutput> _datasourceOutput;
        private IOutput.IItem _outputItem;
        private IRevenueMBOutputConstructor _revenueMBOutputConstructor;
        private string _collectionName;

        public ExportRevenueMBOutput(
            IReadInputMapping readMapping, IReadRevenueMBOutputTemplate readOutputTemplate, 
            IDatasource<IInput> datasourceInput, IDatasource<IOutput> datasourceOutput, IRevenueMBOutputTemplate outputTemplate,
            IRevenueMBOutputConstructor revenueMBOutputConstructor, IOutput.IItem outputItem,
            string collectionName)
        {
            _readMapping = readMapping;
            _readOutputTemplate = readOutputTemplate;
            _datasourceInput = datasourceInput;
            _datasourceOutput = datasourceOutput;
            _outputItem = outputItem;
            _revenueMBOutputConstructor = revenueMBOutputConstructor;
            _collectionName = collectionName;
        }

        public void ExportOutput()
        {
            var version = Guid.NewGuid().ToString();

            var listItem = new List<IOutput>();
            var cacheParameter = new List<ParameterValue>();
            foreach (var item in _readOutputTemplate.GetOutputTemplateList())
            {
                var initEquation = item.GetEquation();
                var initStartMonthYear = new DateTime(item.GetStartYear(), item.GetStartMonth(), 1);
                var initEndMonthYear = new DateTime(item.GetFinishYear(), item.GetFinishMonth(), 1);
                var initStartMonth = item.GetStartMonth();
                var initStartYear = item.GetStartYear();

                var parameters = new Dictionary<string, ParameterValue>();
                foreach (var parameter in item.GetParameters())
                {
                    var name = parameter.GetName();
                    var collection = parameter.GetCollection();
                    var query = parameter.GetQuery();
                    var condition = parameter.GetCondition();

                    var findCache = cacheParameter.Where(
                        c => c.Collection == collection && 
                             c.Query == query && 
                             c.Condition == condition);
                    var nameFormat = $"[{name}]";
                    if (findCache.Any())
                    {
                            parameters.Add(nameFormat, findCache.First());
                    }
                    else
                    {
                        var input = _datasourceInput.GetDocuments(query, collection);

                        // Add parameter to cache
                        var param = new ParameterValue()
                        {
                            Collection = collection,
                            Query = query,
                            Condition = condition,
                            Items = input.Items
                        };

                        cacheParameter.Add(param);
                        parameters.Add(nameFormat, param);
                    }
                }

                var startMonthYear = initStartMonthYear;
                var endMonthYear = initEndMonthYear;
                var month = initStartMonth;
                var year = initStartYear;
                var list = new List<IOutput.IItem>();
                while (startMonthYear <= endMonthYear)
                {
                    var equation = initEquation;

                    foreach (var parameter in parameters)
                    {
                        var findParameter = parameter.Value.Items
                            .FirstOrDefault(p => p.Month == month && p.Year == year);
                        if (parameter.Value.Condition != string.Empty)
                        {
                            switch (Enum.Parse(typeof(ParameterCondition), parameter.Value.Condition))
                            {
                                case ParameterCondition.PreviousMonth:
                                    findParameter = parameter.Value.Items
                                        .FirstOrDefault(p => 
                                            p.Month == (month == 1 ? 12 : month -1) && 
                                            p.Year == (month == 1 ? year - 1 : year));
                                    break;
                            }
                        }

                        if (findParameter != null)
                        {
                            equation = equation.Replace(
                                parameter.Key,
                                findParameter.Value.HasValue ? findParameter.Value.Value.ToString() : "0");
                        }
                    }

                    var evalValue = (new Expression(equation)).Evaluate();
                    list.Add(_outputItem.CreateInstance(month, year, Convert.ToDouble(evalValue)));

                    if (month == 12)
                    {
                        month = 1;
                        year++;
                    }
                    else month++;

                    startMonthYear = new DateTime(year, month, 1);
                }

                listItem.Add(_revenueMBOutputConstructor.CreateInstance(version, DateTime.Now,
                    item.GetProduct(), item.GetUnitPrice(), item.GetSource(), item.GetDemand(), item.GetDeliveryPoint(), 
                    list));
            }

            _datasourceOutput.InsertDocuments(listItem, _collectionName);
        }
    }
}
