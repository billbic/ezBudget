using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI.WebControls;

namespace ezBudget.budget
{
    public partial class _default : System.Web.UI.Page
    {
        [WebMethod]
        public static string SaveData(string id, string PayDate, string Inc, string Status, string Category, string Descr, string Amt)
        {
            string ret = "";
            SqlConnection conn = null;
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                using (SqlCommand sc = new SqlCommand("spLedgerUpd", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@PayDate",PayDate),
                        new SqlParameter("@Included",Inc),
                        new SqlParameter("@StatusId",Status),
                        new SqlParameter("@CategoryId",Category),
                        new SqlParameter("@LedgerDescription",Descr),
                        new SqlParameter("@Amount",Amt),
                        new SqlParameter("@id",id)
                        });
                    sc.ExecuteNonQuery();

                }
            }
            catch (Exception ex)
            {
                ret = ex.Message;
                throw;
            }
            return ret;
        }
        
        [WebMethod]
        public static string SetReconciled(string userId)
        {
            string ret = "";
            SqlConnection conn = null;
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                using (SqlCommand sc = new SqlCommand("spSetReconciled", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@UserId",userId)
                        });
                    sc.ExecuteNonQuery();

                }
            }
            catch (Exception ex)
            {
                ret = ex.Message;
                throw;
            }
            return ret;
        }

        [WebMethod]
        public static string NoteDelete(string id)
        {
            string ret = "";
            SqlConnection conn = null;
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                using (SqlCommand sc = new SqlCommand("spNote_Del", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@id",id)
                        });
                    sc.ExecuteNonQuery();

                }
            }
            catch (Exception ex)
            {
                ret = ex.Message;
                throw;
            }
            return ret;
        }

        [WebMethod]
        public static string NoteUpdate(string id, string NoteText)
        {
            string ret = "";
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                using (SqlConnection conn = new SqlConnection(conStr))
                {
                    conn.Open();
                    using (SqlCommand sc = new SqlCommand("spNote_Upd", conn))
                    {
                        sc.CommandType = CommandType.StoredProcedure;

                        sc.Parameters.AddRange(new[] {
                            new SqlParameter("@id",id),
                            new SqlParameter(){
                                ParameterName= "@NoteText",
                                 SqlDbType = SqlDbType.Text, 
                                 Direction = ParameterDirection.Input,
                                 Value = ezEncrypt.XOR.encrypt(NoteText,"RockAByeBaby!")
                            }
                        });
                        sc.ExecuteNonQuery();

                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            return ret;
        }

        [WebMethod]
        public static string InsertData(string userId, string PayDate, string Inc, string Status, string Category, string Descr, string Amt)
        {
            string ret = "";
            SqlConnection conn = null;
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                using (SqlCommand sc = new SqlCommand("spLedger_Ins", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@UserId",userId),
                        new SqlParameter("@PayDate",PayDate),
                        new SqlParameter("@Included",Inc),
                        new SqlParameter("@StatusId",Status),
                        new SqlParameter("@CategoryId",Category),
                        new SqlParameter("@LedgerDescription",Descr),
                        new SqlParameter("@Amount",Amt)
                        });
                    ret = sc.ExecuteScalar().ToString();
                }
            }
            catch (Exception ex)
            {
                ret = ex.Message;
                throw;
            }
            return ret;
        }

        [WebMethod]
        public static string CreateTab(string userId, string NoteTitle)
        {
            string ret = "";
            SqlConnection conn = null;
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                using (SqlCommand sc = new SqlCommand("spNote_Ins", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@UserId",userId),
                        new SqlParameter("@NoteTitle",NoteTitle)
                        });
                    ret = sc.ExecuteScalar().ToString();
                }
            }
            catch (Exception ex)
            {
                ret = ex.Message;
            }
            return ret;
        }

        [WebMethod]
        public static string DeleteData(string Id)
        {
            string ret = "";
            SqlConnection conn = null;
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                using (SqlCommand sc = new SqlCommand("spLedger_Del", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@Id",Id)
                        });
                    sc.ExecuteNonQuery();

                }
            }
            catch (Exception ex)
            {
                ret = ex.Message;
                throw;
            }
            return ret;
        }

        [WebMethod]
        public static Decimal GetPrevTotal(string userId, DateTime dt)
        {
            Decimal ret = 0;
            DataSet ds = null;
            try
            {
                ds = GetDataSet("spLedgerPrevBalance", new[] {
                        new SqlParameter("@UserId",userId),
                        new SqlParameter("@TodaysDate",dt.ToString("yyyy-MM-dd"))});


                if (ds.Tables.Count > 0)
                {
                    ret = Decimal.Parse(ds.Tables[0].Rows[0]["Amount"].ToString());
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ret;
        }

        /// <summary>
        /// gets Text Value for the selected item in the select list
        /// </summary>
        /// <param name="ds"></param>
        /// <param name="key"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public static String GetTextFromDS(DataSet ds, string key, string fieldName)
        {
            String ret = "";
            try
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    if(dr["id"].ToString() == key)
                    {
                        ret = dr[fieldName].ToString();
                        break;
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
            return ret;
        }

        [WebMethod]
        public static string CopyMonth(string Id, string OriginalDate, string TargetDate)
        {
            string html = "";
            SqlConnection conn = null;
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                using (SqlCommand sc = new SqlCommand("spLedger_CopyMonth", conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    sc.Parameters.AddRange(new[] {
                        new SqlParameter("@UserId",Id)
                        ,new SqlParameter("@OriginalDate",OriginalDate)
                        ,new SqlParameter("@TargetDate",TargetDate)
                        });
                    sc.ExecuteNonQuery();

                }
            }
            catch (Exception ex)
            {

                html = ex.Message;
            }
            return html;
        }

        [WebMethod]
        public static string LoadBudget(string userId, string dt, string months, bool hideRecon, string catId)
        {
            string html = "test";
            StringBuilder sb = new StringBuilder();
            DataSet ds = null;
            try
            {

                DateTime date = DateTime.Parse(dt);

                //Getting first day of the month
                DateTime dtPrev = new DateTime(date.Year, date.Month, 1);
                Decimal prevAmt = GetPrevTotal(userId, dtPrev);

                ds = GetDataSet("spLedger_Get", new[] {
                        new SqlParameter("@UserId",userId),
                        new SqlParameter("@Month",date.Month.ToString()),
                        new SqlParameter("@Year", date.Year.ToString()),
                        new SqlParameter("@MonthRange", months) });

                String dtPayDate = "";
                String amt = "";
                Decimal amtSum = prevAmt;
               // sb.Append("<div class='BalanceForward'>Balance Forward: " + prevAmt.ToString() + "</div>");

                sb.Append("<div class='row offset-3 no-gutters' style='margin-bottom:3px'>" +
                    "<div class='col-1 gridHeaderNoFormat WCommand'></div>" +
                    "<div class='col-1 gridHeaderNoFormat WDate'></div>" +
                    "<div class='col-xs-1 gridHeaderNoFormat WInclude' style='width:20px'></div>" +
                    "<div class='col-2 gridHeaderNoFormat WStatus'></div>" +
                    "<div class='col-2 gridHeaderNoFormat WCategory'></div>" +
                    "<div class='col-1 gridHeaderNoFormat WDescription'></div>" +
                    "<div class='col-3 gridHeaderNoFormat WAmount'>Balance Forward: " + prevAmt.ToString() + "</div>" +
                    "<div class='col-xs-1 gridHeaderNoFormat'></div> " +
                    "</div>");



                sb.Append("<div class='row offset-3 no-gutters' style='margin-bottom:3px'>" +
                    "<div class='col-1 gridHeader WCommand'></div>" +
                    "<div class='col-1 gridHeader WDate'>Date</div>" +
                    "<div class='col-xs-1 gridHeader WInclude'>Inc</div>" +
                    "<div class='col-2 gridHeader WStatus'>Status</div>" +
                    "<div class='col-2 gridHeader WCategory'>Category</div>" +
                    "<div class='col-3 gridHeader WDescription'>Description</div>" +
                    "<div class='col-1 gridHeader WAmount'>Amount</div> " +
                     "<div class='col-xs-1'></div> " +
                   "</div>");
                string StatusSelect = "";
                string CategorySelect = "";
                string Options = "";

                DataSet dsCategory = GetDataSet("spCategory_Get", new[] {
                        new SqlParameter("@UserId",userId)});

                DataSet dsStatus = GetDataSet("spStatus_Get");
                string clr = "black";
                string evt = "";
                string display = "";
                bool displayData = false;
                string Args = "";


                String StatusText = "";
                String CategoryText = "";

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    StatusText = GetTextFromDS(dsStatus, dr["StatusId"].ToString(), "name");
                    CategoryText = GetTextFromDS(dsCategory, dr["CategoryId"].ToString(), "name");
                    if (catId == dr["CategoryId"].ToString() || catId == "")
                    {
                        displayData = true;
                        Args = "class='ComboControl' " +
                            "style='" + "color: " + clr + ";'";
                       
                        Options = GetStatusOptions(dsStatus, dr["StatusId"].ToString());
                        evt = "oninput='ChangeTextInRow(this)'";
                        StatusSelect = BuildSelect(StatusText, "Status", dr["id"].ToString(), Args, Options,  evt);

                        Options = GetCategoryOptions(dsCategory, userId, dr["CategoryId"].ToString());
                        CategorySelect = BuildSelect(CategoryText, "Category", dr["id"].ToString(), Args, Options);

                        amt = dr["Amount"].ToString();

                        //evaluate paydate, if its the start of a new section, then add subtotal to the bottom of prev section
                        if (!(dtPayDate == DateTime.Parse(dr["PayDate"].ToString()).ToString("MM/dd/yyyy") || dtPayDate == ""))
                        {
                            //Add this to bottom of last section
                            sb.Append("<div style='display:none' id='InsertBar-" + DateTime.Parse(dtPayDate).ToString("Mdyyyy") + "' ></div>");

                            sb.Append("<div class='row offset-3 no-gutters' style='margin-bottom:3px'>" +
                           "<div class='col-1 gridHeaderNoFormat WCommand'></div>" +
                           "<div class='col-1 gridHeaderNoFormat WDate'></div>" +
                           "<div class='col-xs-1 gridHeaderNoFormat WInclude' style='width:20px'></div>" +
                           "<div class='col-2 gridHeaderNoFormat WStatus'></div>" +
                           "<div class='col-2 gridHeaderNoFormat WCategory'></div>" +
                           "<div class='col-3 gridHeaderNoFormat WDescription'></div>" +
                           "<div class='col-1 gridHeaderNoFormat WAmount sTotal' id='SubTotal-" + DateTime.Parse(dtPayDate).ToString("Mdyyyy") + "' >" + amtSum.ToString() + "</div>" +
                           "<div class='col-xs-1 gridHeaderNoFormat'></div> " +
                          "</div>");


                        }
                        amtSum += Decimal.Parse(amt);

                        dtPayDate = DateTime.Parse(dr["PayDate"].ToString()).ToString("MM/dd/yyyy");
                        //dbcalc allows me to iterate (identify each row), when doing a calculate or save all
                        if (hideRecon && (dr["StatusId"].ToString() == "4" || dr["StatusId"].ToString() == "2"))
                        {
                            display = "opacity:.55";
                        }
                        else
                        {
                            display = "";
                        }

                        sb.Append("<div dt='" + dtPayDate + "' id='Row-" + dr["id"].ToString() + "' class='row no-gutters offset-3' dbcalc='true' >");
                        sb.Append("<div class='col-1 RowCommand'>" +
                            "<input id='Cmd-" + dr["id"].ToString() + "'" +
                            "onclick='SaveOrDelete(" + dr["id"].ToString() + ")' " +
                            "class='ButtonCommand' " +
                            "onkeypress='ButtonCommand_onkeypress(this, event)' " +
                            "onmouseover='ButtonCommand_onmouseover(this,event)' " +
                            "onmouseout='ButtonCommand_onmouseout(this,event)'  " +
                            "title='Shift-Del, Ctrl-Save All' type='button' value='Save' /></div>");

                        sb.Append("<div style='" + display + "' class='col-1 gridContent RowDate'><input onclick=\"BudgetDate_onclick(this);\" oninput=\"HighlightRow(" + dr["id"].ToString() + ", 'red')\"' id='Date-" + dr["id"].ToString() + "' style ='" + "color:" + clr + ";width:100%;text-align:center' type='text' value='" + dtPayDate + "' /></div>");

                        if (clr == "silver")
                        {
                            sb.Append("<div style='" + display + "' class='col-xs-1 gridContent RowInclude'><input style='opacity:.55;' onclick=\"ToggleInclude(" + dr["id"].ToString() + ");\" id='Inc-" + dr["id"].ToString() + "' type='checkbox' checked /></div>");
                        }
                        else
                        {
                            sb.Append("<div style='" + display + "' class='col-xs-1 gridContent RowInclude'><input onclick=\"ToggleInclude(" + dr["id"].ToString() + ");\" id='Inc-" + dr["id"].ToString() + "' type='checkbox' checked /></div>");
                        }
                        sb.Append("<div style='" + display + "' class='col-2 gridContent RowStatus'>" + StatusSelect + "</div>");

                        sb.Append("<div style='" + display + "' class='col-2 gridContent RowCategory'>" + CategorySelect + "</div>");

                        sb.Append("<div style='" + display + "' class='col-3 gridContent RowDescription'>" +
                            "<input descr='true' style='" + "height:23px;color:" + clr + "' " + 
                            "onblur=\"Description_onblur(" + dr["id"].ToString() + ")\" " + 
                            "onfocus=\"Description_onfocus(" + dr["id"].ToString() + ")\" " + 
                            "oninput=\"Description_oninput(" + dr["id"].ToString() + ", 'red')\" " + 
                            "id='Descr-" + dr["id"].ToString() + "' " + 
                            "class='ExpandableInput' type='text' value='" + dr["LedgerDescription"].ToString() + "' /></div>");
                        
                        sb.Append("<div style='" + display + "' class='col-1 gridContent RowAmount'>" + 
                            "<input " +
                           "original='" + amt + "' " +
                           "onblur=\"Amt_onblur(" + dr["id"].ToString() + ");\" " +
                            "onfocus=\"Amt_onfocus(" + dr["id"].ToString() + ");\" " +
                            "oninput=\"Amt_oninput(" + dr["id"].ToString() + ", 'red')\"" + " id='Amt-" + dr["id"].ToString() + "' " +
                            "style='" + "color:" + clr + ";' type='text' class='AmountItem'  value='" + amt + "' />" + 
                            "</div>");

                        sb.Append("<div class='col-xs-1' style='text-align:left!important;padding-left:3px'>" +
                           "<button " +
                           "class='CancelButton' " +
                           "title='Revert to Saved' " + 
                           "value=' ' " +
                           "id='cancelThis" + dr["id"].ToString() + "' " + 
                           "onclick='cancelThis_onclick(" + dr["id"].ToString() + ")' " +
                           "onmouseout='cancelThis_onmouseout(" + dr["id"].ToString() + ")'> " +
                           "</button ></div>");

                        if (dr["StatusId"].ToString() == "6")
                        {
                            sb.Append("<div class='col-xs-1' style='text-align:left!important;padding-left:3px'><img id='Flag" +
                                dr["id"].ToString() + "' title='Flagged Expense' alt='Flagged' src='../images/SmallRedFlag.png'></div>");
                        }
                        else
                        {
                            //This is the Cancel Button

                            sb.Append("<div class='col-xs-1' style='text-align:left!important;padding-left:3px'><img style='display:none' id='Flag" +
                                dr["id"].ToString() + "' title='Flagged Expense' alt='Flagged' src='../images/SmallRedFlag.png'></div>");
                        }
                        sb.Append(" </div>");
                    }
                }

                //This is here because when selecting only a category, we do not want the grid to show.
                if (displayData)
                {
                    //This will add to the very end
                    sb.Append("<div style='display:none' id='InsertBar-" + DateTime.Parse(dtPayDate).ToString("Mdyyyy") + "' ></div>");
                    sb.Append("<div class='row offset-3 no-gutters' style='margin-bottom:3px'>" +
                   "<div class='col-1 gridHeaderNoFormat WCommand'></div>" +
                   "<div class='col-1 gridHeaderNoFormat WDate'></div>" +
                   "<div class='col-xs-1 gridHeaderNoFormat WInclude' style='width:20px'></div>" +
                   "<div class='col-2 gridHeaderNoFormat WStatus'></div>" +
                   "<div class='col-2 gridHeaderNoFormat WCategory'></div>" +
                   "<div class='col-3 gridHeaderNoFormat WDescription'></div>" +
                   "<div class='col-1 gridHeaderNoFormat WAmount sTotal' id='SubTotal-" + DateTime.Parse(dtPayDate).ToString("Mdyyyy") + "' >" + amtSum.ToString() + "</div>" +
                   "<div class='col-xs-1 gridHeaderNoFormat'></div> " +
                  "</div>");
                    html = sb.ToString();
                }
                else
                {
                    html = "";
                }
            }
            catch (Exception ex)
            {
                html = ex.Message;
            }
            return html;
        }

        [WebMethod]
        public static bool RenewAuthentication(string authId)
        {
            FormsAuthentication.SetAuthCookie(authId, true);
            return true;
        }

        [WebMethod]
        public static string FilterBudget(string userId, string year, string month, string statusid, string categoryid)
        {
            string html = "";
            StringBuilder sb = new StringBuilder();
            DataSet ds = null;
            try
            {

                ds = GetDataSet("spLedger_Filter", new[] {
                        new SqlParameter("@UserId",userId),
                        new SqlParameter("@Month",month),
                        new SqlParameter("@Year", year),
                        new SqlParameter("@StatusId", statusid),
                        new SqlParameter("@CategoryId", categoryid),
                        new SqlParameter("@MonthRange", 36) });

                String dtPayDate = "";
                String amt = "";

                DataSet dsCategory = GetDataSet("spCategory_Get", new[] {
                        new SqlParameter("@UserId",userId)});

                DataSet dsStatus = GetDataSet("spStatus_Get");

                string bgColor = "transparent";

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                   amt = dr["Amount"].ToString();

                    dtPayDate = DateTime.Parse(dr["PayDate"].ToString()).ToString("MM/dd/yyyy");

                    //dbcalc allows me to iterate (identify each row), when doing a calculate or save all
                    sb.Append("<div dt='" + dtPayDate + "' id='Row-" + dr["id"].ToString() + "' class='row rowCustom' dbcalc='true' style='white-space:nowrap;" + "background-color:" + bgColor + "'>");
                    sb.Append("<div class='col-1 gridContent RowDate'>" + dtPayDate + "</div>");
                    sb.Append("<div class='col-1 gridContent RowInclude'>√</div>");
                    sb.Append("<div class='col-2 gridContent RowStatus'>" + dr["Category"] + "</div>");
                    sb.Append("<div class='col-2 gridContent RowCategory'>" + dr["Status"] + "</div>");
                    sb.Append("<div class='col-5 gridContent RowDescription word_wrap'>" + dr["LedgerDescription"].ToString() + "</div>");
                    sb.Append("<div class='col-1 gridContent RowAmount' style='text-align:right'>" + amt + "</div>");

                    sb.Append(" </div>");
                    if(bgColor == "transparent")
                    {
                        bgColor = "silver";
                    }
                    else
                    {
                        bgColor = "transparent";
                    }
                }

                html = sb.ToString();
            }
            catch (Exception ex)
            {
                html = ex.Message;
            }
            return html;
        }
        
        [WebMethod]
        public static string GetStatusOptionsMethod(string selectedID)
        {

            string opt = "<option>";
            try
            {
                DataSet ds = GetDataSet("spStatus_Get");
                if (ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        if (selectedID == dr["id"].ToString())
                        {
                            opt += "<option selected value='" + dr["id"] + "'>" + dr["name"] + "</option>";
                        }
                        else
                        {
                            opt += "<option value='" + dr["id"] + "'>" + dr["name"] + "</option>";
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return opt;
        }

        [WebMethod]
        public static bool GetIdentityName()
        {

            bool isActiveSession = false;
            try
            {
                
                if(HttpContext.Current.Session.SessionID == "")
                {
                    throw new Exception("Session Expired");
                }
                else
                {
                    isActiveSession = true;
                }
            }
            catch (Exception)
            {
                throw;
            }
            return isActiveSession;
        }

        [WebMethod]
        public static string GetCategoryOptionsMethod(string userId, string selectedID)
        {

            string opt = "<option>";
            try
            {
                DataSet ds = GetDataSet("spCategory_Get", new[] {
                        new SqlParameter("@UserId",userId)});

                if (ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        if (selectedID == dr["id"].ToString())
                        {
                            opt += "<option selected value='" + dr["id"] + "'>" + dr["name"] + "</option>";
                        }
                        else
                        {
                            opt += "<option value='" + dr["id"] + "'>" + dr["name"] + "</option>";
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return opt;
        }

        private void DisableClientCaching()
        {
            // Do any of these result in META tags e.g. <META HTTP-EQUIV="Expire" CONTENT="-1">
            // HTTP Headers or both?

            // Stop Caching in IE
            Response.Cache.SetCacheability(System.Web.HttpCacheability.NoCache);

            // Is this required for FireFox? Would be good to do this without magic strings.
            // Won't it overwrite the previous setting
            Response.Headers.Add("Cache-Control", "no-cache, no-store");

            // Why is it necessary to explicitly call SetExpires. Presume it is still better than calling
            // Response.Headers.Add( directly
            Response.Cache.SetExpires(DateTime.UtcNow.AddYears(-1));

            // Stop Caching in Firefox
            Response.Cache.SetNoStore();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                DisableClientCaching();

                if (!IsPostBack)
                {
                    string userId = User.Identity.Name;
                    string dtSelected = selectedDate.InnerText;

                    DataSet dsStatus = GetDataSet("spStatus_Get");
                    DataSet dsCategory = GetDataSet("spCategory_Get", new[] {
                        new SqlParameter("@UserId",userId)});

                    for (int i = DateTime.Now.Year; i >= 2018; i--)
                    {
                        ReportYear.Items.Add(i.ToString());
                    }

                    selFilterCategory.Items.AddRange(BuildFilter(userId, "Status", "SelFilterCategory", "width:100%;height:23px;", "", "white", ""));

                    LoadNotes(userId);

                    if(dsStatus.Tables.Count > 0)
                    {
                        foreach (DataRow dr in dsStatus.Tables[0].Rows)
                        {
                            newStatus.Items.Add(new ListItem(dr["Name"].ToString(), dr["id"].ToString()));
                        }
                    }

                    ReportCategory.Items.Clear();
                    ReportCategory.Items.Add(new ListItem("All", "0"));

                    if(dsCategory.Tables.Count > 0)
                    {
                        foreach (DataRow dr in dsCategory.Tables[0].Rows)
                        {
                            newCategory.Items.Add(new ListItem(dr["Name"].ToString(), dr["id"].ToString()));
                            ReportCategory.Items.Add(new ListItem(dr["Name"].ToString(), dr["id"].ToString()));
                        }
                    }
                    authId.Value = Session["authId"].ToString();

                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        public static DataSet GetDataSet(string sp, SqlParameter[] parameters = null)
        {
            DataSet ds = null;
            SqlConnection conn = null;
            try
            {
                string conStr = ConfigurationManager.ConnectionStrings["dataConn"].ToString();
                conn = new SqlConnection(conStr);
                conn.Open();
                ds = new DataSet();
                using (SqlCommand sc = new SqlCommand(sp, conn))
                {
                    sc.CommandType = CommandType.StoredProcedure;

                    if (parameters != null)
                    {
                        sc.Parameters.AddRange(parameters);
                    }
                            
                    using (var sda = new SqlDataAdapter(sc))
                    {
                        sda.Fill(ds);
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally {
                conn.Dispose();
            }
            return ds;
        }

        public static string GetStatusOptions(DataSet ds, string selectedID)
        {
            string opt = "<option>";
            try
            {
                if (ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        if (selectedID == dr["id"].ToString())
                        {
                            opt += "<option selected value='" + dr["id"] + "'>" + dr["name"] + "</option>";
                        }
                        else
                        {
                            opt += "<option value='" + dr["id"] + "'>" + dr["name"] + "</option>";
                        }
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
            return opt;
        }

        private static string GetCategoryOptions(DataSet ds, string userId, string selectedID)
        {
            string opt = "<option>";
            try
            {
                if (ds.Tables.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        if (selectedID == dr["id"].ToString())
                        {
                            opt += "<option selected value='" + dr["id"] + "'>" + dr["name"] + "</option>";
                        }
                        else
                        {
                            opt += "<option value='" + dr["id"] + "'>" + dr["name"] + "</option>";
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return opt;
        }

        private static ListItem[]  BuildFilter(string userId,string prefix, string id, string style, string options, string clr, string eventCode = "")
        {
            List<ListItem> lst = new List<ListItem>();
            try
            {
                DataSet dsCategory = GetDataSet("spCategory_Get", new[] {
                        new SqlParameter("@UserId",userId)});
                if(dsCategory.Tables.Count > 0)
                {
                    if(dsCategory.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in dsCategory.Tables[0].Rows)
                        {
                lst.Add(new ListItem() { Text = dr["name"].ToString(), Value= dr["id"].ToString() });

                        }
                    }
                }
               // items.Add("<select oninput=\"select_oninput(this)\" " + eventCode + " style='" + style + "color:" + clr + "' oninput=\"HighlightRow(" + id + ", 'red')\"' id='" + prefix + "-" + id + "' " + style + " >" + options + "</select>");
            }
            catch (Exception)
            {
                throw;
            }
            return lst.ToArray();
        }
        private static string BuildSelect(string ToolTip, string prefix, string id, string Args, string options, string eventCode = "")
        {
            string html = "";
            try
            {
                html = "<select title=\"" + ToolTip + "\"" + " oninput =\"select_oninput(this)\" " + eventCode + " " + Args + " oninput=\"HighlightRow(" + id + ", 'red')\" id='" + prefix + "-" + id + "' " + Args + " >" + options + "</select>";
            }
            catch (Exception)
            {
                throw;
            }
            return html;
        }

        protected void LoadNotes(string UserId)
        {
            StringBuilder sbNote = new StringBuilder();
            StringBuilder sbTitle = new StringBuilder();
            DataSet ds = null;
            try
            {
                ds = GetDataSet("spNote_Get", new[] {
                        new SqlParameter("@UserId",UserId)});

                string activeTab = "active";
                sbTitle.Append("<div id='tabMaster' class='tab'>");
                string checkThis = "CheckThis";

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    sbTitle.Append("<button id='Note-" + dr["id"].ToString()  + "' class='tablinks " + checkThis + " " + activeTab + "' onclick='openTab(event, \"NoteTab-" + dr["id"].ToString() + "\");return false;'>" + dr["NoteTitle"].ToString() + "</button>");
                    sbNote.Append("<div  id='NoteTab-" + dr["id"].ToString() + "' class='tabcontent'>" +
                        "<div style='display:inline-block' id='imgSaveDiv-" + dr["id"].ToString()  + "'  title ='Click To Save' class='SaveDiv' onclick='SaveDiv(" + dr["id"].ToString() + ")'></div>" +
                        "<div style='display:inline-block' id='imgDeleteDiv-" + dr["id"].ToString()  + "'  title ='Click To Delete' class='DeleteDiv' onclick='DeleteDiv(" + dr["id"].ToString() + ")'></div>" +
                        "<div class='NoteTextStyle'><textarea oninput='NoteText_oninput(" + dr["id"].ToString() + ")'  id='NoteText-" + dr["id"].ToString() + "' class='NoteTextStyle'>" + 
                        Server.UrlDecode(ezEncrypt.XOR.decrypt(dr["NoteText"].ToString(), "RockAByeBaby!")) + "</textarea></div></div>");
                    
                    //Once this has been used, set it to blank, that way when this runs through the second time, it will not set another tab active.
                    activeTab = "";
                    checkThis = "";
                }


                sbTitle.Append("<div id='tabTitleBottom'></div>");
                sbTitle.Append("<button  id='NoteNew' class='tablinks' onclick='NoteNew_onclick();return false;'>* New Note *</button>");
                sbTitle.Append("</div>");

                liTabs.InnerHtml = sbTitle.ToString() +  sbNote.ToString();
            }
            catch (Exception)
            {
                throw;
            }        
        }
    }
}
