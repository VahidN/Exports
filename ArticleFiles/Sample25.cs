using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Transactions;

namespace EF_General.Models.Ex25
{
    # region Database1
    public class User
    {
        public int Id { set; get; }
        public string FirstName { set; get; }
        public string LastName { set; get; }
    }

    public class Context1 : DbContext
    {
        public DbSet<User> Users { set; get; }

        public Context1()
            : base("Connection1")
        {
            this.Database.Log = sql => Console.Write(sql);
        }
    }

    public class Configuration1 : DbMigrationsConfiguration<Context1>
    {
        public Configuration1()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
    }
    #endregion

    # region Database2
    public class Request
    {
        public int Id { set; get; }
        public string Title { set; get; }
        public string Description { set; get; }

        public int UserId { set; get; }
    }

    public class Context2 : DbContext
    {
        public DbSet<Request> Requests { set; get; }

        public Context2()
            : base("Connection2")
        {
            this.Database.Log = sql => Console.Write(sql);
        }
    }

    public class Configuration2 : DbMigrationsConfiguration<Context2>
    {
        public Configuration2()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
    }
    #endregion

    # region Usage
    /// <summary>
    /// Call -> EF_General.Models.Ex25.Test.RunTests();            
    /// </summary>
    public static class Test
    {
        /*
         * براي اجراي اين مثال نياز به يك چنين تعاريفي در فايل كانفيگ داريد
         * دو رشته اتصالي كه به دو بانك اطلاعاتي مختلف اشاره مي‌كنند
        <connectionStrings>
            <clear />
            <add name="Connection1" 
                 connectionString="Data Source=(local);Initial Catalog=testdb1;Integrated Security = true" 
                 providerName="System.Data.SqlClient" />
            <add name="Connection2"
                 connectionString="Data Source=(local);Initial Catalog=testdb2;Integrated Security = true"
                 providerName="System.Data.SqlClient" />
          </connectionStrings>  
         */

        public static void RunTests()
        {
            startDB();
            // الان دو بانك اطلاعاتي جديد بايد ايجاد و تنظيم شده باشند

            /*
            using (var scope = new TransactionScope(TransactionScopeOption.RequiresNew,
                                   new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted }))
            {
                var user = new User { FirstName = "f1", LastName = "l1" };
                using (var context1 = new Context1())
                {                    
                    context1.Users.Add(user);
                    context1.SaveChanges();
                }

                using (var context2 = new Context2())
                {
                    context2.Requests.Add(new Request { Title = "t1", Description = "desc1", UserId = user.Id });
                    context2.SaveChanges();
                }

                scope.Complete();
            }*/
        }

        private static void startDB()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<Context1, Configuration1>());
            using (var context1 = new Context1())
            {
                context1.Database.Initialize(force: true);
            }

            Database.SetInitializer(new MigrateDatabaseToLatestVersion<Context2, Configuration2>());
            using (var context2 = new Context2())
            {
                context2.Database.Initialize(force: true);
            }
        }
    }
    #endregion
}