using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;

namespace EF_General.Models.Ex27
{
    public class Menu
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public string Description { set; get; }
        public string Description2 { set; get; }
    }

    public class MyContext : DbContext
    {
        public DbSet<Menu> Menus { set; get; }

        /*
  <connectionStrings>
    <clear />
    <add name="Connection1" 
         connectionString="Data Source=(local);Initial Catalog=testdb2013;Integrated Security = true" 
         providerName="System.Data.SqlClient" />
  </connectionStrings>          
         */

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
    /// todo: call -> Test.RunTests();
    /// </summary>
    public static class Test
    {
        public static void RunTests()
        {
            startDB();
        }

        private static void startDB()
        {
            UpdateMigrationHistory.UpdateDatabase(new Configuration());
            using (var context = new MyContext())
            {
                context.Database.Initialize(force: true);
            }
        }
    }

    public static class UpdateMigrationHistory
    {
        public static void UpdateDatabase(DbMigrationsConfiguration configuration)
        {
            var dbMigrator = new DbMigrator(configuration);
            dbMigrator.Update();
        }
    }
}