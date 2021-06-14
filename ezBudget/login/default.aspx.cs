using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ezBudget.register
{
    public partial class _default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        public string Authenticated(string userName, string pwd)
        {
            string ret = "";
            SqlConnection conn = null;
            DataSet ds = null;

            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                ds = new DataSet();
                using (SqlCommand sc = new SqlCommand("spUserGet", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@Username",userName),
                        new SqlParameter("@Password", pwd)
                            });

                    using (var sda = new SqlDataAdapter(sc))
                    {
                        sda.Fill(ds);
                    }

                    if (ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            ret = ds.Tables[0].Rows[0]["id"].ToString();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                AlertRegisterStartupScript(ex.Message);
            }
            return ret;
        }
        protected void btnSave_Click(object sender, EventArgs e)
        {
            Response.Redirect("Success.aspx", true);
        }
        protected void AlertRegisterStartupScript(string msg)
        {
            ClientScriptManager cs = Page.ClientScript;
            try

            {
                cs.RegisterStartupScript(this.GetType(),

                    "ErrorMessageMethod",

                    "<script type=\"text/javascript\">alert(\"" + msg + "\");</script>");
            }

            catch (Exception)
            {
                //Absolutely, do not throw
                //This is used to help manage errors
            }
        }


        protected void btnLogin_Click(object sender, EventArgs e)
        {
            string id = Authenticated(txtEmail.Text, txtPassword.Text);

            if (id != "")
            {
                Session["authId"] = id;
                FormsAuthentication.SetAuthCookie(id, true);
                if (Request.QueryString["ReturnUrl"] != null)
                {
                    FormsAuthentication.RedirectFromLoginPage(id, false);
                }
                else
                {
                    Response.Redirect("../budget");
                }
            }
            else
            {
                AlertRegisterStartupScript("Credentials are incorrect, try again.");
            }
        }
    }
}