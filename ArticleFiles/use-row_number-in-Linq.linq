<Query Kind="Statements" />

string[] mystring = new string[]{"a","b","c","d"};

int i=0;

var s1 = from s in mystring.ToList()
		let e = i++
		select new {
			Row_Number = i,StringName = s
		};

s1.Dump();
mystring.Count().Dump("mystring Count");
