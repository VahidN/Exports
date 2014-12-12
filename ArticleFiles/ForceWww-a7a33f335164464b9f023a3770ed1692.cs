using System;
using System.Globalization;
using System.Web;
using System.Web.Mvc;

namespace WebToolkit
{
    public class ForceWww : ActionFilterAttribute
    {
        private readonly string _baseHost;
        private ActionExecutingContext _filterContext;
        private HttpRequestBase _request;

        public ForceWww(string siteRootUrl)
        {
            _baseHost = new Uri(siteRootUrl).Host.ToLowerInvariant();
        }

        private bool canIgnoreRequest
        {
            get
            {
                var url = _request.Url;
                return url != null && 
                    (_filterContext.IsChildAction ||
                     _filterContext.HttpContext.Request.IsAjaxRequest() ||
                     url.AbsoluteUri.Contains("?"));
            }
        }

        private bool isDomainSetCorrectly
        {
            get
            {
                return (_request.Url != null) && (_request.Url.Host == _baseHost);
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
                return url != null && url.AbsolutePath == "/";
            }
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            _filterContext = filterContext;
            _request = _filterContext.RequestContext.HttpContext.Request;
            modifyUrlAndRedirectPermanent();

            base.OnActionExecuting(filterContext);
        }

        private string avoidTrailingSlashes(string url)
        {
            if (!isRootRequest && url.EndsWith("/"))
            {
                url = url.TrimEnd(new[] { '/' });
            }
            return url;
        }

        private void modifyUrlAndRedirectPermanent()
        {
            if (isLocalRequest || isDomainSetCorrectly || canIgnoreRequest)
                return;

            var url = _request.Url;
            if (url == null)
                return;

            var newUri = new UriBuilder(url) { Host = _baseHost };
            var absoluteUrl = HttpUtility.UrlDecode(newUri.Uri.AbsoluteUri.ToString(CultureInfo.InvariantCulture));
            if (string.IsNullOrWhiteSpace(absoluteUrl))
                return;

            var redirectUrl = absoluteUrl.ToLowerInvariant();
            redirectUrl = avoidTrailingSlashes(redirectUrl);
            _filterContext.Controller.ViewBag.CanonicalUrl = redirectUrl;

            _filterContext.Result = new RedirectResult(redirectUrl, permanent: true);
        }
    }
}