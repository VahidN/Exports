using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.ComponentModel.DataAnnotations;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Reflection;

namespace MefSample
{

    public static class ModelBuilderExtension
    {
        public static void AddFormAssembly(this DbModelBuilder modelBuilder, Assembly assembly)
        {
            Array.ForEach<Type>(assembly.GetTypes().Where(type => type.BaseType != null && 
                type.BaseType.IsGenericType &&                 
                type.Namespace == "MefSample" && /*براي اين مثال خاص*/
                type.BaseType.GetGenericTypeDefinition() == typeof(EntityTypeConfiguration<>)).ToArray(),
                delegate(Type type)
            {
                dynamic instance = Activator.CreateInstance(type);
                modelBuilder.Configurations.Add(instance);
            });
        }
    }

    public abstract class BaseEntity
    {
        public int Id { get; set; }
    }

    public class Category : BaseEntity
    {       
        [StringLength(30)]
        public string Title { get; set; }
    }

    public class CategoryMap : EntityTypeConfiguration<Category>
    {
        public CategoryMap()
        {
            ToTable("Category");

            HasKey(_field => _field.Id);

            Property(_field => _field.Title)
            .IsRequired();
        }
    }

    public interface IUnitOfWork
    {
        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        DbEntityEntry<TEntity> Entry<TEntity>() where TEntity : class;
        int SaveChanges();
        void Dispose();
    }

    [InheritedExport(typeof(IUnitOfWork))]
    public class DatabaseContext : DbContext, IUnitOfWork
    {
        private DbTransaction transaction = null;

        public DatabaseContext()
        {
            this.Configuration.AutoDetectChangesEnabled = false;
            this.Configuration.LazyLoadingEnabled = true;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.AddFormAssembly(Assembly.GetAssembly(typeof(CategoryMap)));
        }

        public DbEntityEntry<TEntity> Entry<TEntity>() where TEntity : class
        {
            return this.Entry<TEntity>();
        }
    }

    public class Configuration : DbMigrationsConfiguration<DatabaseContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
    }

    public class BusinessBase<TEntity> where TEntity : class
    {
        public BusinessBase(IUnitOfWork unitOfWork)
        {
            this.UnitOfWork = unitOfWork;
        }

        [Import]
        public IUnitOfWork UnitOfWork
        {
            get;
            private set;
        }

        public virtual IEnumerable<TEntity> GetAll()
        {
            return UnitOfWork.Set<TEntity>().AsNoTracking();
        }

        public virtual void Add(TEntity entity)
        {
            try
            {
                UnitOfWork.Set<TEntity>().Add(entity);
                UnitOfWork.SaveChanges();
            }
            catch
            {
                throw;
            }
            finally
            {
                UnitOfWork.Dispose();
            }
        }
    }

    public class Plugin
    {
        public void Run()
        {
            AggregateCatalog catalog = new AggregateCatalog();

            Container = new CompositionContainer(catalog);

            CompositionBatch batch = new CompositionBatch();

            catalog.Catalogs.Add(new AssemblyCatalog(Assembly.GetExecutingAssembly()));

            batch.AddPart(this);

            Container.Compose(batch);
        }

        public CompositionContainer Container
        {
            get;
            private set;
        }
    }

    public class CategoryBl : BusinessBase<Category>
    {
        [ImportingConstructor]
        public CategoryBl([Import(typeof(IUnitOfWork))] IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }
    }

    /// <summary>
    /// Run MyMefSample.Test()
    /// </summary>
    public static class MyMefSample
    {
        public static void Test()
        {
            startDB();

            Plugin plugin = new Plugin();
            plugin.Run();

            var category = new CategoryBl(plugin.Container.GetExportedValue<IUnitOfWork>());
            category.GetAll().ToList().ForEach(_record => Console.Write(_record.Title));
        }

        private static void startDB()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<DatabaseContext, Configuration>());            
            using (var context = new DatabaseContext())
            {
                context.Database.Initialize(force: true);
            }
        }
    }
}