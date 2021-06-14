#define DEBUG
using System.Diagnostics;

using System;
using System.Text;

/// <summary>
/// Tested Framework: 4.6.1
/// Platforms: Web, Winforms
/// Static: Yes
/// </summary>
public static class ezEncrypt
{
    public static class AES
    {

    }
    public static class Blowfish
    {

    }
    public static class DES
    {

    }
    public static class TripleDES
    {

    }
    public static class Serpent
    {

    }
    public static class Twofish
    {

    }
    public static class Camellia
    {

    }
    public static class Cast128
    {

    }
    public static class IDEA
    {

    }
    public static class RC2
    {

    }
    public static class RC5
    {

    }
    public static class SEED
    {

    }
    public static class Skipjack
    {

    }
    public static class TEA
    {

    }
    public static class XTEA
    {

    }

    /// <summary>
    /// Common Encryption
    /// When applying it twice, you get back the original string
    /// </summary>
    public static class XOR
    {
        public static void UnitTest()
        {
            string testValue = "Hello World";
            string key = "ThankySpanky!";
            string encrypted = encrypt(testValue, key);
            string decrypted = decrypt(encrypted, key);

            //Run in Debug Mode to see this in Output Window

            Debug.WriteLine("********DEBUG COMMENT********");
            Debug.WriteLine("* ezEncrypt.XOR.UnitTest()");
            Debug.WriteLine("DateTime:  " + DateTime.Now.ToString());
            Debug.WriteLine("text:      " + testValue);
            Debug.WriteLine("key:       " + key);
            Debug.WriteLine("Encrypted: " + encrypted);
            Debug.WriteLine("Success:   " + (decrypted == testValue).ToString());
            Debug.WriteLine("*****************************");
        }

        public static string encrypt(string text, string key)
        {
            byte[] decrypted = Encoding.UTF8.GetBytes(text);
            byte[] encrypted = new byte[decrypted.Length];

            for (int i = 0; i < decrypted.Length; i++)
            {
                encrypted[i] = (byte)(decrypted[i] ^ key[i % key.Length]);
            }

            string str = System.Convert.ToBase64String(encrypted);

            return str;
        }

        public static string decrypt(string text, string key)
        {
            var decoded = System.Convert.FromBase64String(text);

            byte[] result = new byte[decoded.Length];

            for (int c = 0; c < decoded.Length; c++)
            {
                result[c] = (byte)((uint)decoded[c] ^ (uint)key[c % key.Length]);
            }

            string str = Encoding.UTF8.GetString(result);

            return str;
        }

    }

}
