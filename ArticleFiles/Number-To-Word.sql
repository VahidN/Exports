SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Hamidreza Abedini
-- Create date: 1392-08-01
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[fnNumberToWord_Persian](@pNumber AS VARCHAR(100))
RETURNS NVARCHAR(2000)
AS
BEGIN
	IF LEN(ISNULL(@pNumber, '')) = 0  RETURN NULL

	IF (PATINDEX('%[^0-9.-]%', @pNumber) > 0)
	   OR (LEN(@pNumber) -LEN(REPLACE(@pNumber, '-', '')) > 1)
	   OR (LEN(@pNumber) -LEN(REPLACE(@pNumber, '.', '')) > 1)
	   OR (CHARINDEX('-', @pNumber) > 1)
		RETURN 'خطا'
	
	IF PATINDEX('%[^0]%', @pNumber) = 0  RETURN 'صفر'
	IF (CHARINDEX('.', @pNumber) = 1) SET @pNumber='0'+@pNumber
	
	DECLARE @Negative  AS VARCHAR(5) = '';
	IF LEFT(@pNumber, 1) = '-'
	BEGIN
	    SET @pNumber = SUBSTRING(@pNumber, 2, 100)
	    SET @Negative  = 'منفی '
	END
	---------------------------------------------------------------------
	DECLARE @NumberTitle TABLE (val  INT,Title NVARCHAR(100));	
	INSERT INTO @NumberTitle (val,Title)
	VALUES(0, '')
		,(1, 'یک') ,(2, 'دو')	,(3, 'سه')	,(4, 'چهار')
		,(5, 'پنج'),(6, 'شش'),(7, 'هفت'),(8, 'هشت')
		,(9, 'نه'),(10, 'ده'),(11, 'یازده'),(12, 'دوازده')
		,(13, 'سیزده'),(14, 'چهارده')	,(15, 'پانزده'),(16, 'شانزده')
		,(17, 'هفده'),(18, 'هجده'),(19, 'نوزده'),(20, 'بیست')
		,(30, 'سی'),(40, 'چهل'),(50, 'پنجاه'),(60, 'شصت')
		,(70, 'هفتاد'),(80, 'هشتاد'),(90, 'نود'),(100, 'صد')
		,(200, 'دویست'),(300, 'سیصد'),(400, 'چهارصد'),(500, 'پانصد')
		,(600, 'ششصد'),(700, 'هفتصد'),(800, 'هشتصد'),(900, 'نهصد')
	
	DECLARE @PositionTitle TABLE (id  INT,Title NVARCHAR(100));			
	INSERT INTO @PositionTitle (id,title)
	VALUES (1, '')	,(2, 'هزار'),(3, 'میلیون'),(4, 'میلیارد'),(5, 'تریلیون')
		,(6, 'کوادریلیون'),(7, 'کوینتیلیون'),(8, 'سیکستیلون'),(9, 'سپتیلیون')
		,(10, 'اکتیلیون'),(11, 'نونیلیون'),(12, 'دسیلیون')
		,(13, 'آندسیلیون'),(14, 'دودسیلیون'),(15, 'تریدسیلیون')
		,(16, 'کواتردسیلیون'),(17, 'کویندسیلیون'),(18, 'سیکسدسیلیون')
		,(19, 'سپتندسیلیون'),(20, 'اکتودسیلیوم'),(21, 'نومدسیلیون')		
	
	DECLARE @DecimalTitle TABLE (id  INT,Title NVARCHAR(100));		
	INSERT INTO @DecimalTitle (id,Title)
	VALUES( 1 ,'دهم' ),(2 , 'صدم'),(3 , 'هزارم')
		,(4 , 'ده-هزارم'),(5 , 'صد-هزارم'),(6 , 'میلیون ام')
		,(7 , 'ده-میلیون ام'),(8 , 'صد-میلیون ام'),(9 , 'میلیاردم')
		,(10 , 'ده-میلیاردم')
	---------------------------------------------------------------------
	DECLARE @IntegerNumber NVARCHAR(100),
			@DecimalNumber NVARCHAR(100),
			@PointPosition INT =case CHARINDEX('.', @pNumber) WHEN 0 THEN LEN(@pNumber)+1 ELSE CHARINDEX('.', @pNumber) END
			
	SET @IntegerNumber= LEFT(@pNumber, @PointPosition - 1)
	SET @DecimalNumber= '?' + SUBSTRING(@pNumber, @PointPosition + 1, LEN(@pNumber))
	SET @DecimalNumber=  SUBSTRING(@DecimalNumber,2, len(@DecimalNumber )-PATINDEX('%[^0]%', REVERSE (@DecimalNumber)))

	SET @pNumber= @IntegerNumber
	---------------------------------------------------------------------
	DECLARE @Number AS INT
	DECLARE @MyNumbers TABLE (id INT IDENTITY(1, 1), Val1 INT, Val2 INT, Val3 INT)
	
	WHILE (@pNumber) <> '0'
	BEGIN
	    SET @number = CAST(SUBSTRING(@pNumber, LEN(@pNumber) -2, 3)AS INT)	
	    
		INSERT INTO @MyNumbers
		SELECT (@Number % 1000) -(@Number % 100),
		CASE 
			WHEN @Number % 100 BETWEEN 10 AND 19 THEN @Number % 100
			ELSE (@Number % 100) -(@Number % 10)
		END,
		CASE 
			WHEN @Number % 100 BETWEEN 10 AND 19 THEN 0
			ELSE @Number % 10
		END
	    
	    IF LEN(@pNumber) > 2
	        SET @pNumber = LEFT(@pNumber, LEN(@pNumber) -3)
	    ELSE
	        SET @pNumber = '0'
	END
	---------------------------------------------------------------------	
	DECLARE @Str AS NVARCHAR(2000) = '';

	SELECT @Str += REPLACE(REPLACE(LTRIM(RTRIM(nt1.Title + ' ' + nt2.Title + ' ' + nt3.title)),'  ',' '),' ', ' و ')
	       + ' ' + pt.title + ' و '
	FROM   @MyNumbers  AS mn
	       INNER JOIN @PositionTitle pt
	            ON  pt.id = mn.id
	       INNER JOIN @NumberTitle nt1
	            ON  nt1.val = mn.Val1
	       INNER JOIN @NumberTitle nt2
	            ON  nt2.val = mn.Val2
	       INNER JOIN @NumberTitle nt3
	            ON  nt3.val = mn.Val3
	WHERE  (nt1.val + nt2.val + nt3.val > 0)
	ORDER BY pt.id DESC
	
	IF @IntegerNumber='0'  
		SET @Str=CASE WHEN PATINDEX('%[^0]%', @DecimalNumber) > 0 THEN @Negative ELSE '' END + 'صفر'
	ELSE
		SET @Str = @Negative  + LEFT (@Str, LEN(@Str) -2)
		
    DECLARE @PTitle NVARCHAR(100)=ISNULL((SELECT Title FROM @DecimalTitle WHERE id=LEN(@DecimalNumber)),'')
	SET @Str += ISNULL(' ممیز '+[dbo].[fnNumberToWord_Persian](@DecimalNumber) +' '+@PTitle,'')
	RETURN @str
END
