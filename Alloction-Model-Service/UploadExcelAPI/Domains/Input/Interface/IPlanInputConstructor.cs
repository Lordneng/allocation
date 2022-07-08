using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UploadExcelAPI.Domains.Input
{
    public interface IPlanInputConstructor
    {
        public IInput CreateInstance(string version, DateTime dateCreated, string product,
            string source, List<IInput.IItem> items);
    }
}
