using System;
using System.IO;
using Lex.Db;

namespace LexDbTests
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
    }

    public partial class Order
    {
        public int Id { get; set; }
        public int? CustomerFK { get; set; }
        public int[] ProductsFK { get; set; }
    }

    public static class Database
    {
        public static DbInstance Instance { get; private set; }

        public static DbTable<Product> Products { get; private set; }
        public static DbTable<Order> Orders { get; private set; }
        public static DbTable<Customer> Customers { get; private set; }

        /// <summary>
        /// سازنده استاتيكي كه در طول عمر برنامه فقط يكبار اجرا مي‌شود
        /// </summary>
        static Database()
        {
            createDb();
            getTables();
        }

        private static void getTables()
        {
            Products = Instance.Table<Product>();
            Customers = Instance.Table<Customer>();
            Orders = Instance.Table<Order>();
        }

        private static void createDb()
        {
            Instance = new DbInstance(Path.Combine(Environment.CurrentDirectory, "LexDbTests"));

            Instance.Map<Product>()
                    .WithIndex("NameIdx", x => x.Name)
                    .Automap(i => i.Id, true);

            Instance.Map<Order>()
                    .Automap(i => i.Id, true);

            Instance.Map<Customer>()
                    .WithIndex("NameIdx", x => x.Name)
                    .WithIndex("CityIdx", x => x.City)
                    .Automap(i => i.Id, true);

            Instance.Initialize();
        }
    }


    class Program
    {
        private static void addData()
        {
            var customer1 = new Customer { Name = "customer1", City = "City1" };
            var customer2 = new Customer { Name = "customer2", City = "City2" };
            Database.Instance.Save(customer1, customer2); // automatic Id assignment after Save

            var product1 = new Product { Name = "product1" };
            var product2 = new Product { Name = "product2" };
            Database.Instance.Save(product1, product2); // automatic Id assignment after Save

            var order1 = new Order { CustomerFK = customer1.Id, ProductsFK = new[] { product1.Id } };
            var order2 = new Order { CustomerFK = customer2.Id, ProductsFK = new[] { product1.Id, product2.Id } };
            Database.Instance.Save(order1, order2); // automatic Id assignment after Save
        }


        static void Main(string[] args)
        {
            addData();
            loadAll();
            queryingByAnIndex();
            advancedQueries();
            deletingRecords();


            Database.Instance.Compact();

            // Delete all ...
            Database.Instance.Purge();
        }

        private static void deletingRecords()
        {
            Database.Customers.DeleteByKey(key: 1);

            var customers = Database.Customers.LoadByKeys(new[] { 1, 2 });
            Database.Customers.Delete(customers);
        }

        private static void advancedQueries()
        {
            // Using Take and Skip
            var list1 = Database.Orders.Query<int>() // primary idx
                                       .Take(1).Skip(2).ToList();

            // Querying Between Ranges 
            var list2 = Database.Customers
                                .IndexQuery<string>("NameIdx")
                                .GreaterThan("a", orEqual: true).LessThan("d").ToList();
        }

        private static void queryingByAnIndex()
        {
            var name = "customer1";
            var customersList = Database.Customers
                                        .IndexQueryByKey("NameIdx", name)
                                        .ToList();
            foreach (var person in customersList)
            {
                Console.WriteLine(person.Name);
            }
        }

        private static void loadAll()
        {
            var orders = Database.Orders.LoadAll();
            foreach (var order in orders)
            {
                // نحوه دريافت اطلاعات مشتري بر اساس كليد خارجي ثبت شده
                var orderCustomer = Database.Customers.LoadByKey(order.CustomerFK.Value);
                Console.WriteLine("Order Id: {0}, Customer: {1} ({2}) {3}", order.Id, orderCustomer.Name, orderCustomer.Id, orderCustomer.City);

                // نحوه بازيابي ليستي از اشياء مرتبط از طريق آرايه‌اي از كليدهاي خارجي ثبت شده
                var orderProducts = Database.Products.LoadByKeys(order.ProductsFK);
                foreach (var product in orderProducts)
                {
                    Console.WriteLine("  Product Id: {0}, Name: {1}", product.Id, product.Name);
                }
            }
        }
    }
}