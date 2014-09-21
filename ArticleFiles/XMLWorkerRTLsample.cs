using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using iTextSharp.tool.xml.css;
using iTextSharp.tool.xml.html;
using iTextSharp.tool.xml.parser;
using iTextSharp.tool.xml.pipeline;
using iTextSharp.tool.xml.pipeline.css;
using iTextSharp.tool.xml.pipeline.end;
using iTextSharp.tool.xml.pipeline.html;

namespace XMLWorkerTests
{
    public class UnicodeFontProvider : FontFactoryImp
    {
        static UnicodeFontProvider()
        {
            // روش صحيح تعريف فونت   
            var systemRoot = Environment.GetEnvironmentVariable("SystemRoot");
            FontFactory.Register(Path.Combine(systemRoot, "fonts\\tahoma.ttf"));
            // ثبت ساير فونت‌ها در اينجا
            //FontFactory.Register(Path.Combine(Environment.CurrentDirectory, "fonts\\irsans.ttf"));
        }

        public override Font GetFont(string fontname, string encoding, bool embedded, float size, int style, BaseColor color, bool cached)
        {
            if (string.IsNullOrWhiteSpace(fontname))
                return new Font(Font.FontFamily.UNDEFINED, size, style, color);
            return FontFactory.GetFont(fontname, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, size, style, color);
        }
    }

    /// <summary>
    /// تامين كننده مسير عكس‌هاي ذكر شده در فايل اچ تي ام ال
    /// </summary>
    public class ImageProvider : AbstractImageProvider
    {
        public override string GetImageRootPath()
        {
            var path = Environment.GetFolderPath(Environment.SpecialFolder.MyPictures);
            return path + "\\"; // مهم است كه اين مسير به بك اسلش ختم شود تا درست كار كند
        }
    }

    /// <summary>
    /// معادل پي دي افي المان‌هاي اچ تي ام ال را جمع آوري مي‌كند
    /// </summary>
    public class ElementsCollector : IElementHandler
    {
        private readonly Paragraph _paragraph;

        public ElementsCollector()
        {
            _paragraph = new Paragraph
            {
                Alignment = Element.ALIGN_LEFT  // سبب مي‌شود تا در حالت راست به چپ از سمت راست صفحه شروع شود
            };
        }

        /// <summary>
        /// اين پاراگراف حاوي كليه المان‌هاي متن است
        /// </summary>
        public Paragraph Paragraph
        {
            get { return _paragraph; }
        }

        /// <summary>
        /// بجاي اينكه خود كتابخانه اصلي كار افزودن المان‌ها را به صفحات انجام دهد
        /// قصد داريم آن‌ها را ابتدا جمع آوري كرده و سپس به صورت راست به چپ به صفحات نهايي اضافه كنيم
        /// </summary>
        /// <param name="htmlElement"></param>
        public void Add(IWritable htmlElement)
        {
            var writableElement = htmlElement as WritableElement;
            if (writableElement == null)
                return;

            foreach (var element in writableElement.Elements())
            {
                fixNestedTablesRunDirection(element);
                _paragraph.Add(element);
            }
        }

        /// <summary>
        /// نياز است سلول‌هاي جداول تو در توي پي دي اف نيز راست به چپ شوند
        /// </summary>        
        private void fixNestedTablesRunDirection(IElement element)
        {
            var table = element as PdfPTable;
            if (table == null)
                return;

            table.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
            foreach (var row in table.Rows)
            {
                foreach (var cell in row.GetCells())
                {
                    cell.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
                    foreach (var item in cell.CompositeElements)
                    {
                        fixNestedTablesRunDirection(item);
                    }
                }
            }
        }
    }

    public static class XMLWorkerUtils
    {
        /// <summary>
        /// نحوه تعريف يك فايل سي اس اس خارجي
        /// </summary>
        public static ICssFile GetCssFile(string filePath)
        {
            using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                return XMLWorkerHelper.GetCSS(stream);
            }
        }
    }

    class Program
    {
        /// <summary>
        ///  XMLWorker RTL sample.
        /// </summary>
        /// <param name="args"></param>
        static void Main(string[] args)
        {
            using (var pdfDoc = new Document(PageSize.A4))
            {
                var pdfWriter = PdfWriter.GetInstance(pdfDoc, new FileStream("test.pdf", FileMode.Create));
                pdfWriter.RgbTransparencyBlending = true;
                pdfDoc.Open();


                var html = @"<span style='color:blue; font-family:tahoma;'><b>آزمايش</b></span>   
                                    كتابخانه <i>iTextSharp</i> <u>جهت بررسي فارسي نويسي</u>
                            <table style='color:blue; font-family:tahoma;' border='1'><tr><td>eeمتن</td></tr></table>
                            <code>This is a code!</code>
                            <br/>
                            <img src='av-13489.jpg' />
                            ";

                var cssResolver = new StyleAttrCSSResolver();
                // cssResolver.AddCss(XMLWorkerUtils.GetCssFile(@"c:\path\pdf.css"));
                cssResolver.AddCss(@"code 
                                     {
                                        padding: 2px 4px;
                                        color: #d14;
                                        white-space: nowrap;
                                        background-color: #f7f7f9;
                                        border: 1px solid #e1e1e8;
                                     }",
                                     "utf-8", true);

                // كار جمع آوري المان‌هاي ترجمه شده به المان‌هاي پي دي اف را انجام مي‌دهد
                var elementsHandler = new ElementsCollector();

                var htmlContext = new HtmlPipelineContext(new CssAppliersImpl(new UnicodeFontProvider()));
                htmlContext.SetImageProvider(new ImageProvider());
                htmlContext.CharSet(Encoding.UTF8);
                htmlContext.SetAcceptUnknown(true).AutoBookmark(true).SetTagFactory(Tags.GetHtmlTagProcessorFactory());
                var pipeline = new CssResolverPipeline(cssResolver,
                                                       new HtmlPipeline(htmlContext, new ElementHandlerPipeline(elementsHandler, null)));
                var worker = new XMLWorker(pipeline, parseHtml: true);
                var parser = new XMLParser();
                parser.AddListener(worker);
                parser.Parse(new StringReader(html));

                // با هندلر سفارشي كه تهيه كرديم تمام المان‌هاي اچ تي ام ال به المان‌هاي پي دي اف تبديل شدند
                // الان تنها كافي كافي است تا اين‌ها را در يك جدول راست به چپ محصور كنيم تا درست نمايش داده شوند
                var mainTable = new PdfPTable(1) { WidthPercentage = 100, RunDirection = PdfWriter.RUN_DIRECTION_RTL };
                var cell = new PdfPCell
                {
                    Border = 0,
                    RunDirection = PdfWriter.RUN_DIRECTION_RTL,
                    HorizontalAlignment = Element.ALIGN_LEFT
                };
                cell.AddElement(elementsHandler.Paragraph);
                mainTable.AddCell(cell);

                pdfDoc.Add(mainTable);
            }
            Process.Start("test.pdf");
        }
    }
}