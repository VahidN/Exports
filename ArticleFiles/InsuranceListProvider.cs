using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace MyConvertor
{
    public class InsuranceListProvider
    {
        public void WriteInsuranceFiles(DSKKARProps _KARProps, List<DSKWORProps> _WORPropsList, string dir)
        {
            try
            {
                using (OleDbConnection connection = new OleDbConnection(@"Provider=VFPOLEDB.1;Data Source=" + dir))
                {
                    using (var command = new OleDbCommand())
                    {
                        command.Connection = connection;
                        command.Connection.Open();
                        command.CommandText = "Create Table DSKKAR00 (dsk_id c(10), dsk_name c(100), dsk_farm c(100), dsk_adrs c(100), dsk_kind n(1), dsk_yy n(2), dsk_mm n(2), dsk_listno c(12), dsk_disc c(100), dsk_num n(5), " +
                         " dsk_tdd n(6), dsk_trooz n(12), dsk_tmah n(12), dsk_tmaz n(12), dsk_tmash n(12), dsk_ttotl n(12), dsk_tbime n(12), dsk_tkoso n(12), dsk_bic n(12), dsk_rate n(5), dsk_prate n(2), dsk_bimh n(12), mon_pym c(3))";
                        command.CommandType = CommandType.Text;
                        command.ExecuteNonQuery();
                    }
                }
                var KARPath = Path.Combine(dir, "DSKKAR00.dbf");
                int dsk_tdd = 0, dsk_trooz = 0, dsk_tmah = 0, dsk_tmaz = 0, dsk_tmash = 0, dsk_ttotl = 0, dsk_tbime = 0;
                foreach (var item in _WORPropsList)
                {
                    dsk_tdd += item.DSW_DD;
                    dsk_trooz += item.DSW_ROOZ;
                    dsk_tmah += item.DSW_MAH;
                    dsk_tmaz += item.DSW_MAZ;
                    dsk_tmash += (item.DSW_MAZ + item.DSW_MAH);
                    dsk_tbime += item.DSW_BIME;

                }
                dsk_ttotl = dsk_tmash;
                using (OleDbConnection connection = new OleDbConnection(@"Provider=VFPOLEDB.1;Data Source=" + KARPath))
                {
                    ConvertWindowsPersianToDos cwptdCls = new ConvertWindowsPersianToDos();
                    using (var command = new OleDbCommand())
                    {
                        command.Connection = connection;
                        command.Connection.Open();
                        command.CommandText = "Insert Into DSKKAR00 Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        command.Parameters.AddWithValue("?", _KARProps.DSK_ID);
                        command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(_KARProps.DSK_NAME)).ToArray()));
                        command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(_KARProps.DSK_FARM)).ToArray()));
                        command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(_KARProps.DSK_ADRS)).ToArray()));
                        command.Parameters.AddWithValue("?", _KARProps.DSK_KIND);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_YY);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_MM);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_LISTNO);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_DISC);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_NUM);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_TDD);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_TROOZ);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_TMAH);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_TMAZ);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_TMASH);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_TTOTL);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_TBIME);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_TKOSO);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_BIC);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_RATE);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_PRATE);
                        command.Parameters.AddWithValue("?", _KARProps.DSK_BIMH);
                        command.Parameters.AddWithValue("?", _KARProps.MON_PYM);
                        command.CommandType = CommandType.Text;
                        command.ExecuteNonQuery();
                    }
                }
                using (OleDbConnection connection = new OleDbConnection(@"Provider=VFPOLEDB.1;Data Source=" + dir))
                {
                    using (var command = new OleDbCommand())
                    {
                        command.Connection = connection;
                        command.Connection.Open();
                        command.CommandText = "Create Table DSKWOR00 (DSW_ID c(10), DSW_YY n(2), DSW_MM n(2), DSW_LISTNO c(12), DSW_ID1 c(10), DSW_FNAME c(100), DSW_LNAME c(100)," +
                         " DSW_DNAME c(100), DSW_IDNO c(15), DSW_IDPLC c(100), DSW_IDATE c(8), DSW_BDATE c(8), DSW_SEX c(4), DSW_NAT c(10), DSW_OCP c(100), DSW_SDATE c(8), DSW_EDATE c(8)," +
                         " DSW_DD n(2), DSW_ROOZ n(12), DSW_MAH n(12), DSW_MAZ n(12), DSW_MASH n(12), DSW_TOTL n(12), DSW_BIME n(12), DSW_PRATE n(2), DSW_JOB c(6), PER_NATCOD c(10))";
                        command.CommandType = CommandType.Text;
                        command.ExecuteNonQuery();
                    }
                }
                var WORPath = Path.Combine(dir, "DSKWOR00.dbf");

                using (OleDbConnection connection = new OleDbConnection(@"Provider=VFPOLEDB.1;Data Source=" + WORPath))
                {
                    ConvertWindowsPersianToDos cwptdCls = new ConvertWindowsPersianToDos();
                    using (var command = new OleDbCommand())
                    {
                        command.Connection = connection;
                        foreach (var item in _WORPropsList)
                        {
                            command.Connection.Open();
                            command.CommandText = "Insert Into DSKWOR00 Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            command.Parameters.AddWithValue("?", item.DSW_ID);
                            command.Parameters.AddWithValue("?", item.DSW_YY);
                            command.Parameters.AddWithValue("?", item.DSW_MM);
                            command.Parameters.AddWithValue("?", item.DSW_LISTNO);
                            command.Parameters.AddWithValue("?", item.DSW_ID1);
                            command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(item.DSW_FNAME)).ToArray()));
                            command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(item.DSW_LNAME)).ToArray()));
                            command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(item.DSW_DNAME)).ToArray()));
                            command.Parameters.AddWithValue("?", item.DSW_IDNO);
                            command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(item.DSW_IDPLC)).ToArray()));
                            command.Parameters.AddWithValue("?", item.DSW_IDATE);
                            command.Parameters.AddWithValue("?", item.DSW_BDATE);
                            command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(item.DSW_SEX)).ToArray()));
                            command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(item.DSW_NAT)).ToArray()));
                            command.Parameters.AddWithValue("?", Encoding.Default.GetString((cwptdCls.get_Unicode_To_IranSystem(item.DSW_OCP)).ToArray()));
                            command.Parameters.AddWithValue("?", item.DSW_SDATE);
                            command.Parameters.AddWithValue("?", item.DSW_EDATE);
                            command.Parameters.AddWithValue("?", item.DSW_DD);
                            command.Parameters.AddWithValue("?", item.DSW_ROOZ);
                            command.Parameters.AddWithValue("?", item.DSW_MAH);
                            command.Parameters.AddWithValue("?", item.DSW_MAZ);
                            command.Parameters.AddWithValue("?", item.DSW_MASH);
                            command.Parameters.AddWithValue("?", item.DSW_TOTL);
                            command.Parameters.AddWithValue("?", item.DSW_BIME);
                            command.Parameters.AddWithValue("?", item.DSW_PRATE);
                            command.Parameters.AddWithValue("?", item.DSW_JOB);
                            command.Parameters.AddWithValue("?", item.PER_NATCOD);
                            command.CommandType = CommandType.Text;
                            command.ExecuteNonQuery();
                        }
                    }
                }
            }
            catch (Exception ex)
            { throw; }
        }
    }
    public class ConvertWindowsPersianToDos
    {
        #region
        public Dictionary<byte, byte> CharachtersMapper_Group1 = new Dictionary<byte, byte>
        {
            
        {48 , 128}, // 0
        {49 , 129}, // 1
        {50 , 130}, // 2
        {51 , 131}, // 3
        {52 , 132}, // 4
        {53 , 133}, // 5
        {54 , 134}, // 6
        {55 , 135}, // 7
        {56 , 136}, // 8
        {57 , 137}, // 9
        {161, 138}, // ،
        {191, 140}, // ؟
        {193, 143}, //ء 
        {194, 141}, // آ
        {195, 144}, // أ
        {196, 248}, //ؤ  
        {197, 144}, //إ
        {200, 146}, //ب 
        {201, 249}, //ة
        {202, 150}, //ت
        {203, 152}, //ث 
        {204, 154}, //ﺝ
        {205, 158}, //ﺡ
        {206, 160}, //ﺥ
        {207, 162}, //د
        {208, 163}, //ذ
        {209, 164}, //ر
        {210, 165},//ز
        {211, 167},//س
        {212, 169},//ش
        {213, 171}, //ص
        {214, 173}, //ض
        {216, 175}, //ط
        {217, 224}, //ظ
        {218, 225}, //ع
        {219, 229}, //غ
        {220, 139}, //-
        {221, 233},//ف
        {222, 235},//ق
        {223, 237},//ك
        {225, 241},//ل
        {227, 244},//م
        {228, 246},//ن
        {229, 249},//ه
        {230, 248},//و
        {236, 253},//ى
        {237, 253},//ی
        {129, 148},//پ
        {141, 156},//چ
        {142, 166},//ژ
        {152, 237},//ک
        {144, 239},//گ


           };
        public Dictionary<byte, byte> CharachtersMapper_Group2 = new Dictionary<byte, byte>
        {
       {48,128},//
       {49,129},//
       {50,130},
       {51,131},//
       {52,132},//
       {53,133},
       {54,134},//
       {55,135},//
       {56,136},
       {57,137},//
       {161,138},//،
       {191,140},//?
       {193,143},//ء
       {194,141},//آ
       {195,144},//أ
       {196,248},//ؤ
       {197,144},//إ
       {198,254},//ئ
       {199,144},//ا
       {200,147},//ب
       {201,251},//ة
       {202,151},//ت
       {203,153},//ث
       {204,155},//ج
       {205,159},//ح
       {206,161},//خ
       {207,162},//د
       {208,163},//ذ
       {209,164},//ر
       {210,165},//ز
       {211,168},//س
       {212,170},//ش
       {213,172},//ص
       {214,174},//ض
       {216,175},//ط
       {217,224},//ظ
       {218,228},//ع
       {219,232},//غ
       {220,139},//-
       {221,234},//ف
       {222,236},//ق
       {223,238},//ك
       {225,243},//ل
       {227,245},//م
       {228,247},//ن
       {229,251},//ه
       {230,248},//و
       {236,254},//ی
       {237,254},//ی
       {129,149},//پ
       {141 ,157},//چ
       {142,166},//ژ
       {152,238},//ک
       {144,240},//گ
       
       
        };

        public Dictionary<byte, byte> CharachtersMapper_Group3 = new Dictionary<byte, byte>
        {
                 
        {48 , 128}, // 0
        {49 , 129}, // 1
        {50 , 130}, // 2
        {51 , 131}, // 3
        {52 , 132}, // 4
        {53 , 133}, // 5
        {54 , 134}, // 6
        {55 , 135}, // 7
        {56 , 136}, // 8
        {57 , 137}, // 9
        {161, 138}, // ،
        {191, 140}, // ؟
        {193, 143}, //
        {194, 141}, //
        {195, 145}, //
        {196, 248}, //
        {197, 145}, // 
        {198, 252}, //
        {199, 145}, // 
        {200, 146}, // 
        {201, 249}, //
        {202, 150}, //
        {203, 152}, // 
        {204, 154}, //
        {205, 158}, // 
        {206, 160}, //
        {207, 162}, //
        {208, 163}, // 
        {209, 164}, //
        {210, 165}, //
        {211, 167}, // 
        {212, 169}, // 
        {213, 171}, //
        {214, 173}, // 
        {216, 175}, // 
        {217, 224}, //
        {218, 226}, // 
        {219, 230}, // 
        {220, 139}, //
        {221, 233}, // 
        {222, 235}, //
        {223, 237}, //
        {225, 241}, // 
        {227, 244}, //
        {228, 246}, //
        {229, 249}, //   
        {230, 248}, // 
        {236, 252}, //
        {237, 252}, // 
        {129, 148}, // 
        {141, 156}, //
        {142, 166}, // 
        {152, 237}, // 
        {144, 239}//
};
        public Dictionary<byte, byte> CharachtersMapper_Group4 = new Dictionary<byte, byte>
        {
            {48 , 128}, // 0
            {49 , 129}, // 1
            {50 , 130}, // 2
            {51 , 131}, // 3
            {52 , 132}, // 4
            {53 , 133}, // 5
            {54 , 134}, // 6
            {55 , 135}, // 7
            {56 , 136}, // 8
            {57 , 137}, // 9
            {161, 138}, // ،
            {191, 140}, // ؟
            {193,143}, //
            {194,141}, //
            {195,145}, //
            {196,248}, // 
            {197,145}, // 
            {198,254}, //
            {199,145}, // 
            {200,147}, // 
            {201,250}, //
            {202,151}, //
            {203,153}, //
            {204,155}, //
            {205,159}, //
            {206,161}, //
            {207,162}, //
            {208,163}, //
            {209,164}, //
            {210,165}, //
            {211,168}, // 
            {212,170}, //
            {213,172}, //
            {214,174}, //
            {216,175}, // 
            {217,224}, //
            {218,227}, //
            {219,231}, //
            {220,139}, //
            {221,234}, //
            {222,236}, //
            {223,238}, //
            {225,243}, //
            {227,245}, // 
            {228,247}, //
            {229,250}, //
            {230,248}, //
            {236,254}, //
            {237,254}, // 
            {129,149}, //
            {141,157}, //
            {142,166}, // 
            {152,238}, // 
            {144,240}, //
};
        #endregion
        public bool is_Lattin_Letter(byte c)
        {
            if (c < 128 && c > 31)
            {
                return true;
            }
            return false;

        }

        public byte get_Lattin_Letter(byte c)
        {
            if ("0123456789".IndexOf((char)c) >= 0)
                return (byte)(c + 80);
            return get_FarsiExceptions(c);
        }

        private byte get_FarsiExceptions(byte c)
        {
            switch (c)
            {
                case (byte)'(': return (byte)')';
                case (byte)'{': return (byte)'}';
                case (byte)'[': return (byte)']';
                case (byte)')': return (byte)'(';
                case (byte)'}': return (byte)'{';
                case (byte)']': return (byte)'[';
                default: return (byte)c;

            }

        }
        public bool is_Final_Letter(byte c)
        {
            string s = "ءآأؤإادذرزژو";

            if (s.ToString().IndexOf((char)c) >= 0)
            {
                return true;

            }
            return false;
        }
        public bool IS_White_Letter(byte c)
        {
            if (c == 8 || c == 09 || c == 10 || c == 13 || c == 27 || c == 32 || c == 0)
            {
                return true;
            }
            return false;
        }
        public bool Char_Cond(byte c)
        {
            return IS_White_Letter(c)
                || is_Lattin_Letter(c)
                || c == 191;
        }
        public List<byte> get_Unicode_To_IranSystem(string Unicode_Text)
        {

            // " رشته ای که فارسی است را دو کاراکتر فاصله به ابتدا و انتهای آن اضافه می کنیم
            string unicodeString = " " + Unicode_Text + " ";
            //ایجاد دو انکدینگ متفاوت
            Encoding ascii = //Encoding.ASCII;
                Encoding.GetEncoding("windows-1256");

            Encoding unicode = Encoding.Unicode;

            // تبدیل رشته به بایت
            byte[] unicodeBytes = unicode.GetBytes(unicodeString);

            // تبدیل بایتها از یک انکدینگ به دیگری
            byte[] asciiBytes = Encoding.Convert(unicode, ascii, unicodeBytes);

            // Convert the new byte[] into a char[] and then into a string.
            char[] asciiChars = new char[ascii.GetCharCount(asciiBytes, 0, asciiBytes.Length)];
            ascii.GetChars(asciiBytes, 0, asciiBytes.Length, asciiChars, 0);
            string asciiString = new string(asciiChars);
            byte[] b22 = Encoding.GetEncoding("windows-1256").GetBytes(asciiChars);


            int limit = b22.Length;

            byte pre = 0, cur = 0;


            List<byte> IS_Result = new List<byte>();
            // ****************************** shahrzad
            //for (int i = 0; i < limit; i++)
            for (int i = limit - 1; i >= 0; i--)
            {

                if (is_Lattin_Letter(b22[i]))
                {
                    cur = get_Lattin_Letter(b22[i]);

                    IS_Result.Add(cur);


                    pre = cur;
                }
                else if (i != 0 && i != b22.Length - 1)
                {
                    cur = get_Unicode_To_IranSystem_Char(b22[i - 1], b22[i], b22[i + 1]);

                    if (cur == 145) // برای بررسی استثنای لا
                    {
                        if (pre == 243)
                        {
                            IS_Result.RemoveAt(IS_Result.Count - 1);
                            IS_Result.Add(242);
                        }
                        else
                        {
                            IS_Result.Add(cur);
                        }
                    }
                    else
                    {
                        IS_Result.Add(cur);
                    }



                    pre = cur;
                }

            }

            return IS_Result;
        }
        public byte get_Unicode_To_IranSystem_Char(byte PreviousChar, byte CurrentChar, byte NextChar)
        {

            bool PFlag = Char_Cond(PreviousChar) || is_Final_Letter(PreviousChar);
            bool NFlag = Char_Cond(NextChar);
            if (PFlag && NFlag) return UCTOIS_Group_1(CurrentChar);
            else if (PFlag) return UCTOIS_Group_2(CurrentChar);
            else if (NFlag) return UCTOIS_Group_3(CurrentChar);

            return UCTOIS_Group_4(CurrentChar);

        }

        private byte UCTOIS_Group_4(byte CurrentChar)
        {

            if (CharachtersMapper_Group4.ContainsKey(CurrentChar))
            {
                return (byte)CharachtersMapper_Group4[CurrentChar];
            }
            return (byte)CurrentChar;
        }

        private byte UCTOIS_Group_3(byte CurrentChar)
        {
            if (CharachtersMapper_Group3.ContainsKey(CurrentChar))
            {
                return (byte)CharachtersMapper_Group3[CurrentChar];
            }
            return (byte)CurrentChar;
        }

        private byte UCTOIS_Group_2(byte CurrentChar)
        {
            if (CharachtersMapper_Group2.ContainsKey(CurrentChar))
            {
                return (byte)CharachtersMapper_Group2[CurrentChar];
            }
            return (byte)CurrentChar;
        }
        private byte UCTOIS_Group_1(byte CurrentChar)
        {
            if (CharachtersMapper_Group1.ContainsKey(CurrentChar))
            {
                return (byte)CharachtersMapper_Group1[CurrentChar];
            }
            return (byte)CurrentChar;
        }
    }

    public enum TextEncoding
    {
        Arabic1256 = 1256,
        CP1252 = 1252
    }

    public static class ConvertTo
    {
        #region private Members (2)

        // کد کاراکترها در ایران سیستم و معادل آنها در عربی 1256
        static Dictionary<byte, byte> CharactersMapper = new Dictionary<byte, byte>
        {
        {128,48}, // 0
        {129,49}, // 1
        {130,50}, // 2
        {131,51}, // 3
        {132,52}, // 4
        {133,53}, // 5
        {134,54}, // 6
        {135,55}, // 7
        {136,56}, // 8
        {137,57}, // 9
        {138,161}, // ،
        {139,220}, // -
        {140,191}, // ؟
        {141,194}, // آ
        {142,196}, // ﺋ
        {143,154}, // ء
        {144,199}, // ﺍ
        {145,199}, // ﺎ
        {146,200}, // ﺏ
        {147,200}, // ﺑ
        {148,129}, // ﭖ
        {149,129}, // ﭘ
        {150,202}, // ﺕ
        {151,202}, // ﺗ
        {152,203}, // ﺙ
        {153,203}, // ﺛ
        {154,204}, //ﺝ
        {155,204},// ﺟ
        {156,141},//ﭼ
        {157,141},//ﭼ
        {158,205},//ﺡ
        {159,205},//ﺣ
        {160,206},//ﺥ
        {161,206},//ﺧ
        {162,207},//د
        {163,208},//ذ
        {164,209},//ر
        {165,210},//ز
        {166,142},//ژ
        {167,211},//ﺱ
        {168,211},//ﺳ
        {169,212},//ﺵ
        {170,212},//ﺷ
        {171,213},//ﺹ
        {172,213},//ﺻ
        {173,214},//ﺽ
        {174,214},//ﺿ
        {175,216},//ط
        {224,217},//ظ
        {225,218},//ﻉ
        {226,218},//ﻊ
        {227,218},//ﻌ
        {228,218},//ﻋ
        {229,219},//ﻍ
        {230,219},//ﻎ
        {231,219},//ﻐ
        {232,219},//ﻏ
        {233,221},//ﻑ
        {234,221},//ﻓ
        {235,222},//ﻕ
        {236,222},//ﻗ
        {237,152},//ﮎ
        {238,152},//ﮐ
        {239,144},//ﮒ
        {240,144},//ﮔ
        {241,225},//ﻝ
        {242,225},//ﻻ
        {243,225},//ﻟ
        {244,227},//ﻡ
        {245,227},//ﻣ
        {246,228},//ﻥ
        {247,228},//ﻧ
        {248,230},//و
        {249,229},//ﻩ
        {250,229},//ﻬ
        {251,170},//ﻫ
        {252,236},//ﯽ
        {253,237},//ﯼ
        {254,237},//ﯾ
        {255,160} // فاصله
        };

        /// <summary>
        /// لیست کاراکترهایی که بعد از آنها باید یک فاصله اضافه شود
        /// </summary>
        static byte[] charactersWithSpaceAfter = { 
                                             146, // ب
                                             148, // پ
                                             150, // ت
                                             152, // ث
                                             154, // ج
                                             156, // چ
                                             158, // ح
                                             160, // خ
                                             167, // س
                                             169, // ش
                                             171, // ص
                                             173, // ض
                                             225, // ع
                                             229, // غ
                                             233, // ف
                                             235, // ق
                                             237, // ک
                                             239, // گ
                                             241, // ل
                                             244, // م
                                             246, // ن
                                             249, // ه
                                             252, //ﯽ
                                             253 // ی
                                         };


        #endregion

        /// <summary>
        /// تبدیل یک رشته ایران سیستم به یونیکد با استفاده از عربی 1256
        /// </summary>
        /// <param name="iranSystemEncodedString">رشته ایران سیستم</param>
        /// <returns></returns>
        [Obsolete("بهتر است از UnicodeFrom استفاده کنید")]
        public static string Unicode(string iranSystemEncodedString)
        {
            return UnicodeFrom(TextEncoding.Arabic1256, iranSystemEncodedString);
        }

        /// <summary>
        /// تبدیل یک رشته ایران سیستم به یونیکد
        /// </summary>
        /// <param name="iranSystemEncodedString">رشته ایران سیستم</param>
        /// <returns></returns>
        public static string UnicodeFrom(TextEncoding textEncoding, string iranSystemEncodedString)
        {
            // ************************************** shahrzad
            // the text is standard CP1252 ASCII
            Encoding cp1252 = Encoding.GetEncoding(1252);
            // تبدیل رشته به بایت
            byte[] stringBytes = cp1252.GetBytes(iranSystemEncodedString.Trim());

            // وهله سازی از انکودینگ صحیح برای تبدیل رشته ایران سیستم به بایت
            Encoding encoding = Encoding.GetEncoding((int)textEncoding);

            // حذف فاصله های موجود در رشته
            iranSystemEncodedString = iranSystemEncodedString.Replace(" ", "");

            // ************************************** shahrzad
            //// تبدیل رشته به بایت
            //byte[] stringBytes = encoding.GetBytes(iranSystemEncodedString.Trim());

            // تغییر ترتیب بایت هااز آخر به اول در صورتی که رشته تماماً عدد نباشد
            if (!IsNumber(iranSystemEncodedString))
            {
                stringBytes = stringBytes.Reverse().ToArray();
            }

            // آرایه ای که بایت های معادل را در آن قرار می دهیم
            // مجموع تعداد بایت های رشته + بایت های اضافی محاسبه شده 
            byte[] newStringBytes = new byte[stringBytes.Length + CountCharactersRequireTwoBytes(stringBytes)];

            int index = 0;

            // بررسی هر بایت و پیدا کردن بایت (های) معادل آن
            for (int i = 0; i < stringBytes.Length; ++i)
            {
                byte charByte = stringBytes[i];

                // اگر جز 128 بایت اول باشد که نیازی به تبدیل ندارد چون کد اسکی است
                if (charByte < 128)
                {
                    newStringBytes[index] = charByte;
                }
                else
                {
                    // اگر جز حروف یا اعداد بود معادلش رو قرار می دیم
                    if (CharactersMapper.ContainsKey(charByte))
                    {
                        newStringBytes[index] = CharactersMapper[charByte];
                    }
                }

                // اگر کاراکتر ایران سیستم "لا" بود چون کاراکتر متناظرش در عربی 1256 "ل" است و باید یک "ا" هم بعدش اضافه کنیم
                if (charByte == 242)
                {
                    newStringBytes[++index] = 199;
                }

                // اگر کاراکتر یکی از انواعی بود که بعدشان باید یک فاصله باشد
                // و در عین حال آخرین کاراکتر رشته نبود
                if (charactersWithSpaceAfter.Contains(charByte) && Array.IndexOf(stringBytes, charByte) != stringBytes.Length - 1)
                {
                    // یک فاصله بعد ان اضافه می کنیم
                    newStringBytes[++index] = 32;
                }

                index += 1;
            }

            // ********************************** shahrzad
            //// تبدیل به رشته و ارسال به فراخواننده
            //byte[] unicodeContent = Encoding.Convert(encoding, Encoding.Unicode, newStringBytes);
            //return Encoding.Unicode.GetString(unicodeContent).Trim();

            return Encoding.GetEncoding(1256).GetString(newStringBytes);

        }

        #region Private Methods (2)

        /// <summary>
        /// رشته ارسال شده تنها حاوی اعداد است یا نه
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        static bool IsNumber(string str)
        {
            return Regex.IsMatch(str, @"^[\d]+$");
        }

        /// <summary>
        ///  محاسبه تعداد کاراکترهایی که بعد از آنها یک کاراکتر باید اضافه شود
        ///  شامل کاراکتر لا
        ///  و کاراکترهای غیرچسبان تنها در صورتی که کاراکتر پایانی رشته نباشند
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        static int CountCharactersRequireTwoBytes(byte[] irTextBytes)
        {
            return (from b in irTextBytes
                    where (
                    charactersWithSpaceAfter.Contains(b) // یکی از حروف غیرچسبان باشد
                    && Array.IndexOf(irTextBytes, b) != irTextBytes.Length - 1) // و کاراکتر آخر هم نباشد
                    || b == 242 // یا کاراکتر لا باشد
                    select b).Count();
        }

        #endregion

    }

    public class DSKWORProps
    {
        public string DSW_ID { get; set; } // کد کارگاه
        public int DSW_YY { get; set; } // سال عملکرد
        public int DSW_MM { get; set; } // ماه عملکرد
        public string DSW_LISTNO { get; set; } // شماره لیست
        public string DSW_ID1 { get; set; } // شماره بیمه
        public string DSW_FNAME { get; set; } // نام
        public string DSW_LNAME { get; set; } // نام خانوادگی
        public string DSW_DNAME { get; set; } // نام پدر
        public string DSW_IDNO { get; set; } // شماره شناسنامه
        public string DSW_IDPLC { get; set; } // محل صدور
        public string DSW_IDATE { get; set; } // تاریخ صدور
        public string DSW_BDATE { get; set; } // تاریخ تولد
        public string DSW_SEX { get; set; } // جنسیت
        public string DSW_NAT { get; set; } // ملیت
        public string DSW_OCP { get; set; } // شرح شغل
        public string DSW_SDATE { get; set; } // تاریخ شروع به کار
        public string DSW_EDATE { get; set; } // تاریخ ترک کار
        public int DSW_DD { get; set; } // تعداد روزهای کارکرد
        public int DSW_ROOZ { get; set; } // دستمزد روزانه
        public int DSW_MAH { get; set; } // دستمزد ماهانه
        public int DSW_MAZ { get; set; } // مزایای ماهانه
        public int DSW_MASH { get; set; } // جمع دستمزد و مزایای ماهانه مشمول
        public int DSW_TOTL { get; set; } // جمع کل دستمزد و مزایای ماهانه
        public int DSW_BIME { get; set; } // حق بیمه سهم بیمه شده
        public int DSW_PRATE { get; set; } // نرخ پورسانتاژ
        public string DSW_JOB { get; set; } // کد شغل
        public string PER_NATCOD { get; set; } // کد ملی
    }
    public class DSKKARProps
    {
        public string DSK_ID { get; set; } // کد کارگاه
        public string DSK_NAME { get; set; } // نام کارگاه
        public string DSK_FARM { get; set; } // نام کارفرما
        public string DSK_ADRS { get; set; } // آدرس کارگاه
        public int DSK_KIND { get; set; } // نوع لیست همیشه مقدار 0 دارد
        public int DSK_YY { get; set; } // سال عملکرد
        public int DSK_MM { get; set; } // ماه عملکرد
        public string DSK_LISTNO { get; set; } // شماره لیست
        public string DSK_DISC { get; set; } // شرح لیست
        public int DSK_NUM { get; set; } // تعداد کارکنان
        public int DSK_TDD { get; set; } // مجموع روزهای کارکرد
        public int DSK_TROOZ { get; set; } // مجموع دستمزد روزانه
        public int DSK_TMAH { get; set; } // مجموع دستمزد ماهانه
        public int DSK_TMAZ { get; set; } // مجموع مزایای ماهانه مشمول
        public int DSK_TMASH { get; set; } // مجموع دستمزد و مزایای ماهانه مشمول
        public int DSK_TTOTL { get; set; } // مجموع کل دستمزد و مزایای ماهانه (مشمول و غیر مشمول)
        public int DSK_TBIME { get; set; } // مجموع حق بیمه سهم بیمه شده
        public int DSK_TKOSO { get; set; } // مجموع حق بیمه سهم کارفرما
        public int DSK_BIC { get; set; } // مجموع حق بیمه بیکاری
        public int DSK_RATE { get; set; } // نرخ حق بیمه
        public int DSK_PRATE { get; set; } // نرخ پورسانتاژ
        public int DSK_BIMH { get; set; } // نرخ مشاغل و سخت و زیان آور
        public string MON_PYM { get; set; } // ردیف پیمان
    }
}