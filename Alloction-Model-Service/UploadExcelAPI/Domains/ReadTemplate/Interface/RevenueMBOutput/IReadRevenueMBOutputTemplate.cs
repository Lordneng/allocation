using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IReadRevenueMBOutputTemplate
    {
        public IEnumerable<IRevenueMBOutputTemplate> GetOutputTemplateList();
    }
}
