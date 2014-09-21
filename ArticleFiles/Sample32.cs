using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure.Interception;
using System.Data.Entity.Migrations;
using System.Linq;

namespace EF_General.Models.Ex32
{
    public class Reader
    {
        public int Id { set; get; }

        [Index(IsUnique = true)]
        [StringLength(450)]
        [Required]
        public string Name { set; get; }
    }

    public class MyContext : DbContext
    {
        public DbSet<Reader> Readers { set; get; }

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

    public class YeKeInterceptor : IDbCommandInterceptor
    {
        public void ReaderExecuting(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext)
        {
            command.ApplyCorrectYeKe();
        }

        public void NonQueryExecuted(DbCommand command, DbCommandInterceptionContext<int> interceptionContext)
        {
        }

        public void NonQueryExecuting(DbCommand command, DbCommandInterceptionContext<int> interceptionContext)
        {
            command.ApplyCorrectYeKe();
        }

        public void ReaderExecuted(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext)
        {
        }

        public void ScalarExecuted(DbCommand command, DbCommandInterceptionContext<object> interceptionContext)
        {
        }

        public void ScalarExecuting(DbCommand command, DbCommandInterceptionContext<object> interceptionContext)
        {
            command.ApplyCorrectYeKe();
        }
    }

    public static class YeKe
    {
        public const char ArabicYeChar = (char)1610;
        public const char PersianYeChar = (char)1740;

        public const char ArabicKeChar = (char)1603;
        public const char PersianKeChar = (char)1705;

        public static string ApplyCorrectYeKe(this object data)
        {
            return data == null ? null : ApplyCorrectYeKe(data.ToString());
        }

        public static string ApplyCorrectYeKe(this string data)
        {
            return string.IsNullOrWhiteSpace(data) ?
                        string.Empty :
                        data.Replace(ArabicYeChar, PersianYeChar).Replace(ArabicKeChar, PersianKeChar).Trim();
        }

        public static void ApplyCorrectYeKe(this DbCommand command)
        {
            command.CommandText = command.CommandText.ApplyCorrectYeKe();

            foreach (DbParameter parameter in command.Parameters)
            {
                switch (parameter.DbType)
                {
                    case DbType.AnsiString:
                    case DbType.AnsiStringFixedLength:
                    case DbType.String:
                    case DbType.StringFixedLength:
                    case DbType.Xml:
                        parameter.Value = parameter.Value.ApplyCorrectYeKe();
                        break;
                }
            }
        }
    }

    /// <summary>
    /// Call EF_General.Models.Ex32.Test.RunTests();            
    /// </summary>
    public static class Test
    {
        public static void RunTests()
        {
            DbInterception.Add(new YeKeInterceptor());
            startDb();

            using (var ctx = new MyContext())
            {
                var rnd = new Random();
                ctx.Readers.Add(new Reader { Name = " تستي" + rnd.Next() });
                ctx.SaveChanges();
            }

            using (var ctx = new MyContext())
            {
                var users = ctx.Readers.ToList();
                foreach (var user in users)
                {

                }
            }

        }

        private static void startDb()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<MyContext, Configuration>());
            using (var context = new MyContext())
            {
                context.Database.Initialize(force: true);
            }
        }
    }
}