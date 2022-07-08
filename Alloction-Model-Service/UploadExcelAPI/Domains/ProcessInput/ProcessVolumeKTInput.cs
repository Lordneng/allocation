using System;
using System.Collections.Generic;
using UploadExcelAPI.Datasources;
using UploadExcelAPI.Domains.Input;
using UploadExcelAPI.Domains.ReadExcel;
using UploadExcelAPI.Domains.ReadMapping;
using UploadExcelAPI.Domains.ReadTemplate;
using UploadExcelAPI.Utility;

namespace UploadExcelAPI.Domains.ProcessInput
{
    public class ProcessVolumeKTInput : IProcessInput
    {
        private IReadInputMapping _readMapping;
        private IReadInputExcel _readInputExcel;
        private IReadVolumeKTInputTemplate _readInputTemplate;
        private IInput.IItem _inputItem;
        private IVolumeKTInputConstructor _inputConstructor;
        private List<IInput> _listInputs;
        private IDatasource<IInput> _datasource;
        private string _collectioName;

        public ProcessVolumeKTInput(
            IReadInputMapping readMapping, IReadInputExcel readInputExcel, IReadVolumeKTInputTemplate readInputTemplate,
            IInput.IItem inputItem, IVolumeKTInputConstructor inputConstructor, IDatasource<IInput> datasource, 
            string collectionName)
        {
            _readMapping = readMapping;
            _readInputExcel = readInputExcel;
            _readInputTemplate = readInputTemplate;
            _inputItem = inputItem;
            _inputConstructor = inputConstructor;
            _listInputs = new List<IInput>();
            _datasource = datasource;
            _collectioName = collectionName;
        }

        public void ProcessInput()
        {
            var version = Guid.NewGuid().ToString();
            var initStartMonthYear = new DateTime(_readInputTemplate.GetStartYear(), _readInputTemplate.GetStartMonth(), 1);
            var initEndMonthYear = new DateTime(_readInputTemplate.GetFinishYear(), _readInputTemplate.GetFinishMonth(), 1);
            var initStartMonth = _readInputTemplate.GetStartMonth();
            var initStartYear = _readInputTemplate.GetStartYear();
            foreach (var item in _readInputTemplate.GetItems())
            {
                var column = item.Column.Value;
                var row = item.Row.Value;
                var startMonthYear = initStartMonthYear;
                var endMonthYear = initEndMonthYear;
                var month = initStartMonth;
                var year = initStartYear;
                var volumeKTInputItems = new List<IInput.IItem>();
                while (startMonthYear <= endMonthYear)
                {
                    var volumektInputItem = _inputItem.CreateInstance(month, year, _readInputExcel.GetCell(row, column));
                    volumeKTInputItems.Add(volumektInputItem);

                    var readDirection = Enum.Parse<ExcelReadDirection>(_readMapping.ReadDirection);
                    if (readDirection == ExcelReadDirection.Horizontal) column++;
                    else if (readDirection == ExcelReadDirection.Vertical) row++;

                    if (month == 12)
                    {
                        month = 1;
                        year++;
                    }
                    else month++;

                    startMonthYear = new DateTime(year, month, 1);
                }

                _listInputs.Add(_inputConstructor.CreateInstance(
                    version, DateTime.Now, item.Product, item.Unit, item.Source, item.Demand, item.DeliveryPoint, volumeKTInputItems));
            }

            _datasource.InsertDocuments(_listInputs, _collectioName);
        }
    }
}
