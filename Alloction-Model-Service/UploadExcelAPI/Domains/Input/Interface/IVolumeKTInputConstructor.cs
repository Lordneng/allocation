using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UploadExcelAPI.Domains.Input
{
    public interface IVolumeKTInputConstructor
    {
        public IInput CreateInstance(string version, DateTime dateCreated, string product, string unit,
            string source, string demand, string deliveryPoint, List<IInput.IItem> items);
    }
}
