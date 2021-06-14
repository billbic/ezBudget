<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="ezBudget.register._default1" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>ezBudget</title>
    <link href="../CSS/default.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Heebo&display=swap" rel="stylesheet"/>
    <script src="../Scripts/jquery-3.0.0.js"></script>
    <script src="../jquery/theme/jquery-ui.js"></script>
    <script>
        $(function () {
            $('#txtEmail').focus();
        });

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <div class="registerPage">
                <div class="inputElements">
                    <div class="row flex"><div class="inlineBlock label">Email Address:</div><div class="inlineBlock"><asp:TextBox required ID="txtEmail" runat="server" TextMode="Email"></asp:TextBox></div></div>
                    <div class="row flex"><div class="inlineBlock label">Password: </div><div class="inlineBlock"><asp:TextBox MaxLength="20" required runat="server" ID="txtPassword" TextMode="Password"></asp:TextBox></div></div>
                    <div class="row flex"><div class="inlineBlock label"></div><div class="inlineBlock"><asp:Button runat="server" ID="btnSave" Text="Register" OnClick="btnSave_Click" /></div></div>
                    <div class="row flex"><div class="inlineBlock info">
                        • An activation email will be sent to you.<br/><br/>
                        • The password needs to be 7 - 50 characters.</div></div>
                </div>
            </div>
            <div class="banner"><span class="green">ezBudget</span> <img src="../images/daisy.png" /> Register Here</div>
            <div class="register"><a class="link" href="../">Home</a> | <a class="link" href="../budget">Login</a> | <span class="ref">Brought to you by: <a class="link" href="http://LivingWordWebsites.com">LivingWordWebsites.com</a></span></div>
        </div>
    </form>
</body>
</html>
