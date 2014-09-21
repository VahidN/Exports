// www.mb-seifollahi.ir




(function () {
    var itemCtx = {};
    itemCtx.Templates = {};
    itemCtx.Templates.Header = "<div><b title=\"اطلاعات فیلم ها\">Movie Data</b></div><ul>";
    itemCtx.Templates.Item = MyOverrideTemplate;
    itemCtx.Templates.Footer = "</ul>";
    itemCtx.BaseViewID = 1;
    itemCtx.ListTemplateType = 100; //For Generic List (More : http://msdn.microsoft.com/en-us/library/ms462947(v=office.12).aspx)

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(itemCtx);

})();



function GT(val , index)
{
    // example of val : 60 %
    var temp = val.split(' ')[0];
    var v = Number(temp);
    return v > index;
}

function LT(val, index) {
    var temp = val.split(' ')[0];
    var v = Number(temp);
    return v < index;
}

function EQ(val, index) {
    var temp = val.split(' ')[0];
    var v = Number(temp);
    return v == index;
}



function MyOverrideTemplate(ctx) {

   

    if (LT(ctx.CurrentItem.PopularityPercent ,25))
    {
        return "<li title='خیلی کم بازدید' style='color:white;background-color: red;width: 300px;height: 24px;'>" +
            ctx.CurrentItem.Title + " – " + ctx.CurrentItem.PopularityPercent + "</li>";
    }
    else
    if (LT(ctx.CurrentItem.PopularityPercent ,50))
    {
        return "<li title='کم بازدید'  style='color:maroon;background-color: #ffcc00;width: 300px;height: 24px;'>" +
            ctx.CurrentItem.Title + " – " + ctx.CurrentItem.PopularityPercent + "</li>";
    }
    else
    if (LT(ctx.CurrentItem.PopularityPercent ,75))
    {
        return "<li title='بازدید معمولی'  style='color:#ffcc00;background-color: maroon;width: 300px;height: 24px;'>" +
            ctx.CurrentItem.Title + " – " + ctx.CurrentItem.PopularityPercent + "</li>";
    }
    else
    if (LT(ctx.CurrentItem.PopularityPercent ,95))
    {
        return "<li title='پر بازدید'  style='color:yellow;background-color: blue;width: 300px;height: 24px;'>" +
            ctx.CurrentItem.Title + " – " + ctx.CurrentItem.PopularityPercent + "</li>";
    }
    else
        if (EQ(ctx.CurrentItem.PopularityPercent, 100)) {
            return "<li  title='بالاترین بازدید'  style='color:black;background-color: green;width: 300px;height: 24px;'>" +
                ctx.CurrentItem.Title + " – " + ctx.CurrentItem.PopularityPercent + "</li>";
        }
        else {
            return "<li title='نامعلوم'  style='color:navy;background-color: yellow;width: 300px;height: 24px;'>" +
                ctx.CurrentItem.Title + " – " + ctx.CurrentItem.PopularityPercent + "</li>";
        }
}


