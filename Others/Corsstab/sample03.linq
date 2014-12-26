<Query Kind="Program" />

public class Expense
{
	public DateTime Date { set; get; }
	public string Department { set; get; }
	public decimal Expenses { set; get; }
}

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

public IList<Expense> ExpensesDataSource()
{
	return new List<Expense>
		{
			new Expense { Date = new DateTime(2011,11,1), Department = "Computer", Expenses = 100 },
			new Expense { Date = new DateTime(2011,11,1), Department = "Math", Expenses = 200 },
			new Expense { Date = new DateTime(2011,11,1), Department = "Physics", Expenses = 150 },

			new Expense { Date = new DateTime(2011,10,1), Department = "Computer", Expenses = 75 },
			new Expense { Date = new DateTime(2011,10,1), Department = "Math", Expenses = 150 },
			new Expense { Date = new DateTime(2011,10,1), Department = "Physics", Expenses = 130 },

			new Expense { Date = new DateTime(2011,9,1), Department = "Computer", Expenses = 90 },
			new Expense { Date = new DateTime(2011,9,1), Department = "Math", Expenses = 95 },
			new Expense { Date = new DateTime(2011,9,1), Department = "Physics", Expenses = 100 }
		};	
}

void Main()
{
	var list = ExpensesDataSource();
	Pivot1(list,
				x => 
					new
					{ 
						x.Date.Year, 
						x.Date.Month 
					},
				  x1 => x1.Department, 
				  x2 => x2.Sum(x => x.Expenses)).Dump();
}