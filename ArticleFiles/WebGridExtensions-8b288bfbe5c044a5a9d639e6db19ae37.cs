using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.WebPages;

public static class WebGridExtensions
{
    public static HelperResult PagerList(
        this WebGrid webGrid,
        WebGridPagerModes mode = WebGridPagerModes.NextPrevious | WebGridPagerModes.Numeric,
        string firstText = null,
        string previousText = null,
        string nextText = null,
        string lastText = null,
        int numericLinksCount = 5)
    {
        return PagerList(webGrid, mode, firstText, previousText, nextText, lastText, numericLinksCount, explicitlyCalled: true);
    }

    private static HelperResult PagerList(
        WebGrid webGrid,
        WebGridPagerModes mode,
        string firstText,
        string previousText,
        string nextText,
        string lastText,
        int numericLinksCount,
        bool explicitlyCalled)
    {
        
        int currentPage = webGrid.PageIndex;
        int totalPages = webGrid.PageCount;
        int lastPage = totalPages - 1;

        var ul = new TagBuilder("ul");
        var li = new List<TagBuilder>();

        
        if (ModeEnabled(mode, WebGridPagerModes.FirstLast)) {
            if (String.IsNullOrEmpty(firstText)) {
                firstText = "First";
            }

            var part = new TagBuilder("li") {
                InnerHtml = GridLink(webGrid, webGrid.GetPageUrl(0), firstText)
            };

            if (currentPage == 0) {
                part.MergeAttribute("class", "disabled");
            }

            li.Add(part);

        }
        
        if (ModeEnabled(mode, WebGridPagerModes.NextPrevious)) {
            if (String.IsNullOrEmpty(previousText)) {
                previousText = "Prev";
            }

            int page = currentPage == 0 ? 0: currentPage - 1;

            var part = new TagBuilder("li") {
                InnerHtml = GridLink(webGrid, webGrid.GetPageUrl(page), previousText)
            };
            
            if (currentPage == 0) {
                part.MergeAttribute("class", "disabled");
            }

            li.Add(part);

        }


       if (ModeEnabled(mode, WebGridPagerModes.Numeric) && (totalPages > 1)) {
            int last = currentPage + (numericLinksCount / 2);
            int first = last - numericLinksCount + 1;
            if (last > lastPage) {
                first -= last - lastPage;
                last = lastPage;
            }
            if (first < 0) {
                last = Math.Min(last + (0 - first), lastPage);
                first = 0;
            }
            for (int i = first; i <= last; i++) {

                var pageText = (i + 1).ToString(CultureInfo.InvariantCulture);
                var part = new TagBuilder("li") {
                    InnerHtml = GridLink(webGrid, webGrid.GetPageUrl(i), pageText)
                };

                if (i == currentPage) {
                    part.MergeAttribute("class", "active");
                }
                
                li.Add(part);

            }
        }
        
        if (ModeEnabled(mode, WebGridPagerModes.NextPrevious)) {
            if (String.IsNullOrEmpty(nextText)) {
                nextText = "Next";
            }
            
            int page = currentPage == lastPage ? lastPage: currentPage + 1;

            var part = new TagBuilder("li") {
                InnerHtml = GridLink(webGrid, webGrid.GetPageUrl(page), nextText)
            };
            
            if (currentPage == lastPage) {
                part.MergeAttribute("class", "disabled");
            }

            li.Add(part);

        }
        
        if (ModeEnabled(mode, WebGridPagerModes.FirstLast)) {
            if (String.IsNullOrEmpty(lastText)) {
                lastText = "Last";
            }

            var part = new TagBuilder("li") {
                InnerHtml = GridLink(webGrid, webGrid.GetPageUrl(lastPage), lastText)
            };
            
            if (currentPage == lastPage) {
                part.MergeAttribute("class", "disabled");
            }

            li.Add(part);

        }

        ul.InnerHtml = string.Join("", li);

        var html = "";
        if (explicitlyCalled && webGrid.IsAjaxEnabled) {
            var span = new TagBuilder("span");
            span.MergeAttribute("data-swhgajax", "true");
            span.MergeAttribute("data-swhgcontainer", webGrid.AjaxUpdateContainerId);
            span.MergeAttribute("data-swhgcallback", webGrid.AjaxUpdateCallback);

            span.InnerHtml = ul.ToString();
            html = span.ToString();

        } else {
            html = ul.ToString();
        }

        return new HelperResult(writer => {
            writer.Write(html);         
        });
    }

    private static String GridLink(WebGrid webGrid, string url, string text) 
    {
        TagBuilder builder = new TagBuilder("a");
        builder.SetInnerText(text);
        builder.MergeAttribute("href", url);
        if (webGrid.IsAjaxEnabled) {
            builder.MergeAttribute("data-swhglnk", "true");
        }
        return builder.ToString(TagRenderMode.Normal);
    }


    private static bool ModeEnabled(WebGridPagerModes mode, WebGridPagerModes modeCheck)
    {
        return (mode & modeCheck) == modeCheck;
    }

}
