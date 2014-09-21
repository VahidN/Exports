using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BaseMVC.Models
{
    using BaseMVC.Resources;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.Web.Mvc.Html;

    public class LanguagesDataAnnotations
    {
        [Key]
        public long LanguageID { get; set; }

        [Display(Name = "LanguageName")]
        public string LanguageName { get; set; }
    }

    [MetadataType(typeof(LanguagesDataAnnotations))]
    public partial class Languages
    {
    }
}