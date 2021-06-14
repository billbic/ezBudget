<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="ezBudget.budget._default" %>

<!DOCTYPE html>
<html>
<head>
    <title>ezBudget</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="CACHE-CONTROL" content="NO-CACHE" />
    <meta http-equiv="PRAGMA" content="NO-CACHE" />
    <meta http-equiv="EXPIRES" content="0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <link href="../jquery/theme/jquery-ui.min.css" rel="stylesheet" />
    <script src="../Scripts/jquery-3.0.0.js"></script>
    <script src="../jquery/theme/jquery-ui.js"></script>
    <script src="../Scripts/bootstrap.js"></script>
    <script src="../script/budget-default.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <link href="../Content/bootstrap.css" rel="stylesheet" />
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/3.1.0/css/font-awesome.min.css" />
    <link href="../CSS/budget-default.css" rel="stylesheet" />

    <script>
        //Setting Client Side Variables, from Server
        var dtCurrentDateId = "<%=dtCurrentDate.ClientID%>";
        var userId = "<%=User.Identity.Name%>";
        var DatePickedId = "<%=DatePicked.ClientID%>";
    </script>
</head>
<body id="frmMain" >
    <form runat="server" id="frm" onsubmit="return false" >
        <input type="text" style="display:none" id="authId" runat="server" />

        <audio id="pop" preload="auto">
            <source src="../sound/beep.mp3" type="audio/mpeg">
        </audio>
        <div id="timerContainer" class="timeoutRelative">
            <div title="Time in seconds before Log Out, Click to Reset" class="timeout" onclick="timeoutText_onclick()" id="timeoutText">0</div>
            <!-- <div onclick="RebuildTimer()" title="Time in seconds before Log Out, Click to Reset" class="timeout" id="timeoutText">600</div> -->
        </div>
        <div class="page">
            <div style="display: flex">
                <div class="h1">ezBudget</div>
            </div>

            <!-- tabs -->
            <!-- max-width:1200px; -->
            <div id="mainDiv" style="border:10px solid white;padding:15px;border-radius:5px;box-shadow:7px 7px 20px black" class="pcss3t pcss3t-effect-scale pcss3t-theme-1 noselect">
                <input type="radio" name="pcss3t" checked id="tab1" class="tab-content-first">
                <label for="tab1"><i class="icon-pencil"></i>Budget</label>

                <input type="radio" name="pcss3t" id="tab2" class="tab-content-2">
                <label for="tab2"><i class="icon-comment"></i>Notes</label>

                <input type="radio" name="pcss3t" id="tab3" class="tab-content-3">
                <label for="tab3"><i class="icon-cogs"></i>Analysis</label>

                <input type="radio" name="pcss3t" id="tab5" class="tab-content-last">
                <label for="tab5"><i class="icon-file"></i>Reports</label>

                <input type="radio" name="pcss3t" id="tab6" class="tab-content-last"/>
                <label title="Log Out" class="LogOut" onclick="window.location='../'" for="tab6"><i class="icon-file"></i>Log Out</label>
                <ul style="width: 100%;">
                    <!--Ledger -->
                    <li id="li_LeftBar" class="tab-content-first ">
                        <div id="LeftBar">
                            <div style="text-align: left">
                                <input type="button" onclick="btnRefresh_onclick();" class="button-Dialog-Save" id="btnRefresh" value="Reload Budget" />
                                <input type="button" onclick="btnToday_onclick();" class="button-Dialog-Today" id="btnToday" value="Today" />
                                <input type="button" onclick="btnFirst_onclick();" class="button-Dialog-First" id="btnFirst" value="1st" />
                            </div>

                            <!-- Calendar -->
                            <div class="OptionContainer">
                                <div id="Inner-Content-2-Dialog-Calendar-Title" onclick="ToggleDiv('Inner-Content-2-Dialog-Calendar');" class="DialogTitle"><i class="icon-calendar" style="text-shadow: none;"></i>&nbsp;Calendar<span id="dtDisplay"></span></div>
                                <div id="Inner-Content-2-Dialog-Calendar" class="InnerContainer-Dialog">
                                    <div runat="server" id="selectedDate"></div>
                                    <asp:TextBox Style="display: none" runat="server" ID="DatePicked"></asp:TextBox>
                                    <asp:TextBox runat="server" ID="dtCurrentDate" Style="display: none"></asp:TextBox>
                                </div>
                            </div>

                            <!-- New Entries -->
                            <div class="OptionContainer">
                                <div onclick="ToggleDiv('Inner-Content-2-Dialog-Entries');" class="DialogTitle"><i class="icon-plus-sign" style="text-shadow: none;"></i>&nbsp;New Entries</div>
                                <div id="Inner-Content-2-Dialog-Entries" class="InnerContainer-Dialog">
                                    <div class="DialogPlaceHolder">

                                        <!--This is where most of the javascript methods look at when deciding what date was selected -->
                                        <div style="display:none"><span class="lblSpan lblWidth">Date:</span><span class="lblSpan" id="newDate"></span></div>

                                        <div><span class="lblSpan lblWidth">Date:</span><input style="width: 90px" type="text" id="newEntryDate"/> 
                                            <!-- Alt-30 ▲-->
                                            <button style="font-size:10px;border-radius:4px" onclick="upDate()">▲</button>
                                            <!-- Alt-31 ▼ -->
                                            <button style="font-size:10px;border-radius:4px" onclick="downDate()">▼</button>

                                        </div>
                                        <div><span class="lblSpan lblWidth">Status:</span><select runat="server" style="width: 150px" id="newStatus"></select></div>
                                        <div><span class="lblSpan lblWidth">Category:</span><select runat="server" style="width: 150px" id="newCategory"></select></div>
                                        <div><span class="lblSpan lblWidth">Description:</span><input style="width: 146px" type="text" id="newDescr" /></div>
                                        <div><span class="lblSpan lblWidth">Amount:</span><input type="number" style="width: 100px;" class="MoneyInput" id="newAmt" /></div>
                                        <div id="btnNew" onclick="btnNew_onclick()" class="button-Dialog-Save">Save New Entry</div>

                                    </div>

                                </div>
                            </div>

                            <!-- Export -->
                            <div class="OptionContainer">
                                <div onclick="ToggleDiv('Inner-Content-2-Dialog-Export');" class="DialogTitle"><i class="icon-download" style="text-shadow: none;"></i>&nbsp;Export</div>
                                <div id="Inner-Content-2-Dialog-Export" class="InnerContainer-Dialog">
                                    Export to CSV here.
                                </div>
                            </div>

                            <!-- Profile -->
                            <div class="OptionContainer">
                                <div onclick="ToggleDiv('Inner-Content-2-Dialog-Profile');" class="DialogTitle"><i class="icon-user" style="text-shadow: none;"></i>&nbsp;Profile</div>
                                <div id="Inner-Content-2-Dialog-Profile" class="InnerContainer-Dialog">
                                    <div class="container">
                                    <div class="row">
                                        <div class="col-4">Username</div>
                                        <div class="col-8"><input readonly style="width:100%" type="text" id="userName" /></div>
                                    </div>
                                    <div class="row">
                                        <div class="col-4">Password</div>
                                        <div class="col-8"><input style="width:100%" type="text" id="pwd" /></div>
                                    </div>
                                    <div class="row">
                                        <div class="col-4"></div>
                                        <div class="col-2"><input type="button" value="Save" /></div>
                                    </div>
                                </div>
                                    </div>
                            </div>

                            <!-- Goal Seek -->
                            <div class="OptionContainer">
                                <div class="DialogTitle" onclick="ToggleDiv('Inner-Content-2-Dialog-GoalSeek');"><i class="icon-arrow-right" style="text-shadow: none;"></i>&nbsp;Goal Seek</div>
                                <div id="Inner-Content-2-Dialog-GoalSeek" class="InnerContainer-Dialog">
                                    <div class="GoalSeekLabel" style='display: inline-block'>Date:</div>
                                    <div id="GoalSeekDate" style="display: inline-block"></div>
                                    <br>
                                    <div class="GoalSeekLabel">Target Amount:</div>
                                    <div style="display: inline-block">$<div style="width: 92px; text-align: right; display: inline-block" id="GoalSeekInput"></div>
                                    </div>
                                    <br>
                                    <div class="GoalSeekLabel">Seek Balance:</div>
                                    <div style="display: inline-block">$<input type="text" id="GoalSeekBalance" style="width: 90px; text-align: right" value="" /></div>
                                    <br />
                                    <div class="GoalSeekLabel">Balance:</div>
                                    <div style="display: inline-block">$<div id="GoalBalance" style="width: 90px; text-align: right; display: inline-block"></div>
                                    </div>
                                    <br />
                                    <div onclick="SeekButton_onclick()" style="display: inline-block; width: 80px !important" class="button-Dialog-Save">Seek</div>
                                    <div style="display: none" id="SelectedID"></div>
                                    <div onclick="ApplyButton_onclick()" style="margin-left: 3px; display: inline-block; width: 50px !important" class="button-Dialog-Save">Apply</div>
                                </div>
                            </div>

                            <!-- Options -->
                            <div class="OptionContainer">
                                <div class="DialogTitle" onclick="ToggleDiv('Inner-Content-2-Dialog-Options');"><i class="icon-info-sign" style="text-shadow: none;"></i>&nbsp;Options</div>
                                <div id="Inner-Content-2-Dialog-Options" class="InnerContainer-Dialog">
                                    <fieldset class="optionFieldset">
                                        <legend class="optionLegend">Budget Operation & Display</legend>
                                        Load Grid for
                                        <input type="text" style="width: 26px; text-align: center" value="3" id="optionGridLoadMonths" />
                                        Month(s).<br />
                                        <br />

                                        <input class="chkOption" id="chkHideReconciled" type="checkbox" checked>
                                        De-emphasize Reconciled and<br />
                                        Pending Entries.<br>
                                        <br />

                                        <input class="chkOption" id="chkAllowConfirm" type="checkbox" checked>
                                        Enforce Delete Dialog<br />
                                        <br />

                                        <input class="chkOption" id="chkAllowBeep" type="checkbox">
                                        Allow Beep when Timer runs<br />
                                        out in upper right corner.<br>

                                        <div style="margin-top: 10px">
                                            <input id="btnSaveConfigCookie" onclick="btnSaveConfigCookie_onclick()" type="button" value="Save Options" />
                                        </div>
                                    </fieldset>

                                </div>
                            </div>

                            <!-- Tools -->
                            <div class="OptionContainer">
                                <div onclick="ToggleDiv('Inner-Content-2-Dialog-Tools');" class="DialogTitle"><i class="icon-wrench" style="text-shadow: none;"></i>&nbsp;Tools</div>
                                <div id="Inner-Content-2-Dialog-Tools" class="InnerContainer-Dialog">
                                    <div style="margin-top: 5px;">
                                        <div style="color: darkslategray; border-radius: 3px; padding: 5px; margin: 10px 0 5px 0">
                                            Discard all changes and set all status<br>
                                            pending entries to reconciled, this will<br>
                                            reload all data. <a style="font-style: italic" href="javascript:btnMakeReconciled_onclick()">Discard Now</a>
                                        </div>

                                    </div>
                                    <div style="margin-top: 5px;">
                                        <div style="color: darkslategray; border-radius: 3px; padding: 5px; margin: 10px 0 5px 0">
                                            Clone All Entries in:<br>
                                            <input style="width: 75px" id="txtOrigMonth" type="text" value="">
                                            to
                                            <input style="width: 75px" id="txtTargetMonth" type="text" value="02/01/2020">
                                            <a style="font-style: italic" href="javascript:btnCloneMonth_onclick()">Clone</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Budget -->
                        <div class="TabContent">
                            <div class="row no-gutters offset-3">
                            <div class="col-10" id="FilterBar">Category Filter:
                                <select oninput="selFilterCategory_oninput()" runat="server" id="selFilterCategory">
                                    <option value="">All</option>
                                </select> <a type="button"  id="btnFilterReset" href="#" onclick="javascript:btnFilterReset_onclick()" >Reset</a></div>

                            </div>
                            <div runat="server" id="grdBudget" onclick="grdBudget_onclick()" class="Grid"></div>
                        </div>
                    </li>

                    <!-- Notes -->
                    <li id="liTabs" runat="server" class="tab-content tab-content-2 typography"></li>

                    <!-- Budget Analysis -->
                    <%--                  <li class="tab-content-3 typography">
                        <h1>Budget Analysis</h1>
                        <p style="text-align: left;max-width:400px; width:333px;">
                           

                        The 60/40 rule is (60% debt, 40% savings) <br/>
                        The 80/20 rule is (80% debt, 20% savings)<br/><br/>

                        Monthly housing costs, which include mortgage payments, insurance, 
                                 taxes and condo or association fees, shouldn't exceed 28% of your monthly gross income.<br/><br/>

                        Monthly debt payments, including credit card bills and student loans, shouldn't exceed 36% of your gross income
                           
                        </p>

                    </li>--%>

                        <!-- Reports -->
                    <li class="tab-content-last typography">
                        <div class="typography">
                            <h1>Reports</h1>
                        </div>
                        <div class="ReportOptions">
                            <div class="row col-4 ReportSubHeader">Filtering Options:</div>
                            <div class="row">
                                <div class="col-2 ReportOption">Month</div>
                                <div class="col-2 ReportOption">Year</div>
                            </div>
                            <div class="row">
                                <div class="col-2">
                                    <select id="ReportMonth">
                                        <option value='0'>All</option>
                                        <option value='1'>Jan</option>
                                        <option value='2'>Feb</option>
                                        <option value='3'>Mar</option>
                                        <option value='4'>Apr</option>
                                        <option value='5'>May</option>
                                        <option value='6'>Jun</option>
                                        <option value='7'>Jul</option>
                                        <option value='8'>Aug</option>
                                        <option value='9'>Sep</option>
                                        <option value='10'>Oct</option>
                                        <option value='11'>Nov</option>
                                        <option value='12'>Dec</option>
                                    </select>
                                </div>
                                <div class="col-2">
                                    <select runat="server" id="ReportYear">
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-2 ReportOption">Status</div>
                                <div class="col-2 ReportOption">Category</div>
                            </div>
                            <div class="row">
                                <div class="col-2">
                                    <select id="ReportStatus">
                                        <option value='0'>All</option>
                                        <option value='1'>Budgeted</option>
                                        <option value='2'>Pending</option>
                                        <option value='3'>Returned</option>
                                        <option value='4'>Reconciled</option>
                                    </select>
                                </div>
                                <div class="col-2">
                                    <select runat="server" id="ReportCategory">
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-4 rptButton" title="View Report" id="btnReportFilter" onclick="btnReportFilter_onclick()">Click Here To Display</div>
                            </div>
                            <div style="padding: 30px;">
                                <div class="row" style="white-space: nowrap; margin-bottom: 5px;">
                                    <div class="col-1 reportHeader WDate">Date</div>
                                    <div class="col-1 reportHeader WInclude">Inc</div>
                                    <div class="col-2 reportHeader WStatus">Status</div>
                                    <div class="col-2 reportHeader WCategory">Category</div>
                                    <div class="col-5 reportHeader WDescription">Description</div>
                                    <div class="col-1 reportHeader WAmount">Amount</div>
                                </div>
                                <div id="FilterReportResults">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!--/ tabs -->
        </div>
    </form>
</body>
</html>
