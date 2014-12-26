using NHibernate.Dialect.Function;
using NHibernate.SqlCommand;

namespace NHibernateDialect
{
    public class CustomMsSqlCe40Dialect : MsSqlCe40Dialect
    {
        public CustomMsSqlCe40Dialect()
        {
            RegisterKeywords();
            RegisterFunctions();
        }

        protected virtual void RegisterKeywords()
        {
            RegisterKeyword("@@IDENTITY");
            RegisterKeyword("ADD");
            RegisterKeyword("ALL");
            RegisterKeyword("ALTER");
            RegisterKeyword("AND");
            RegisterKeyword("ANY");
            RegisterKeyword("AS");
            RegisterKeyword("ASC");
            RegisterKeyword("AUTHORIZATION");
            RegisterKeyword("AVG");
            RegisterKeyword("BACKUP");
            RegisterKeyword("BEGIN");
            RegisterKeyword("BETWEEN");
            RegisterKeyword("BREAK");
            RegisterKeyword("BROWSE");
            RegisterKeyword("BULK");
            RegisterKeyword("BY");
            RegisterKeyword("CASCADE");
            RegisterKeyword("CASE");
            RegisterKeyword("CHECK");
            RegisterKeyword("CHECKPOINT");
            RegisterKeyword("CLOSE");
            RegisterKeyword("CLUSTERED");
            RegisterKeyword("COALESCE");
            RegisterKeyword("COLLATE");
            RegisterKeyword("COLUMN");
            RegisterKeyword("COMMIT");
            RegisterKeyword("COMPUTE");
            RegisterKeyword("CONSTRAINT");
            RegisterKeyword("CONTAINS");
            RegisterKeyword("CONTAINSTABLE");
            RegisterKeyword("CONTINUE");
            RegisterKeyword("CONVERT");
            RegisterKeyword("COUNT");
            RegisterKeyword("CREATE");
            RegisterKeyword("CROSS");
            RegisterKeyword("CURRENT");
            RegisterKeyword("CURRENT_DATE");
            RegisterKeyword("CURRENT_TIME");
            RegisterKeyword("CURRENT_TIMESTAMP");
            RegisterKeyword("CURRENT_USER");
            RegisterKeyword("CURSOR");
            RegisterKeyword("DATABASE");
            RegisterKeyword("DATABASEPASSWORD");
            RegisterKeyword("DATEADD");
            RegisterKeyword("DATEDIFF");
            RegisterKeyword("DATENAME");
            RegisterKeyword("DATEPART");
            RegisterKeyword("DBCC");
            RegisterKeyword("DEALLOCATE");
            RegisterKeyword("DECLARE");
            RegisterKeyword("DEFAULT");
            RegisterKeyword("DELETE");
            RegisterKeyword("DENY");
            RegisterKeyword("DESC");
            RegisterKeyword("DISK");
            RegisterKeyword("DISTINCT");
            RegisterKeyword("DISTRIBUTED");
            RegisterKeyword("DOUBLE");
            RegisterKeyword("DROP");
            RegisterKeyword("DUMP");
            RegisterKeyword("ELSE");
            RegisterKeyword("ENCRYPTION");
            RegisterKeyword("END");
            RegisterKeyword("ERRLVL");
            RegisterKeyword("ESCAPE");
            RegisterKeyword("EXCEPT");
            RegisterKeyword("EXEC");
            RegisterKeyword("EXECUTE");
            RegisterKeyword("EXISTS");
            RegisterKeyword("EXIT");
            RegisterKeyword("EXPRESSION");
            RegisterKeyword("FETCH");
            RegisterKeyword("FILE");
            RegisterKeyword("FILLFACTOR");
            RegisterKeyword("FOR");
            RegisterKeyword("FOREIGN");
            RegisterKeyword("FREETEXT");
            RegisterKeyword("FREETEXTTABLE");
            RegisterKeyword("FROM");
            RegisterKeyword("FULL");
            RegisterKeyword("FUNCTION");
            RegisterKeyword("GOTO");
            RegisterKeyword("GRANT");
            RegisterKeyword("GROUP");
            RegisterKeyword("HAVING");
            RegisterKeyword("HOLDLOCK");
            RegisterKeyword("IDENTITY");
            RegisterKeyword("IDENTITY_INSERT");
            RegisterKeyword("IDENTITYCOL");
            RegisterKeyword("IF");
            RegisterKeyword("IN");
            RegisterKeyword("INDEX");
            RegisterKeyword("INNER");
            RegisterKeyword("INSERT");
            RegisterKeyword("INTERSECT");
            RegisterKeyword("INTO");
            RegisterKeyword("IS");
            RegisterKeyword("JOIN");
            RegisterKeyword("KEY");
            RegisterKeyword("KILL");
            RegisterKeyword("LEFT");
            RegisterKeyword("LIKE");
            RegisterKeyword("LINENO");
            RegisterKeyword("LOAD");
            RegisterKeyword("MAX");
            RegisterKeyword("MIN");
            RegisterKeyword("NATIONAL");
            RegisterKeyword("NOCHECK");
            RegisterKeyword("NONCLUSTERED");
            RegisterKeyword("NOT");
            RegisterKeyword("NULL");
            RegisterKeyword("NULLIF");
            RegisterKeyword("OF");
            RegisterKeyword("OFF");
            RegisterKeyword("OFFSETS");
            RegisterKeyword("ON");
            RegisterKeyword("OPEN");
            RegisterKeyword("OPENDATASOURCE");
            RegisterKeyword("OPENQUERY");
            RegisterKeyword("OPENROWSET");
            RegisterKeyword("OPENXML");
            RegisterKeyword("OPTION");
            RegisterKeyword("OR");
            RegisterKeyword("ORDER");
            RegisterKeyword("OUTER");
            RegisterKeyword("OVER");
            RegisterKeyword("PERCENT");
            RegisterKeyword("PLAN");
            RegisterKeyword("PRECISION");
            RegisterKeyword("PRIMARY");
            RegisterKeyword("PRINT");
            RegisterKeyword("PROC");
            RegisterKeyword("PROCEDURE");
            RegisterKeyword("PUBLIC");
            RegisterKeyword("RAISERROR");
            RegisterKeyword("READ");
            RegisterKeyword("READTEXT");
            RegisterKeyword("RECONFIGURE");
            RegisterKeyword("REFERENCES");
            RegisterKeyword("REPLICATION");
            RegisterKeyword("RESTORE");
            RegisterKeyword("RESTRICT");
            RegisterKeyword("RETURN");
            RegisterKeyword("REVOKE");
            RegisterKeyword("RIGHT");
            RegisterKeyword("ROLLBACK");
            RegisterKeyword("ROWCOUNT");
            RegisterKeyword("ROWGUIDCOL");
            RegisterKeyword("RULE");
            RegisterKeyword("SAVE");
            RegisterKeyword("SCHEMA");
            RegisterKeyword("SELECT");
            RegisterKeyword("SESSION_USER");
            RegisterKeyword("SET");
            RegisterKeyword("SETUSER");
            RegisterKeyword("SHUTDOWN");
            RegisterKeyword("SOME");
            RegisterKeyword("STATISTICS");
            RegisterKeyword("SUM");
            RegisterKeyword("SYSTEM_USER");
            RegisterKeyword("TABLE");
            RegisterKeyword("TEXTSIZE");
            RegisterKeyword("THEN");
            RegisterKeyword("TO");
            RegisterKeyword("TOP");
            RegisterKeyword("TRAN");
            RegisterKeyword("TRANSACTION");
            RegisterKeyword("TRIGGER");
            RegisterKeyword("TRUNCATE");
            RegisterKeyword("TSEQUAL");
            RegisterKeyword("UNION");
            RegisterKeyword("UNIQUE");
            RegisterKeyword("UPDATE");
            RegisterKeyword("UPDATETEXT");
            RegisterKeyword("USE");
            RegisterKeyword("USER");
            RegisterKeyword("VALUES");
            RegisterKeyword("VARYING");
            RegisterKeyword("VIEW");
            RegisterKeyword("WAITFOR");
            RegisterKeyword("WHEN");
            RegisterKeyword("WHERE");
            RegisterKeyword("WHILE");
            RegisterKeyword("WITH");
            RegisterKeyword("WRITETEXT");
            RegisterKeyword("smallint");
            RegisterKeyword("int");
            RegisterKeyword("real");
            RegisterKeyword("float");
            RegisterKeyword("money");
            RegisterKeyword("bit");
            RegisterKeyword("tinyint");
            RegisterKeyword("bigint");
            RegisterKeyword("uniqueidentifier");
            RegisterKeyword("varbinary");
            RegisterKeyword("binary");
            RegisterKeyword("image");
            RegisterKeyword("nvarchar");
            RegisterKeyword("nchar");
            RegisterKeyword("ntext");
            RegisterKeyword("numeric");
            RegisterKeyword("datetime");
            RegisterKeyword("rowversion");
            RegisterKeyword("@@DBTS");
            RegisterKeyword("@@SHOWPLAN");
            RegisterKeyword("ABS");
            RegisterKeyword("ACOS");
            RegisterKeyword("ASIN");
            RegisterKeyword("ATAN");
            RegisterKeyword("ATN2");
            RegisterKeyword("CEILING");
            RegisterKeyword("CHARINDEX");
            RegisterKeyword("CAST");
            RegisterKeyword("COS");
            RegisterKeyword("COT");
            RegisterKeyword("DATALENGTH");
            RegisterKeyword("DEGREES");
            RegisterKeyword("EXP");
            RegisterKeyword("FLOOR");
            RegisterKeyword("GETDATE");
            RegisterKeyword("LEN");
            RegisterKeyword("LOG");
            RegisterKeyword("LOG10");
            RegisterKeyword("LOWER");
            RegisterKeyword("LTRIM");
            RegisterKeyword("NCHAR");
            RegisterKeyword("NEWID");
            RegisterKeyword("PATINDEX");
            RegisterKeyword("PI");
            RegisterKeyword("POWER");
            RegisterKeyword("RADIANS");
            RegisterKeyword("RAND");
            RegisterKeyword("REPLACE");
            RegisterKeyword("REPLICATE");
            RegisterKeyword("RTRIM");
            RegisterKeyword("SHOWPLAN");
            RegisterKeyword("XML");
            RegisterKeyword("SIGN");
            RegisterKeyword("SIN");
            RegisterKeyword("SPACE");
            RegisterKeyword("SQRT");
            RegisterKeyword("STR");
            RegisterKeyword("STUFF");
            RegisterKeyword("SUBSTRING");
            RegisterKeyword("TAN");
            RegisterKeyword("UNICODE");
            RegisterKeyword("UPPER");
            RegisterKeyword("FORCE");
            RegisterKeyword("ROWLOCK");
            RegisterKeyword("PAGLOCK");
            RegisterKeyword("TABLOCK");
            RegisterKeyword("DBLOCK");
            RegisterKeyword("UPDLOCK");
            RegisterKeyword("XLOCK");
            RegisterKeyword("HOLDLOCK");
            RegisterKeyword("NOLOCK");
            RegisterKeyword("GO");
            RegisterKeyword("NEXT");
            RegisterKeyword("OFFSET");
            RegisterKeyword("ONLY");
            RegisterKeyword("ROWS");
        }

        protected virtual void RegisterFunctions()
        {
            //Date and Time Functions
            RegisterFunction("second", new SQLFunctionTemplate(NHibernateUtil.Int32, "datepart(second, ?1)"));
            RegisterFunction("minute", new SQLFunctionTemplate(NHibernateUtil.Int32, "datepart(minute, ?1)"));
            RegisterFunction("hour", new SQLFunctionTemplate(NHibernateUtil.Int32, "datepart(hour, ?1)"));
            RegisterFunction("day", new SQLFunctionTemplate(NHibernateUtil.Int32, "datepart(day, ?1)"));
            RegisterFunction("month", new SQLFunctionTemplate(NHibernateUtil.Int32, "datepart(month, ?1)"));
            RegisterFunction("year", new SQLFunctionTemplate(NHibernateUtil.Int32, "datepart(year, ?1)"));
            RegisterFunction("date", new SQLFunctionTemplate(NHibernateUtil.Date, "dateadd(dd, 0, datediff(dd, 0, ?1))"));
            RegisterFunction("datename", new StandardSQLFunction("datename", NHibernateUtil.String));
            RegisterFunction("current_timestamp", new NoArgSQLFunction("getdate", NHibernateUtil.DateTime, true));
            RegisterFunction("datediff", new StandardSQLFunction("datediff", NHibernateUtil.Int32));

            //Mathematical Functions
            RegisterFunction("abs", new StandardSQLFunction("abs"));
            RegisterFunction("acos", new StandardSQLFunction("acos", NHibernateUtil.Double));
            RegisterFunction("asin", new StandardSQLFunction("asin", NHibernateUtil.Double));
            RegisterFunction("atan", new StandardSQLFunction("atan", NHibernateUtil.Double));
            RegisterFunction("atan2", new StandardSQLFunction("atan2", NHibernateUtil.Double));
            RegisterFunction("ceiling", new StandardSQLFunction("ceiling"));
            RegisterFunction("cos", new StandardSQLFunction("cos", NHibernateUtil.Double));
            RegisterFunction("cot", new StandardSQLFunction("cot", NHibernateUtil.Double));
            RegisterFunction("degrees", new StandardSQLFunction("degrees", NHibernateUtil.Double));
            RegisterFunction("exp", new StandardSQLFunction("exp", NHibernateUtil.Double));
            RegisterFunction("floor", new StandardSQLFunction("floor"));
            RegisterFunction("log", new StandardSQLFunction("log", NHibernateUtil.Double));
            RegisterFunction("log10", new StandardSQLFunction("log10", NHibernateUtil.Double));
            RegisterFunction("pi", new NoArgSQLFunction("pi", NHibernateUtil.Double, true));
            RegisterFunction("power", new StandardSQLFunction("power", NHibernateUtil.Double));
            RegisterFunction("radians", new StandardSQLFunction("radians", NHibernateUtil.Double));
            RegisterFunction("rand", new NoArgSQLFunction("rand", NHibernateUtil.Double));
            RegisterFunction("round", new StandardSQLFunction("round"));
            RegisterFunction("sign", new StandardSQLFunction("sign", NHibernateUtil.Int32));
            RegisterFunction("sin", new StandardSQLFunction("sin", NHibernateUtil.Double));
            RegisterFunction("sqrt", new StandardSQLFunction("sqrt", NHibernateUtil.Double));
            RegisterFunction("tan", new StandardSQLFunction("tan", NHibernateUtil.Double));

            //String Functions                       
            RegisterFunction("locate", new StandardSQLFunction("charindex", NHibernateUtil.Int32));
            RegisterFunction("length", new StandardSQLFunction("len", NHibernateUtil.Int32));
            RegisterFunction("lower", new StandardSQLFunction("lower"));
            RegisterFunction("ltrim", new StandardSQLFunction("ltrim"));
            RegisterFunction("patindex", new StandardSQLFunction("patindex", NHibernateUtil.Int32));
            RegisterFunction("replace", new StandardSafeSQLFunction("replace", NHibernateUtil.String, 3));
            RegisterFunction("replicate", new StandardSQLFunction("replicate", NHibernateUtil.String));
            RegisterFunction("rtrim", new StandardSQLFunction("rtrim", NHibernateUtil.String));
            RegisterFunction("space", new StandardSQLFunction("space", NHibernateUtil.String));
            RegisterFunction("str", new VarArgsSQLFunction(NHibernateUtil.String, "str(", ",", ")"));
            RegisterFunction("stuff", new StandardSQLFunction("stuff", NHibernateUtil.String));
            RegisterFunction("substring", new AnsiSubstringFunction());
            RegisterFunction("unicode", new StandardSQLFunction("unicode", NHibernateUtil.Int32));
            RegisterFunction("upper", new StandardSQLFunction("upper"));
            RegisterFunction("trim", new AnsiTrimEmulationFunction());
            RegisterFunction("concat", new VarArgsSQLFunction(NHibernateUtil.String, "(", "", ")"));

            //System Functions
            RegisterFunction("coalesce", new VarArgsSQLFunction("coalesce(", ",", ")"));
            RegisterFunction("newid", new NoArgSQLFunction("newid", NHibernateUtil.String, true));
        }

        public override bool SupportsLimit
        {
            get { return true; }
        }

        public override bool SupportsLimitOffset
        {
            get { return true; }
        }

        public override string SelectGUIDString
        {
            get { return "select newid()"; }
        }

        public override bool SupportsIdentityColumns
        {
            get { return true; }
        }

        public override char CloseQuote
        {
            get { return ']'; }
        }

        public override char OpenQuote
        {
            get { return '['; }
        }

        /// <summary>
        /// Can parameters be used for a statement containing a LIMIT?
        /// </summary>
        public override bool SupportsVariableLimit
        {
            get { return false; }
        }

        /// <summary>
        /// Does the <c>LIMIT</c> clause take a "maximum" row number
        /// instead of a total number of returned rows?
        /// </summary>
        /// <returns>false, unless overridden</returns>
        public override bool UseMaxForLimit
        {
            get { return true; }
        }

        public override bool SupportsSqlBatches
        {
            get { return false; }
        }

        public override bool IsKnownToken(string currentToken, string nextToken)
        {
            return currentToken == "n" && nextToken == "'"; // unicode character
        }

        public override bool SupportsUnionAll
        {
            get { return true; }
        }

        public override bool SupportsCircularCascadeDeleteConstraints
        {
            get { return false; }
        }
    }
}