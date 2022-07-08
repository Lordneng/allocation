using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using UploadExcelAPI.Utility;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public class ReadFullCostOutputTemplate : IReadFullCostOutputTemplate
    {
        private string _path = string.Empty;
        private IFullCostOutputTemplate _outputTemplate;
        private IFullCostOutputTemplate.IParameters _outputTemplateParameters;
        private List<IFullCostOutputTemplate> outputTemplateList;

        public ReadFullCostOutputTemplate(IFullCostOutputTemplate outputTemplate, 
            IFullCostOutputTemplate.IParameters outputTemplateParameters, string path)
        {
            _outputTemplate = outputTemplate;
            _outputTemplateParameters = outputTemplateParameters;
            _path = path;

            ReadTemplateFile();
        }
        
        public void ReadTemplateFile()
        {
            var template = JObject.Parse(FileUtility.GetStringByPath(_path));
            var startRange = template.SelectToken("$.range.from").ToObject<string>();
            var endRange = template.SelectToken("$.range.to").ToObject<string>();

            var startMonth = Int16.Parse(startRange.Split('/')[0]);
            var startYear = Int16.Parse(startRange.Split('/')[1]);
            var finishMonth = Int16.Parse(endRange.Split('/')[0]);
            var finishYear = Int16.Parse(endRange.Split('/')[1]);

            outputTemplateList = new List<IFullCostOutputTemplate>();
            foreach (var item in template.SelectTokens("$..item"))
            {
                var outputParameterList = new List<IFullCostOutputTemplate.IParameters>();
                var parameters = item.SelectTokens("$..parameters");
                foreach (var parameter in parameters.Children())
                {
                    outputParameterList.Add(_outputTemplateParameters.CreateInstance(
                            parameter["name"].ToObject<string>(),
                            parameter["collection"].ToObject<string>(),
                        parameter["condition"].ToObject<string>(), 
                            parameter["query"].ToObject<string>()));
                }

                var path = item.Path.Split('.');
                outputTemplateList.Add(_outputTemplate.CreateInstance(
                    startMonth,
                    startYear,
                    finishMonth,
                    finishYear,
                    path[1],
                    path[2],
                    path[3],
                    path[4],
                    path[5],
                    item["equation"].ToObject<string>(),
                    outputParameterList));
            }
        }

        public IEnumerable<IFullCostOutputTemplate> GetOutputTemplateList()
        {
            return outputTemplateList;
        }
    }
}
