<Query Kind="Program" />

public Dictionary<TKey1, Dictionary<TKey2, TValue>> 
						Pivot1<TSource, TKey1, TKey2, TValue>
						(
							 IEnumerable<TSource> source,
							Func<TSource, TKey1> key1Selector,
							Func<TSource, TKey2> key2Selector,
							Func<IEnumerable<TSource>, TValue> aggregate
						)
{
		return source.GroupBy(key1Selector)
						 .Select(
							myGroup => new
								{
									X = myGroup.Key,
									Y = myGroup.GroupBy(key2Selector)
										 .Select(
											z => new
											   {
												   Z = z.Key,
												   V = aggregate(z)
											   })
										 .ToDictionary(e => e.Z, o => o.V)
								})
						 .ToDictionary(e => e.X, o => o.Y);
}

public class StudentStat
{
	public int Id { set; get; }
	public string Name { set; get; }
	public DateTime Date { set; get; }
	public bool IsPresent { set; get; }
}

public IList<StudentStat> CreateWeeklyReportDataSource()
{
	var result = new List<StudentStat>();
	var rnd = new Random();

	for (int day = 1; day < 31; day++)
	{
		for (int student = 1; student < 6; student++)
		{
			result.Add(new StudentStat
			{
				Id = student,
				Date = new DateTime(2011, 11, day),
				IsPresent = rnd.Next(-1, 1) == 0 ? true : false,
				Name = "student " + student
			});
		}
	}

	return result;
}
	
void Main()
{
	var list = CreateWeeklyReportDataSource().Where(x=>x.Date.Day>=10 && x.Date.Day<=23);
  Pivot1(list,
			  x =>
	            new {
					  x.Id,
					  x.Name
				    }, 
			  x1 => "Day " + x1.Date.Day,
			  x2 => x2.First().IsPresent
		).Dump();
}