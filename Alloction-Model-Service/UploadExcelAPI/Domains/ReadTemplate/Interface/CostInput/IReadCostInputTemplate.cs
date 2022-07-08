using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IReadCostInputTemplate
    {
        public int GetStartMonth();
        public int GetStartYear();
        public int GetFinishMonth();
        public int GetFinishYear();
        public IEnumerable<ICostInputTemplate.IItem> GetItems();
    }
}
