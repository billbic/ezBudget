<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="ezBudget.register._default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>ezBudget</title>
    <link href="https://fonts.googleapis.com/css?family=Heebo&display=swap" rel="stylesheet"/>
    <link href="../jquery/theme/jquery-ui.min.css" rel="stylesheet" />
    <script src="../Scripts/jquery-3.0.0.js"></script>
    <script src="../jquery/theme/jquery-ui.js"></script>
    <script src="../Scripts/bootstrap.js"></script>
    <link href="../Content/bootstrap-grid.css" rel="stylesheet" />
     <link href="../CSS/default.css" rel="stylesheet" />
   <script>
        $(function () {
            $('#txtEmail').focus();
        });

    </script>
</head>
<body >
    <form id="form1" runat="server">
        <div class="container">
            <div class="loginPage">
                <div class="inputElements">
                    <div class="row flex"><div class="inlineBlock label">Email Address:</div><div class="inlineBlock"><asp:TextBox required ID="txtEmail" runat="server" TextMode="Email"></asp:TextBox></div></div>
                    <div class="row flex"><div class="inlineBlock label">Password: </div><div class="inlineBlock"><asp:TextBox MaxLength="20" required runat="server" ID="txtPassword" TextMode="Password"></asp:TextBox></div></div>
                    <div class="row flex"><div class="inlineBlock label"></div><div class="inlineBlock "><asp:Button runat="server" CssClass="ui-button" ID="btnLogin" Text="Login" OnClick="btnLogin_Click" /></div></div>
                        
                </div>
            </div>
            <div class="banner"><span class="green">ezBudget</span> <img src="../images/daisy.png" /> Login Here</div>
            <div class="register"><a class="link" href="../">Home</a> | <a class="link" href="../Register">Register</a> | <span class="ref">Brought to you by: <a class="link" href="http://LivingWordWebsites.com">LivingWordWebsites.com</a></span></div>
        </div>
    </form>
</body>
</html>