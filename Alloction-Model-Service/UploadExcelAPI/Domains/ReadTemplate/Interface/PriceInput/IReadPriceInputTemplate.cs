using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IReadPriceInputTemplate
    {
        public int GetStartMonth();
        public int GetStartYear();
        public int GetFinishMonth();
        public int GetFinishYear();
        public IEnumerable<IPriceInputTemplate.IItem> GetItems();
    }
}
