using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IReadFullCostOutputTemplate
    {
        public IEnumerable<IFullCostOutputTemplate> GetOutputTemplateList();
    }
}
