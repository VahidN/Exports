<Query Kind="Program" />

public class StudentStat
{
	public int Id { set; get; }
	public string Name { set; get; }
	public DateTime Date { set; get; }
	public bool IsPresent { set; get; }
}

public static IList<StudentStat> CreateWeeklyReportDataSource()
{
	var result = new List<StudentStat>();
	var rnd = new Random();

	for (int day = 1; day < 6; day++)
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
	//CreateWeeklyReportDataSource().Dump();
	CreateWeeklyReportDataSource()
						.GroupBy(x =>
								  new
								  {
									  x.Id
								  })
						.Select(myGroup =>
								  new
								  {
									  myGroup.Key.Id,
									  Name = myGroup.First().Name,
									  Day1IsPresent = myGroup.Where(x => x.Date.Day == 1).First().IsPresent,
									  Day2IsPresent = myGroup.Where(x => x.Date.Day == 2).First().IsPresent,
									  Day3IsPresent = myGroup.Where(x => x.Date.Day == 3).First().IsPresent,
									  Day4IsPresent = myGroup.Where(x => x.Date.Day == 4).First().IsPresent,
									  Day5IsPresent = myGroup.Where(x => x.Date.Day == 5).First().IsPresent,
									  PresentsCount = myGroup.Where(x => x.IsPresent).Count(),
									  AbsentsCount = myGroup.Where(x => !x.IsPresent).Count()
								  }).Dump();
}


