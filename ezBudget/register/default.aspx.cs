using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ezBudget.register
{
    public partial class _default1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        public string CreateRecord(string userName, string pwd)
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
                using (SqlCommand sc = new SqlCommand("spUserIns", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@Username",userName),
                        new SqlParameter("@Password", pwd)
                            });

                    sc.BeginExecuteNonQuery();

                }
            }
            catch (Exception ex)
            {
                ret = ex.Message;
            }
            return ret;
        }

        protected void btnSave_Click(object sender, EventArgs e)
        {
            try
            {
                String email = txtEmail.Text;
                String pwd = txtPassword.Text;

                if (CreateRecord(email, pwd) != "")
                {
                    Response.Redirect("Success.aspx", true);

                }
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}