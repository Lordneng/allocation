using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IReadMarginPerUnitOutputTemplate
    {
        public IEnumerable<IMarginPerUnitOutputTemplate> GetOutputTemplateList();
    }
}
