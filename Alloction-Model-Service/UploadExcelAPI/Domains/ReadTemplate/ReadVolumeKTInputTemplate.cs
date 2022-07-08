using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using UploadExcelAPI.Utility;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public class ReadVolumeKTInputTemplate : IReadVolumeKTInputTemplate
    {
        private string _path = string.Empty;
        private IVolumeKTInputTemplate _inputTemplate;
        private IVolumeKTInputTemplate.IItem _inputTemplateItem;

        public ReadVolumeKTInputTemplate(IVolumeKTInputTemplate inputTemplate, IVolumeKTInputTemplate.IItem inputTemplateItem, string path)
        {
            _inputTemplate = inputTemplate;
            _inputTemplateItem = inputTemplateItem;
            _path = path;

            ReadTemplateFile();
        }

        public void ReadTemplateFile()
        {
            var template = JObject.Parse(FileUtility.GetStringByPath(_path));
            var startRange = template.SelectToken("$.range.from").ToObject<string>();
            var endRange = template.SelectToken("$.range.to").ToObject<string>();

            _inputTemplate.StartMonth = Int16.Parse(startRange.Split('/')[0]);
            _inputTemplate.StartYear = Int16.Parse(startRange.Split('/')[1]);
            _inputTemplate.FinishMonth = Int16.Parse(endRange.Split('/')[0]);
            _inputTemplate.FinishYear = Int16.Parse(endRange.Split('/')[1]);

            _inputTemplate.Items = template.SelectTokens("$..item")
                .Select(c => _inputTemplateItem.CreateInstance(
                    c.Path.Split('.')[1],
                    c.Path.Split('.')[2],
                    c.Path.Split('.')[3],
                    c.Path.Split('.')[4],
                    c.Path.Split('.')[5],
                    c["column"].ToObject<int>(),
                    c["row"].ToObject<int>()));
        }

        public int GetStartMonth()
        {
            return _inputTemplate.StartMonth;
        }

        public int GetStartYear()
        {
            return _inputTemplate.StartYear;
        }

        public int GetFinishMonth()
        {
            return _inputTemplate.FinishMonth;
        }

        public int GetFinishYear()
        {
            return _inputTemplate.FinishYear;
        }

        public IEnumerable<IVolumeKTInputTemplate.IItem> GetItems()
        {
            return _inputTemplate.Items;
        }
    }
}
