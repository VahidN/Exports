using System;
using System.Globalization;
using System.Web;

namespace WebApp452
{
    public class ForceWWWModule : IHttpModule
    {
        // اين مقدار را از كانفيگ برنامه دريافت كنيد
        private const string SiteRootUrl = "http://www.dotnettips.info";

        private readonly string _baseHost;
        private HttpRequest _request;
        private HttpResponse _response;

        public ForceWWWModule()
        {
            _baseHost = new Uri(SiteRootUrl).Host.ToLowerInvariant();
        }

        private bool canIgnoreRequest
        {
            get
            {
                var url = _request.Url;
                return (isAjaxRequest(_request) || url.AbsoluteUri.Contains("?"));
            }
        }

        private bool isDomainSetCorrectly
        {
            get
            {
                return (_request.Url.Host == _baseHost);
            }
        }

        private bool isLocalRequest
        {
            get { return _request.IsLocal; }
        }

        private bool isRootRequest
        {
            get
            {
                var url = _request.Url;
                return url.AbsolutePath == "/";
            }
        }

        public void Dispose()
        { }

        public void Init(HttpApplication context)
        {
            context.BeginRequest += context_BeginRequest;
        }

        private static bool isAjaxRequest(HttpRequest request)
        {
            return (request["X-Requested-With"] == "XMLHttpRequest") ||
                      ((request.Headers["X-Requested-With"] == "XMLHttpRequest"));
        }
        private string avoidTrailingSlashes(string url)
        {
            if (!isRootRequest && url.EndsWith("/"))
            {
                url = url.TrimEnd(new[] { '/' });
            }
            return url;
        }

        private void context_BeginRequest(object sender, EventArgs e)
        {
            var application = (HttpApplication)sender;
            var context = application.Context;

            _request = context.Request;
            _response =context.Response;
            modifyUrlAndRedirectPermanent();
        }
        private void modifyUrlAndRedirectPermanent()
        {
            if (isLocalRequest || isDomainSetCorrectly || canIgnoreRequest)
                return;

            var url = _request.Url;
            var newUri = new UriBuilder(url) { Host = _baseHost };
            var absoluteUrl = HttpUtility.UrlDecode(newUri.Uri.AbsoluteUri.ToString(CultureInfo.InvariantCulture));
            if (string.IsNullOrWhiteSpace(absoluteUrl))
                return;

            var redirectUrl = absoluteUrl.ToLowerInvariant();
            redirectUrl = avoidTrailingSlashes(redirectUrl);

            _response.RedirectPermanent(redirectUrl);
        }
    }
}