using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IReadSellingPriceOutputTemplate
    {
        public IEnumerable<ISellingPriceOutputTemplate> GetOutputTemplateList();
    }
}
