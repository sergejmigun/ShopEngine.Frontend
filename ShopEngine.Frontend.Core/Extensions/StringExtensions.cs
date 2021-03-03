namespace System
{
    public static class StringExtensions
    {
        public static string FirstCharacterToLower(this string str)
        {
            if (string.IsNullOrEmpty(str) || char.IsLower(str, 0))
            {
                return str;
            }

            return char.ToLowerInvariant(str[0]) + str.Substring(1);
        }

        public static string SafeToLower(this string str)
        {
            if (str == null)
            {
                return null;
            }

            return str.ToLower();
        }

        public static string WhenNullThenEmpty(this string str)
        {
            if (str == null)
            {
                return string.Empty;
            }

            return str;
        }
    }
}
