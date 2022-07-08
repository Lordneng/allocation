using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IReadPlanInputTemplate
    {
        public int GetStartMonth();
        public int GetStartYear();
        public int GetFinishMonth();
        public int GetFinishYear();
        public IEnumerable<IPlanInputTemplate.IItem> GetItems();
    }
}
