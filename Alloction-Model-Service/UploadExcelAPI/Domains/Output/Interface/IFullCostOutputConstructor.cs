using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UploadExcelAPI.Domains.Output
{
    public interface IFullCostOutputConstructor
    {
        public IOutput CreateInstance(string version, DateTime dateCreated, 
            string product, string unitPrice, string source, string demand, string deliveryPoint, 
            List<IOutput.IItem> items);
    }
}
