using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Data.Entity.Validation;

namespace EF_General.Models.Ex31
{
    public class ValidationStrings
    {
        public static string Required
        {
            get { return "Please enter the Name."; }
        }
    }

    public class User
    {
        public int Id { set; get; }

        [Required(ErrorMessageResourceType = typeof(ValidationStrings), ErrorMessageResourceName = "Required")]
        public string Name { set; get; }
    }

    public class MyContext : DbContext
    {
        public DbSet<User> Users { set; get; }

        public MyContext()
            : base("Connection1")
        {
            this.Database.Log = sql => Console.Write(sql);
        }
    }

    public class Configuration : DbMigrationsConfiguration<MyContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
    }

    /// <summary>
    /// Call EF_General.Models.Ex31.Test.RunTests();            
    /// </summary>
    public static class Test
    {
        public static void RunTests()
        {
            startDB();

            using (var ctx = new MyContext())
            {
                try
                {
                    ctx.Users.Add(new User()); //نام كاربر به عمد وارد نشده تا خطا دهد
                    ctx.SaveChanges();
                }
                catch (DbEntityValidationException ex)
                {
                    foreach(var error in ex.EntityValidationErrors)
                    {
                        foreach (var item in error.ValidationErrors)
                        {
                            Console.WriteLine(item.ErrorMessage); // خطاي دريافتي از كلاس منبع را نمايش مي‌دهد
                        }
                    }

                    throw;
                }
            }
        }

        private static void startDB()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<MyContext, Configuration>());
            using (var context = new MyContext())
            {
                context.Database.Initialize(force: true);
            }
        }
    }
}