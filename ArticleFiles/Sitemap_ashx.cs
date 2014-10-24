using System;
using System.Collections;
using System.Web;
using System.Xml.Serialization;

namespace WebApp452
{
    [XmlRoot("urlset", Namespace = "http://www.sitemaps.org/schemas/sitemap/0.9")]
    public class SitemapItems
    {
        private ArrayList map;

        public SitemapItems()
        {
            map = new ArrayList();
        }

        [XmlElement("url")]
        public Location[] Locations
        {
            get
            {
                var items = new Location[map.Count];
                map.CopyTo(items);
                return items;
            }
            set
            {
                if (value == null)
                    return;
                var items = value;
                map.Clear();
                foreach (var item in items)
                    map.Add(item);
            }
        }

        public int Add(Location item)
        {
            return map.Add(item);
        }
    }

    public class Location
    {
        public enum EChangeFrequency
        {
            always,
            hourly,
            daily,
            weekly,
            monthly,
            yearly,
            never
        }

        [XmlElement("loc")]
        public string Url { get; set; }

        [XmlElement("changefreq")]
        public EChangeFrequency? ChangeFrequency { get; set; }

        public bool ShouldSerializeChangeFrequency() { return ChangeFrequency.HasValue; }

        [XmlElement("lastmod")]
        public DateTime? LastModified { get; set; }

        public bool ShouldSerializeLastModified() { return LastModified.HasValue; }

        [XmlElement("priority")]
        public double? Priority { get; set; }

        public bool ShouldSerializePriority() { return Priority.HasValue; }
    }

    public class Sitemap : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            var sm = new SitemapItems();
            sm.Add(new Location()
            {
                Url = string.Format("http://www.site.ir/Articles/{0}/{1}", 1, "SEO-in-ASP.NET-MVC"),
                LastModified = DateTime.UtcNow,
                Priority = 0.5D
            });

            context.Response.Clear();
            var xs = new XmlSerializer(sm.GetType());
            context.Response.ContentType = "text/xml";
            xs.Serialize(context.Response.Output, sm);
        }

        public bool IsReusable
        {
            get { return false; }
        }
    }
}