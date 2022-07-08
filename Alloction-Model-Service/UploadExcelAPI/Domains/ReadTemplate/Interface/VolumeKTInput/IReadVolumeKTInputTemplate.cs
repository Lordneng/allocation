using System.Collections.Generic;

namespace UploadExcelAPI.Domains.ReadTemplate
{
    public interface IReadVolumeKTInputTemplate
    {
        public int GetStartMonth();
        public int GetStartYear();
        public int GetFinishMonth();
        public int GetFinishYear();
        public IEnumerable<IVolumeKTInputTemplate.IItem> GetItems();
    }
}
