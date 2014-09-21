using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web;
using System.Web.Caching;

namespace PWS.BLL
{
    /// <summary>
    /// کلاس  آیتم های حافظه کش
    /// </summary>
    [DataObject(true)]
    public class CacheItems
    {
		#region Constructors (2) 

        /// <summary>
        /// سازنده اصلی
        /// </summary>
        /// <param name="cacheItem">عنوان آیتم ذخیره شده در حافظه کش</param>
        public CacheItems(String cacheItem)
        {
            CacheItem = cacheItem;
        }

        /// <summary>
        /// سازنده پیش فرض
        /// </summary>
        public CacheItems(){}

		#endregion Constructors 

		#region Properties (2) 

        /// <summary>
        /// کش کانتکست جاری
        /// </summary>
        /// <value>
        /// The cache.
        /// </value>
        private static Cache Cache
        {
            get {return HttpContext.Current.Cache; }
        }

        /// <summary>
        /// عنوان آیتم ذخیره شده در حافظه کش
        /// </summary>
        public String CacheItem{ get; set;}

		#endregion Properties 

		#region Methods (4) 

		// Public Methods (3) 

        /// <summary>
        /// لیست تمام آیتم های ذخیره شده در حافظه کش
        /// </summary>
        /// <returns></returns>
        public List<CacheItems> GetCaches()
        {
            var items = new List<CacheItems>();

            var enumerator = Cache.GetEnumerator();
            while (enumerator.MoveNext())
            {
                 items.Add(new CacheItems(enumerator.Key.ToString()));
            }
            return items;
        }

        /// <summary>
        /// حذف آیتم جاری از حافظه کش
        /// </summary>
        public void RemoveItemFromCache()
        {
            RemoveItemFromCache(CacheItem);
        }

        /// <summary>
        /// حذف کردن یک آیتم از حافظه کش
        /// </summary>
        /// <param name="key">کلید ذخیره شده در حافظه کش</param>
        public static void RemoveItemFromCache(string key)
        {
            PurgeCacheItems(key);
        }
		// Private Methods (1) 

        /// <summary>
        /// حذف کردن یک ایتم از حافظه کش با پشوند وارد شده
        /// </summary>
        /// <param name="prefix">پیشوندی از کلید موجود در حافظه کش</param>
        private static void PurgeCacheItems(String prefix)
        {
            prefix = prefix.ToLower();
            var itemsToRemove = new List<String>();

            var enumerator = Cache.GetEnumerator();
            while (enumerator.MoveNext())
            {
                if (enumerator.Key.ToString().ToLower().StartsWith(prefix))
                    itemsToRemove.Add(enumerator.Key.ToString());
            }

            foreach (var itemToRemove in itemsToRemove)
                Cache.Remove(itemToRemove);
        }

		#endregion Methods 
    }
}
