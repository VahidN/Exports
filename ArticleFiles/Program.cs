using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProxyIsClass
{
    class Program
    {
        static void Main(string[] args)
        {
            GenericWorker<Student> worker = new GenericWorker<Student>();

            using (var context = new AppDbContext())
            {
                var std = context.Students.Find(1);

                worker.Do(std);
            }
        }
    }

    public class AppDbContext : DbContext
    {
        public AppDbContext()
            : base("MainConnectionString")
        {

        }

        public DbSet<Student> Students { get; set; }
    }

    public class GenericWorker<TEntity>
        where TEntity : EntityBase
    {
        public void Do(TEntity entity)
        {
            if (entity is Student)
            {

            }
        }
    }

    public class EntityBase
    {
        public virtual Int32 ID { get; set; }
    }

    public class Student : EntityBase
    {
        public virtual String Name { get; set; }
    }
}
