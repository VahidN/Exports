using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net.Mime;
using System.Web.Helpers;
using System.Web.Mvc;

namespace MvcWatermark.Controllers
{
    public class HomeController : Controller
    {
        const int ADay = 86400;

        public ActionResult Index()
        {
            return View();
        }

        private bool isEmbeddedIntoAnotherDomain
        {
            get
            {
                return this.HttpContext.Request.UrlReferrer != null &&
                       !this.HttpContext.Request.Url.Host.Equals(this.HttpContext.Request.UrlReferrer.Host,
                                                                   StringComparison.InvariantCultureIgnoreCase);
            }
        }

        private byte[] addWaterMark(string filePath, string text)
        {
            using (var img = System.Drawing.Image.FromFile(filePath))
            {
                using (var memStream = new MemoryStream())
                {
                    using (var bitmap = new Bitmap(img)) // to avoid GDI+ errors
                    {
                        bitmap.Save(memStream, ImageFormat.Png);
                        var content = memStream.ToArray();
                        var webImage = new WebImage(memStream);
                        webImage.AddTextWatermark(text, verticalAlign: "Top", horizontalAlign: "Left", fontColor: "Brown");
                        return webImage.GetBytes();
                    }
                }
            }
        }

        [OutputCache(VaryByParam = "fileName", Duration = ADay)]
        public ActionResult Image(string fileName)
        {
            fileName = Path.GetFileName(fileName); // تميز سازي امنيتي است
            var rootPath = Server.MapPath("~/App_Data/Images");
            var path = Path.Combine(rootPath, fileName);
            if (!System.IO.File.Exists(path))
            {
                var notFoundImage = "notFound.png";
                path = Path.Combine(rootPath, notFoundImage);
                return File(path, MediaTypeNames.Image.Gif, notFoundImage);
            }

            if (isEmbeddedIntoAnotherDomain)
            {
                var text = Url.Action(actionName: "Index", controllerName: "Home", routeValues: null, protocol: "http");
                var content = addWaterMark(path, text);
                return File(content, MediaTypeNames.Image.Gif, fileName);
            }
            return File(path, MediaTypeNames.Image.Gif, fileName);
        }
    }
}