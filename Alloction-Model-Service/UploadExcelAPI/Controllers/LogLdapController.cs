using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Threading.Tasks;

namespace UploadExcelAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LogLdapController : Controller
    {
        [HttpGet]
        public object LogLdap(string username, string password)
        {
            string UserN = "ptt\\" + username;
            if (username.ToUpper().StartsWith("Z"))
            {
                UserN = "pttdigital\\" + username;
            }
            DirectoryEntry PTTentry = new DirectoryEntry("LDAP://PTTGRP.CORP", UserN, password, AuthenticationTypes.Secure);
            try
            {
                DirectorySearcher search = new DirectorySearcher(PTTentry);

                search.Filter = "(SAMAccountName=" + username + ")";
                search.PropertiesToLoad.Add("cn");
                SearchResult result = search.FindOne();

                if (null == result)
                    return true;

            }
            catch (Exception exptt)
            {
                UserN = "pttdigital\\" + username;
                PTTentry = new DirectoryEntry("LDAP://PTTGRP.CORP", UserN, password, AuthenticationTypes.Secure);
                try
                {
                    DirectorySearcher search = new DirectorySearcher(PTTentry);

                    search.Filter = "(SAMAccountName=" + username + ")";
                    search.PropertiesToLoad.Add("cn");
                    SearchResult result = search.FindOne();

                    if (null == result)
                        return true;

                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
            return true;
        }

        private static bool isPasswordExpired(string UserName)
        {
            string ADPath = "LDAP://PTTGRP.CORP";

            DirectoryEntry de = new DirectoryEntry(ADPath);
            DirectorySearcher search = new DirectorySearcher(de);
            search.Filter = "(SAMAccountName=" + UserName + ")";
            search.PropertiesToLoad.Add("maxPwdAge");
            search.PropertiesToLoad.Add("pwdLastSet");
            search.PropertiesToLoad.Add("userAccountControl");
            try
            {
                SearchResult result = search.FindOne();
                Int32 val1 = (Int32)result.Properties["userAccountControl"][0];
                if ((val1 & 65536) == 65536)
                {
                    return false;
                }
                else
                {
                    Int64 val = (Int64)result.Properties["pwdLastSet"][0];
                    DateTime d = DateTime.FromFileTime(val);
                    TimeSpan maxPwdAge = GetMaxPasswordAge();
                    DateTime exp = d.Add(maxPwdAge);

                    return exp < DateTime.Now;
                }
            }
            catch
            {
            }
            return false;
        }

        private static TimeSpan GetMaxPasswordAge()
        {
            using (System.DirectoryServices.ActiveDirectory.Domain d = System.DirectoryServices.ActiveDirectory.Domain.GetCurrentDomain())
            using (DirectoryEntry domain = d.GetDirectoryEntry())
            {
                DirectorySearcher ds = new DirectorySearcher(
                  domain,
                  "(objectClass=*)",
                  null,
                  SearchScope.Base
                  );
                SearchResult sr = ds.FindOne();
                TimeSpan maxPwdAge = TimeSpan.MinValue;
                if (sr.Properties.Contains("maxPwdAge"))
                    maxPwdAge = TimeSpan.FromTicks((long)sr.Properties["maxPwdAge"][0]);
                return maxPwdAge.Duration();
            }
        }

    }
}
