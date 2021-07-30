var _shiftKeyDown = false;
var _ctrlKeyDown = false;
var _mouseOver = false;
var _ctrlOver = null;
var _timeoutTmr;
var _timoutFontSize = 14;
var _optionCookieName = "ezBudget-Option";
var _SessionExpired = false;
var _WarningBeep = false;
var _divMenuOpen = "Inner-Content-2-Dialog-Calendar";
var _lastFocusAmountId = 0;
var _aryDescriptionStyles = {};
var _isHover = false;

//this value gets changed to your preference
var _timeoutIntervalIncr = 360;

//this one stays the same, gets used to reset timer
var _timeoutIntervalAmt = 360;

//DOM is Ready: Executes Page_Load()
$(function () {
    Page_Load();
});
//----------------------------------------------------
window.addEventListener('focus', function () {
    CheckExpire();
});
//----------------------------------------------------
window.addEventListener('blur', function () {
    CheckExpire();
});
//----------------------------------------------------
function Page_Load() {
    var dt;
    var formattedDate;
    var firstDate;
    var NextMonth;
    var FirstDayOfMonth;

    var cookieEval = getCookie(_optionCookieName);

    if (cookieEval == "") {
       btnSaveConfigCookie_onclick()
    }


    $('#li_LeftBar').on('scroll', function () {
        $('#LeftBar').css("top", $('#li_LeftBar').scrollTop() + 10);
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 16 || e.keyCode == 17) {
            _shiftKeyDown = false;
            _ctrlKeyDown = false;

            if (_ctrlOver != null) {
                _ctrlOver.value = 'Save';
                _ctrlOver.style.backgroundColor = null;
                _ctrlOver.style.color = 'black';
            }
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 16) {
            _shiftKeyDown = true;
        }
        if (e.keyCode == 17) {
            _ctrlKeyDown = true;
        }

        if (_ctrlOver != null) {
            if (_mouseOver && _shiftKeyDown) {
                $('#' + _ctrlOver.id).css("background-color", "red");
                _ctrlOver.value = 'Del';
                _ctrlOver.style.color = 'white';

            }
            if (_mouseOver && _ctrlKeyDown) {
                $('#' + _ctrlOver.id).css("background-color", "blue");
                _ctrlOver.value = 'Save All';
                _ctrlOver.style.color = 'white';

            }
        }
    });

    $("#selectedDate").datepicker({
        dateFormat: "mm/dd/yy",
        onSelect: function (dt) {

            //On Date Click
            $('#newDate').html(dt);

            $('#' + DatePickedId).val(dt)
            $('#' + dtCurrentDateId).val(dt);
            $('#dtDisplay').html(" - " + dt);

            formattedDate = $.datepicker.formatDate("mm/dd/yy", dt);

            //this is an asp.net control, part of viewstate, used in code behind
            $('#' + DatePickedId).val(formattedDate)

            $('#dtDisplay').html(formattedDate);
            $('#newDate').html(formattedDate);
        },
        onChangeMonthYear: function () {
            //On Month Change
        }
    });

    dt = $("#selectedDate").datepicker('getDate');
    formattedDate = $.datepicker.formatDate("mm/dd/yy", dt);
    firstDate = $.datepicker.formatDate("mm/01/yy", dt);
    FirstDayOfMonth = $.datepicker.formatDate("mm/dd/yy", FirstDay(dt));

    NextMonth = $.datepicker.formatDate("mm/dd/yy", FirstDay(AddMonth(dt)));

    $('#' + DatePickedId).val(formattedDate)
    $('#dtDisplay').html(" - " + formattedDate);
    $('#newDate').html(formattedDate);    //This selects the occurrance of the class: .CheckThis
    $('#newEntryDate').val(firstDate);

   $('#txtOrigMonth').val(FirstDayOfMonth);
    $('#txtTargetMonth').val(NextMonth);

    //Just so happens to be on the first tab of the first note
    $(".CheckThis")[0].click();

    var cookie = getCookie(_optionCookieName);
    var opt = JSON.parse(cookie);

    $('#optionGridLoadMonths').val(opt.GridMonth);
    if (opt.AutoSave == true) {
        $("#chkAutoSave").prop("checked", true);
    } else {
        $("#chkAutoSave").prop("checked", false);
    }
    if (opt.HideRecon != undefined) {
        if (opt.HideRecon == true) {
            $("#chkHideReconciled").prop("checked", true);
        } else {
            $("#chkHideReconciled").prop("checked", false);
        }
    } else {
        opt.HideRecon = false;
    }

    if (opt.AllowBeep != undefined) {
        if (opt.AllowBeep == true) {
            $("#chkAllowBeep").prop("checked", true);
        } else {
            $("#chkAllowBeep").prop("checked", false);
        }
    } else {
        opt.AllowBeep = false;
    }

    if (opt.AllowConfirm != undefined) {
        if (opt.AllowConfirm == true) {
            $("#chkAllowConfirm").prop("checked", true);
        } else {
            $("#chkAllowConfirm").prop("checked", false);
        }
    } else {
        opt.AllowConfirm = true;
    }

    //The LoadBudget() Ajax Method will also
    //start Initializing other Methods in the Success Event

    //Loading initial Data
    LoadBudget(opt.HideRecon);

    //Keep Alive, every minute make this call.
    setInterval(function () { RenewAuthentication(); }, 360000);

    //So we can see yellow dot in upper right 
    //corner, count down the alloted time
    StartTimeOut();
}
//----------------------------------------------------
function BuildStylesForDescriptionElement() {
    try {

        var str = "";
        $.each($('[descr]'), function (keys, value) {
            id = $(this)[0].id;
            str = id + '|' + $('#' + id).css;
        });
        
        _aryDescriptionStyles = str.split("***");
    } catch (e) {
        alert("BuildStylesForDescriptionElement: " + e.Message);
    }
}
//----------------------------------------------------
function AddMonth(dt) {
    try {
        return new Date(dt.setMonth(dt.getMonth() + 1));
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function FirstDay(dt) {
    try {
        return (new Date((dt.getMonth() + 1) + " / 1 / " + dt.getFullYear()))
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function btnCloneMonth_onclick() {
    try {
        var dtOrig = $('#txtOrigMonth').val();
        var dtTarget = $('#txtTargetMonth').val();

        var postData = "{"
            + "Id: '" + userId + "',"
            + "OriginalDate: '" + dtOrig + "',"
            + "TargetDate: '" + dtTarget + "'"
            + "}";

        //string userId, string dt, Decimal prevAmount
        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/CopyMonth",
            data: postData,
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $('#grdBudget').fadeOut(2000);
                LoadBudget($('#chkHideReconciled').prop('checked'));
            },
            failure: function (response) {
                alert(response.d);
            }
        });

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function BudgetDate_onclick(ctrl) {
    try {
        var txt = $('#' + ctrl.id).val();
        $('#txtOrigMonth').val(txt);
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function select_oninput(ctrl) {
    try {

        var txt = $("#" + ctrl.id).val();
        var TextValue = $("#" + ctrl.id + " option:selected").text();
        $("#" + ctrl.id).prop("title", TextValue);
        var val = txt * 1;

        var id;
        id = ctrl.id.replace("Status-", "");
        id = id.replace("Category-", "");

        var key = "#Flag" + id;

        HighlightRow(id, "red");

        if (val == 6) {
            $(key).show();
        } else {
            $(key).hide();
        }

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function btnMakeReconciled_onclick() {
    try {
        //SetReconciled
        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/SetReconciled",
            data: "{"
                + "userId: '" + userId + "'"
                + "}",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                btnRefresh_onclick();
                RebuildTimer();
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function CheckExpire() {
    try {
        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/GetIdentityName",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d == "") {
                    alert("GetIdentityName Missing");
                    clearTimeout(_timeoutTmr);
                    document.location = "../";
                }
            },
            error: function (response) {
                clearTimeout(_timeoutTmr);
                document.location = "../";
            }
        });

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function btnSaveConfigCookie_onclick() {
    try {
        delCookie(_optionCookieName);
        $('#btnSaveConfigCookie').fadeOut(2000);

        var opt = {
            GridMonth: $('#optionGridLoadMonths').val(),
            HideRecon: $('#chkHideReconciled').prop('checked'),
            AllowBeep: $('#chkAllowBeep').prop('checked'),
            AllowConfirm: $('#chkAllowConfirm').prop('checked')
        };

        LoadBudget($('#chkHideReconciled').prop('checked'));

        setCookie(_optionCookieName, JSON.stringify(opt), 3650);

    } catch (e) {
        $('#btnSaveConfigCookie').css("background-color", "red");
        $('#btnSaveConfigCookie').val("Error");
        alert(e.Message);
    }
    $('#btnSaveConfigCookie').fadeIn(2000);
}
//----------------------------------------------------
function delCookie(cname) {
    try {
        document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Lax";
}
//----------------------------------------------------
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//----------------------------------------------------
function timeoutText_onclick() {
    try {

        var $TT = $('#timeoutText');

        $TT.width(51);
        $TT.height(36);
        $TT.css("font-size", "14px");
        $TT.css("opacity", "1");
        $TT.css("backgroundColor", "yellow");
        $TT.css("color", "black");
        $('#timerContainer').css("padding-right", 58);
        _timoutFontSize = 14;
        _timeoutIntervalIncr = _timeoutIntervalAmt;

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function RenewAuthentication() {
    try {
        var id = authId.value;
        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/RenewAuthentication",
            data: "{"
                + "authId: '" + id + "'}",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
            },
            failure: function (response) {
                alert('err on ajax call');
                alert(response.d);
            }
        });
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function StartTimeOut() {
    _timeoutTmr = setInterval(function () {
        $('#timeoutText').html(_timeoutIntervalIncr.toFixed(0));

        if (_timeoutIntervalIncr.toFixed(0) == 30) {
            if ($('#chkAllowBeep').prop('checked') && !_WarningBeep) {
                $('audio#pop')[0].play();
                _WarningBeep = true;
            }
        } else {
            _WarningBeep = false;
        }

        if (_timeoutIntervalIncr <= 30) {
        var $TT = $('#timeoutText');
            $TT.css("font-size", _timoutFontSize + "px");
            $TT.css("opacity", ".8");
            $TT.css("backgroundColor", "red");
            $TT.css("color", "white");
            $TT.width(($TT.width() * 1) + .4);
            $TT.height(($TT.height() * 1) + .4);

            $('#timerContainer').css("padding-right", $TT.width() + 8);

            _timoutFontSize += .25;
        } 
        _timeoutIntervalIncr -= .01;
        if (_timeoutIntervalIncr <= 0) {
            clearTimeout(_timeoutTmr);
            document.location = "../";
        }
    }, 10);
}
//----------------------------------------------------
function btnReportFilter_onclick() {
    try {
        var PayDate = "";
        var year = $('#ReportYear option:selected').val();
        var optStatus = "";
        var optCategory = "";
        var Descr = "";
        var clr = "white";
        var Amt = 0;

        $('#FilterReportResults').fadeOut(2000);

        //string userId, string dt, Decimal prevAmount
        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/FilterBudget",
            data: "{"
                + "userId: '" + userId + "',"
                + "year: '" + year + "',"
                + "month: '" + $('#ReportMonth option:selected').val() + "',"
                + "statusid: '" + $('#ReportStatus option:selected').val() + "',"
                + "categoryid: '" + $('#ReportCategory option:selected').val() + "'"
                + "}",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $('#FilterReportResults').html(data.d);
                $('#FilterReportResults').fadeIn(2000);
                RebuildTimer();
            },
            failure: function (response) {
                alert(response.d);
            }
        });

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function upDate() {
    //This method will add 1 month to the newEntryDate ("new entry date" for new entries)
    try {
        var newDate = $('#newEntryDate').val();
        var m = parseInt(newDate.split("\/")[0]);
        var d = newDate.split("\/")[1];
        var y = parseInt(newDate.split("\/")[2]);

        var newM = 1;

        //When the date is the 12th month
        if (m < 12) {
            if (m < 9) {
                newM = "0" + (m + 1);
            } else {
                newM = m + 1;
            }
        } else {
           y = y + 1;
        }

        $('#newEntryDate').val(newM + "\/" + d + "\/" + y);
        $('#newDescr').focus();
        $('#newDescr').select();


    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function downDate() {
    //This method will add 1 month to the newEntryDate ("new entry date" for new entries)
    try {
        var newDate = $('#newEntryDate').val();
        var m = parseInt(newDate.split("\/")[0]);
        var d = newDate.split("\/")[1];
        var y = parseInt(newDate.split("\/")[2]);

        var newM = 12;

        //When the date is the 12th month
        if (m != 1) {
            if (m < 11) {
                newM = "0" + (m - 1);
            } else {
                newM = m - 1;
            }
        } else {
            y = y - 1;
        }

        $('#newEntryDate').val(newM + "\/" + d + "\/" + y);
        $('#newDescr').focus();
        $('#newDescr').select();


    } catch (e) {
        alert(e.Message);
    }
}//----------------------------------------------------
function ChangeTextInRow(ctrl) {
    try {
        var pk = 0;
        pk = ctrl.id.replace("Status-", "");
        $('#Cmd-' + pk).parent().animate({ backgroundColor: 'red' }, 1000);

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function btnNew_onclick() {
    try {
        var newDate = $('#newEntryDate').val();
        var newStatus = $('#newStatus option:selected').val();
        var newCategory = $('#newCategory option:selected').val();
        var newDescr = $('#newDescr').val();
        var newAmt = $('#newAmt').val();

        InsertData(true, newDate, 1, newStatus, newCategory, newDescr, newAmt);

        BuildStylesForDescriptionElement();
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function CopyMonth() {
    try {
        var newDate = $('#newDate').html();
        var newStatus = $('#newStatus option:selected').val();
        var newCategory = $('#newCategory option:selected').val();
        var newDescr = $('#newDescr').val();
        var newAmt = $('#newAmt').val();

        InsertData(true, newDate, 1, newStatus, newCategory, newDescr, newAmt);

    } catch (e) {

    }
}
//----------------------------------------------------
function btnToday_onclick() {
    try {
        const now = new Date();
        const today = pad(now.getMonth() + 1) + '/' + pad(now.getDate()) + '/' + now.getFullYear();       // dt1 = $.datepicker.formatDate("mm/dd/yy", TodaysDate());
        $('#selectedDate').datepicker('setDate', today);
        $('#dtDisplay').html(" - " + today);
        $('#' + DatePickedId).val(today);
        $('#newDate').html(today);
} catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function btnFirst_onclick() {
    try {
        const now = new Date();
        const today = pad(now.getMonth() + 1) + '/01/' + now.getFullYear();       // dt1 = $.datepicker.formatDate("mm/dd/yy", TodaysDate());
        $('#selectedDate').datepicker('setDate', today);
        $('#dtDisplay').html(" - " + today);
        $('#' + DatePickedId).val(today);
        $('#newDate').html(today);
        $('#newEntryDate').val(today);
 } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function pad(num) {
    return (num >= 10 ? '' : '0') + num;
}
//----------------------------------------------------
function btnRefresh_onclick() {
    try {
        $('#grdBudget').fadeOut(2000);

        LoadBudget($('#chkHideReconciled').prop('checked'));
        BuildStylesForDescriptionElement();
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function selFilterCategory_oninput() {
    try {
        btnRefresh_onclick();
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function LoadBudget(hideReconciledEntries) {
    try {
        var dt = $('#newDate').html();
        var gridMonths = $('#optionGridLoadMonths').val();

        var postData = "{"
            + "userId: '" + userId + "',"
            + "dt: '" + dt + "',"
            + "months: '" + gridMonths + "',"
            + "hideRecon: " + hideReconciledEntries + ","
            + "catId: '" + $('#selFilterCategory option:selected').val() + "'"
            + "}";

        //string userId, string dt, Decimal prevAmount
        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/LoadBudget",
            data: postData,
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $('#grdBudget').html(data.d);
                $('#grdBudget').fadeIn(2000);

                RebuildTimer();

                //This gets executed here because its asynchronos
                //you must wait until it reaches success.
                CalculateBudget();

                //Save Styles for Description Element
                BuildStylesForDescriptionElement();

            },
            failure: function (response) {
                alert(response.d);
            }
        });

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function NoteNew_onclick() {
    try {
        var NoteTitle = prompt("Type in the name of the new Notes Tab:");

        var id = "";
        if (NoteTitle != "" && NoteTitle != null) {
            $.ajax({
                type: "POST",
                url: "../budget/default.aspx/CreateTab",
                data: "{"
                    + "userId: '" + userId + "',"
                    + "NoteTitle: '" + NoteTitle + "'"
                    + "}",
                cache: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    id = data.d;
                    $('#tabTitleBottom').append("<button id='Note-" + id + "' class='tablinks' onclick='openTab(event, \"NoteTab-" + id + "\");return false;'>" + NoteTitle + "</button>")

                    $("<div id='NoteTab-" + id + "' class='tabcontent'>" +
                        "<div style='display:inline-block' id='imgSaveDiv-" + id + "' title='Click To Save' class='SaveDiv' onclick='SaveDiv(" + id + ")'></div>" +
                        "<div style='display:inline-block' id='imgDeleteDiv-" + id + "' title='Click To Save' class='DeleteDiv' onclick='DeleteDiv(" + id + ")'></div>" +
                        "<div class='NoteTextStyle'><textarea onchange='NoteText_onchange(" + id + ")' id='NoteText-" + id + "' class='NoteTextStyle'></textarea></div></div>").insertAfter('#tabMaster');

                },
                failure: function (response) {
                    alert(response.d);
                }
            });
        }
        return false;
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function NoteText_oninput(id) {
    try {
        var tabName = $('#Note-' + id).html();

        if (tabName.indexOf("*") == -1) {
            $('#Note-' + id).html("*" + tabName);
        }

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function ButtonCommand_onmouseout(ctrl, event) {
    try {
        _ctrlOver = null;
        _mouseOver = false;

        _shiftKeyDown = false;
        _ctrlKeyDown = false;

        ctrl.value = 'Save';
        ctrl.style.backgroundColor = null;
        ctrl.style.color = 'black';
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function ButtonCommand_onmouseover(ctrl, event) {
    try {
        _ctrlOver = ctrl;
        _mouseOver = true;

        if (event.shiftKey || _shiftKeyDown) {
            ctrl.value = 'Del';
            ctrl.style.backgroundColor = 'red';
            ctrl.style.color = 'white';
        } else if (event.shiftKey || _ctrlKeyDown) {
            ctrl.value = 'Save All';
            ctrl.style.backgroundColor = 'blue';
            ctrl.style.color = 'white';
        } else {
            ctrl.value = 'Save';
            ctrl.style.backgroundColor = null;
            ctrl.style.color = 'black';
        }



    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function ButtonCommand_onkeypress(ctrl, event) {
    try {
        if (event.shiftKey) {
            ctrl.value = 'Del';
            ctrl.style.backgroundColor = 'red';
            ctrl.style.color = 'white';
        }
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function TodaysDate() {
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate()
    var year = currentTime.getFullYear()

    return month + "/" + day + "/" + year;
}
//----------------------------------------------------
function SaveDiv(id) {
    try {
        var NoteText = $('#NoteText-' + id).val();
        NoteText = encodeURIComponent(NoteText).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");

        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/NoteUpdate",
            data: "{"
                + "id: '" + id + "',"
                + "NoteText: '" + NoteText + "'"
                + "}",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (data) {

                $('#imgSaveDiv-' + id).fadeOut(2000);
                $('#imgSaveDiv-' + id).fadeIn(2000);

                var tabName = $('#Note-' + id).html();

               if (tabName.indexOf("*") != -1) {
                    $('#Note-' + id).html(tabName.substr(1, tabName.length - 1));
                }

            },
            error: function (req, status, err) {
                console.log("Error: " + err);
                alert(status + ": " + err);
            }
        });
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function DeleteDiv(id) {
    try {

        if (confirm("Are you sure you want to delete the Note?")) {

            $.ajax({
                type: "POST",
                url: "../budget/default.aspx/NoteDelete",
                data: "{id: '" + id + "'}",
                cache: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $('#imgDeleteDiv-' + id).fadeOut(2000);
                    $('#Note-' + id).fadeOut(2000, function () {
                        $('#Note-' + id).remove();
                    });
                    $('#NoteTab-' + id).fadeOut(2000, function () {
                        $('#NoteTab-' + id).remove();
                    });

                    $('#imgDeleteDiv-' + id).fadeIn(2000);
                },
                error: function (req, status, err) {
                    console.log("Error: " + err);
                    alert(status + ": " + err);
                }
            });
        } else {
            _shiftKeyDown = false;
        }
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function SaveOrDelete(pk) {
    try {

        var text = $('#Cmd-' + pk).val();

        switch (text) {
            case "Save All":
                var x = SaveAllData();
                alert(x + " records have been saved");
                break;

            case "Save":
                SaveData(pk);
                var amt = $('#Amt-' + pk).val();

                //updating the original amount
                $('#Amt-' + pk).attr('original', amt);

                //removing the reset/cancel button
                $('#cancelThis' + pk).hide();

                break;

            case "Del":
                DeleteData(pk, $('#chkAllowConfirm').prop('checked'));
                break;

            //case "Clone":
            //    //Sets up New Entry to Match selected Record
            //    //conserves on user input time
            //    CloneData(pk);

            //    //Clicks Save
            //    if ($('#chkAutoSave').is(":checked")) {
            //        btnNew_onclick();
            //    }
            //    break;

            default:
                break;
        };


    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function DeleteData(pk, confirmDelete) {
    try {
        var answer;

        if (confirmDelete) {
            answer = confirm("Are you sure you want to delete this entry?");
        } else {
            answer = true
        }

        if (answer) {
            HighlightRow(pk, "red");

            $.ajax({
                type: "POST",
                url: "../budget/default.aspx/DeleteData",
                data: "{"
                    + "Id: '" + pk + "'"
                    + "}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {
                    $('#Row-' + pk).fadeTo(1000, 0.01, function () {
                        $('#Row-' + pk).slideUp(450, function () {
                            $('#Row-' + pk).remove();
                            CalculateBudget();
                        });
                    });
                },
                failure: function (response) {
                    alert(response.d);
                }
            });
        }
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function SaveAllData() {
    try {
        var pk;
        var i = 0;
        var clr;
        $.each($('[dbcalc]'), function (keys, value) {
            try {
                try {
                    pk = $(this).attr('id').replace("Row-", "");
                    clr = $('#Cmd-' + pk).parent().css("background-color");
                    if (clr.toString() == "rgb(255, 0, 0)") {
                        SaveData(pk);
                        i++;
                    }
                } catch (e) {
                    alert(e.Message);
                }

            } catch (e) {
                alert('SaveAllData ' + e.Message);
                errFree = false;
            }
        });
        return i;

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function CloneData(pk) {
    try {
        var Category = $("#Category-" + pk + " option:selected").val();
        var Descr = $("#Descr-" + pk).val();
        var Amt = $("#Amt-" + pk).val();

        $('#newAmt').val(Amt);
        $('#newDescr').val(Descr);
        $("#newCategory option[value='" + Category + "']").prop("selected", true);

    } catch (e) {
        alert("CloneData: " + e.Message);
    }
}
//----------------------------------------------------
function SaveData(pk) {
    try {

        var PayDate = $('#Date-' + pk).val();
        var Inc = $('#Inc-' + pk).is(":checked");

        if (Inc) {
            Inc = 1;
        } else {
            Inc = 0;
        }
        var Status = $('#Status-' + pk).val();
        var Category = $('#Category-' + pk).val();
        var Descr = $('#Descr-' + pk).val();
        var Amt = $('#Amt-' + pk).val();
        var postData = "{"
            + "id: '" + pk + "',"
            + "PayDate: '" + PayDate + "',"
            + "Inc: '" + Inc + "',"
            + "Status: '" + Status + "',"
            + "Category: '" + Category + "',"
            + "Descr: '" + Descr + "',"
            + "Amt: '" + Amt + "'"
            + "}";

        HighlightRow(pk, "red");

        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/SaveData",
            data: postData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                var dt = (new Date($('#Row-' + pk).attr("dt")));
                var pd = (new Date($('#Date-' + pk).val()));
                var SameDate = (dt.toString() == pd.toString());

                if (!SameDate) {
                    DeleteData(pk, false);
                    InsertData(true, PayDate, Inc, Status, Category, Descr, Amt);
                } else {
                    $('#Row-' + pk).animate({ backgroundColor: "transparent" }, 1000);
                    CalculateBudget();
                    ClearHighlight(pk);
                }
            },
            error: function (response) {
                alert(response.d);
            }
        });


    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function RebuildTimer() {
    clearTimeout(_timeoutTmr);

    //will redirect to root
    //if page has already expired
    CheckExpire();

    //resetting Warning Beep
    _WarningBeep = false;

    var $TT = $('#timeoutText');

    $TT.html(_timeoutIntervalAmt.toFixed(0));
    $TT.css("backgroundColor", "yellow");
    $TT.css("color", "black");
    $TT.css("width", "55px");
    $TT.css("height", "55px");
    $TT.css("font-size", "14px");

    $TT.css("opacity", "1");
    $('#timerContainer').css("padding-right", "58px");

    _timeoutIntervalIncr = _timeoutIntervalAmt;
    _timoutFontSize = 14;

    StartTimeOut();
}
//----------------------------------------------------
function CalculateBudget() {
    try {
        //Re-setting Timer
        RebuildTimer();

        var dt = (new Date($('#newDate').html()));
        var dtPrev = ((dt.getMonth() * 1) + 1) + "/1/" + dt.getFullYear();

        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/GetPrevTotal", 
            data: "{userId: '" + userId + "',dt: '" + dtPrev + "'}",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                try {
                    var dt = "";
                    var key = "";
                    var amt = 0;
                    var sum = (data.d * 1);
                    var incommingAmt = (data.d * 1);
                    var reconciledSum = 0;
                    var finished = false;
                    var pk = "";
                    var selStatus = "";
                    var errFree;
                    var rounded = 0;

                    $.each($('[dbcalc]'), function (keys, value) {
                        try {
                            errFree = true;
                            try {
                                pk = $(this).attr('id').replace("Row-", "");
                                selStatus = ($('#Status-' + pk).val() * 1);
                            } catch (e) {
                                alert('calc 1' + e.Message);
                                errFree = false;
                            }

                            //probably issue here with weeks with only one day
                            //probably, you may want to test here.
                            if (errFree) {
                                amt = $('#Amt-' + pk).val();
                                if (dt == "" || dt == $('#Date-' + pk).val()) {
                                    key = 'SubTotal-'
                                        + ((new Date(dt)).getMonth() + 1)
                                        + (new Date(dt)).getDate()
                                        + (new Date(dt)).getFullYear();
                                    finished = false;
                                } else {
                                    finished = true;
                                    //Assigns to the SubTotal
                                    //The key, was assigned in the last iteration
                                    //KEY ALREADY HAS SUBTOTAL INSIDE IT
                                    if (sum > 0) {
                                        $('#' + key).css("color", "Red");
                                        $('#' + key).css("font-weight", "900");
                                    } else {
                                        $('#' + key).css("color", "white");
                                        $('#' + key).css("font-weight", "900");

                                    }

                                    $('#' + key).prop("title", "Reconciled: " + reconciledSum.toFixed(2));
                                    reconciledSum = 0;
                                    $('#' + key).text(sum.toFixed(2));
                                }

                                //Calculating the Subtotal, if it was not finished.
                                dt = $('#Date-' + pk).val();
                                if ($('#Inc-' + pk).is(":checked")) {
                                    sum = sum + (amt * 1);
                                }

                                //calculate reconciled if its not:
                                //1: Budgeted
                                //6: Flagged
                                //7: InProcess
                                if (selStatus != 1 &&
                                    selStatus != 6 && 
                                    selStatus != 7) {
                                        reconciledSum = incommingAmt + reconciledSum + (amt * 1);
                                        incommingAmt = 0;
                                }

                            }
                        } catch (e) {
                            alert('calc 2 ' + e.Message);
                        }
                    });


                    if (!finished) {
                        $('#' + key).prop("title", "Reconciled: " + reconciledSum.toFixed(2));
                        $('#' + key).text(sum.toFixed(2));
                    }

                } catch (e) {
                    //alert('calc 3 ' + e.Message);
                }
            }
        });

    } catch (e) {
        alert('calc 4 ' + e.Message);
    }
}
//----------------------------------------------------
function btnFilterReset_onclick() {
    try {
        //alert("selectindex: " + $("#selFilterCategory").prop("selectedIndex"));
        if ($("#selFilterCategory").prop("selectedIndex") != 0) {
            $("#selFilterCategory").prop("selectedIndex", 0);
            selFilterCategory_oninput();
        }
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function InsertData(ChangeColor, PayDate, Inc, Status, Category, Descr, Amt) {
    try {
        var optStatus = "";
        var optCategory = "";

        $.ajax({
            type: "POST",
            url: "../budget/default.aspx/GetStatusOptionsMethod",
            data: "{selectedID: '" + Status + "'}",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                optStatus = data.d;

                $.ajax({
                    type: "POST",
                    url: "../budget/default.aspx/GetCategoryOptionsMethod",
                    data: "{" +
                        "userId: '" + userId + "'," +
                        "selectedID: '" + Category + "'" +
                        "}",
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        optCategory = data.d;

                        $.ajax({
                            type: "POST",
                            url: "../budget/default.aspx/InsertData",
                            data: "{"
                                + "userId: '" + userId + "',"
                                + "PayDate: '" + PayDate + "',"
                                + "Inc: '" + Inc + "',"
                                + "Status: '" + Status + "',"
                                + "Category: '" + Category + "',"
                                + "Descr: '" + Descr + "',"
                                + "Amt: '" + Amt + "'"
                                + "}",
                            cache: false,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                try {
                                    var pk = data.d.trim();
                                    var clr = "white";

                                    if (ChangeColor) {
                                        clr = "Yellow";
                                    }
                                    var key = 'InsertBar-'
                                        + ((new Date(PayDate)).getMonth() + 1)
                                        + (new Date(PayDate)).getDate()
                                        + (new Date(PayDate)).getFullYear();

                                    var html = "<div dt='" + PayDate + "' id='Row-" + pk + "' class='row  no-gutters offset-3' dbcalc='true' >" +
                                        "<div class='col-1 RowCommand'>" +
                                        "<input id='Cmd-" + pk + "'" +
                                        "onclick='SaveOrDelete(" + pk + ")' " +
                                        "class='ButtonCommand' " +
                                        "onmouseover='ButtonCommand_onmouseover(this,event)' " +
                                        "onmouseout='ButtonCommand_onmouseout(this,event)'  " +
                                        "title='Hold Shift Key To Delete' type='button' value='Save' /></div>" +
                                        "<div class='col-1 gridContent RowDate'><input onclick=\"BudgetDate_onclick(this);\" oninput='HighlightRow(" + pk + ", 'red')' id='Date-" + pk + "' style ='background-color:" + clr + ";width:100%;height:21px;text-align:center' type='text' class='ARight'  value='" + PayDate + "' /></div>" +
                                        "<div class='col-xs-1 gridContent RowInclude'><input style='color:" + clr + ";margin-left:9px !important;height:20px' onclick='ToggleInclude(this)' id='Inc-" + pk + "' type='checkbox' checked /></div>" +
                                        "<div class='col-2 gridContent RowStatus'><select oninput='HighlightRow(" + pk + ", 'red')' id='Status" + "-" + pk + "' style='background-color:" + clr + ";width:100%;height:21px;' >" + optStatus + "</select></div>" +
                                        "<div class='col-2 gridContent RowCategory'><select id='Category-" + pk + "' style='background-color:" + clr + ";width:100%;height:21px;'>" + optCategory + "</select></div>" +
                                        "<div class='col-3 gridContent RowDescription'><input oninput='HighlightRow(" + pk + ", 'red')' id='Descr-" + pk + "' style='background-color:" + clr + ";width: 100%;height:21px;' type='text' value='" + Descr + "' /></div>" +
                                        "<div class='col-1 gridContent RowAmount'>" +
                                        "<div style='position:absolute' id='parentCancel-" + pk + "'>" + 
                                        "<input original='" + (Amt * 1).toFixed(2) + "' " +
                                            "onblur=\"Amt_onblur(" + pk + ")\" " +
                                            "onfocus=\"Amt_onfocus(" + pk + ")\" " +
                                            "oninput=\"Amt_oninput(" + pk + ",'red')\" " +
                                            "id='Amt-" + pk + "' " +
                                        "style = 'color: black;' type='text' class='AmountItem'  value = '" + (Amt * 1).toFixed(2) + "'" +
                                        "/> " +
                                        "</div></div>";

                                    $('#' + key).before(html);

                                    CalculateBudget();

                                } catch (e) {
                                    alert("Err: " + e.Message);
                                }
                            },
                            error: function (response) {
                                alert("Err: " + response.d);
                            }
                        });
                    }
                });


            }
        });

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function ToggleDiv(pk) {

    if (pk != _divMenuOpen) {
        $('#' + _divMenuOpen).slideUp(1400, function () {
            $('#' + _divMenuOpen).hide();
        });
    }

    //Keeping track of which div is open on Side Bar
    _divMenuOpen = pk;

    $('#' + pk).slideDown(1400, function () {
        $('#' + pk).show();
    });

}
//----------------------------------------------------
function Amt_oninput(id, color){
    try {
        HighlightRow(id, color);
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function grdBudget_onclick() {
    try {

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function Amt_onfocus(pk) {
    try {
        _isHover = false;

        if (_lastFocusAmountId != pk) {
            $('#cancelThis' + _lastFocusAmountId).hide();
        }
        else {
            $('#cancelThis' + _lastFocusAmountId).hide();

        }
            $('#cancelThis' + pk).show();

        var amt = $('#Amt-' + pk).val();
        var dt = $('#Date-' + pk).val();
        var key = 'SubTotal-'
            + ((new Date(dt)).getMonth() + 1)
            + (new Date(dt)).getDate()
            + (new Date(dt)).getFullYear();

        $('#SelectedID').html(pk);
        $('#GoalSeekInput').html(amt);
        $('#GoalSeekDate').html(dt);
        $('#GoalSeekBalance').val($('#' + key).html());
        $('#GoalBalance').html($('#' + key).html());

        _lastFocusAmountId = pk;

    } catch (e) {
       alert(e.Message);
    }
}
//----------------------------------------------------
function Amt_onblur(pk) {
    var amt = $('#Amt-' + pk).val();
    var orig = $('#Amt-' + pk).attr("original");

    //Making sure if I exit the amount text box
    //the cancel button goes away, cannot do this all the time because
    //this will cause the button to hide, before executing the onclick event for the reset
    //if the original and amount are the same, no need to click the cancel button and reset the value
    if ((amt * 1) == (orig * 1)){
        $('#cancelThis' + pk).hide();
    }
}
//----------------------------------------------------
function SeekButton_onclick() {
    try {
        var amt = ($('#GoalSeekInput').html() * 1);
        var balance = ($('#GoalBalance').html() * 1);
        var seekBalance = ($('#GoalSeekBalance').val() * 1);
        var diff = amt + (seekBalance - balance);

        // $('#GoalBalance').html(amt.toFixed(2));
        $('#GoalSeekInput').html(diff.toFixed(2));
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function ApplyButton_onclick() {
    var pk = $('#SelectedID').html();
    var val = ($('#GoalSeekInput').html() * 1).toFixed(2);

    HighlightRow(pk, 'red');
    $('#Amt-' + pk).val(val);
}
//----------------------------------------------------
function cancelThis_onclick(id) {
    try { 

        _isHover = false;
        var key = "#Amt-" + id;
       var original = $(key).attr("original");

        $("#Amt-" + id).val(original);
        CalculateBudget();
        $('#cancelThis' + id).hide();

    } catch (e) {
        alert("cancelThis_onclick: " + e.Message);
    }
        return false;
}
//----------------------------------------------------
function cancelThis_onmouseover(id) {
    try {
        _isHover = true;

    } catch (e) {
        alert("cancelThis_onmouseover: " + e.Message);
    }
}
//----------------------------------------------------
function cancelThis_onmouseout(id) {
    try {
        _isHover = false;

    } catch (e) {
        alert("cancelThis_onmouseout: " + e.Message);
    }
}
//----------------------------------------------------
function Description_oninput(pk, color) {
    try {
        HighlightRow(pk, color);
    } catch (e) {
        alert("Description_oninput: " + e.Message);
    }
}
//----------------------------------------------------
function ClearDescription() {
    try {

    } catch (e) {
        alert("ClearDescription: " + e.Message);
    }
}
//----------------------------------------------------
function Description_onblur(pk) {
    try {

    } catch (e) {
        alert("Description_onblur: " + e.Message);
    }
}
//----------------------------------------------------
function Description_onfocus(pk) {
   
}
//----------------------------------------------------
function DoesCancelButtonExist() {
    var ret;
    try {
        var parent = $('#Amt-' + _lastFocusAmountId)[0].parentNode;
        ret = parent.children[1] != undefined;

    } catch (e) {
        ret = false;
    }

    return ret;
}
//----------------------------------------------------
function ChangeRowColor(pk, clr) {
    try {
        $('#Row-' + pk).animate({ backgroundColor: 'none' }, 1000);

        $('#Date-' + pk).css("color", clr);
        $('#Status-' + pk).css("color", clr);
        $('#Category-' + pk).css("color", clr);
        $('#Descr-' + pk).css("color", clr);
        $('#Amt-' + pk).css("color", clr);

        if (clr == "silver") {
            $('#Inc-' + pk).css("opacity", ".3");
        } else {
            $('#Inc-' + pk).css("opacity", "1");
        }

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function ToggleInclude(pk) {
    try {
        var isChecked = $('#Inc-' + pk).is(":checked");

        if (isChecked) {
            $('#Row-' + pk).animate({ backgroundColor: 'none' }, 1000);
            $('#Date-' + pk).css("color", "black");
            $('#Inc-' + pk).css("opacity", "1");
            $('#Status-' + pk).css("color", "black");
            $('#Category-' + pk).css("color", "black");
            $('#Descr-' + pk).css("color", "black");
            $('#Amt-' + pk).css("color", "black");

            $('#Date-' + pk).prop("disabled", false);
            $('#Status-' + pk).prop("disabled", false);
            $('#Category-' + pk).prop("disabled", false);
            $('#Descr-' + pk).prop("disabled", false);
            $('#Amt-' + pk).prop("disabled", false);

        } else {
            $('#Row-' + pk).animate({ backgroundColor: 'gray' }, 1000);
            $('#Date-' + pk).prop("disabled", true);
            $('#Date-' + pk).css("color", "silver");
            $('#Status-' + pk).prop("disabled", true);
            $('#Status-' + pk).css("color", "silver");
            $('#Category-' + pk).prop("disabled", true);
            $('#Category-' + pk).css("color", "silver");
            $('#Descr-' + pk).prop("disabled", true);
            $('#Descr-' + pk).css("color", "silver");
            $('#Amt-' + pk).prop("disabled", true);
            $('#Amt-' + pk).css("color", "silver");
        }

        CalculateBudget();
    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function HighlightRow(pk, color) {
    try {
        $('#Cmd-' + pk).parent().animate({ backgroundColor: color }, 1000);

        CalculateBudget();

    } catch (e) {
        alert('HighlightRow ' + e.Message);
    }
}
//----------------------------------------------------
function ClearHighlight(pk) {
    try {
        $('#Cmd-' + pk).parent().animate({ backgroundColor: "transparent" }, 1000);
        $('#Amt-' + pk).animate({ backgroundColor: "white" }, 1000);
        $('#Descr-' + pk).animate({ backgroundColor: "white" }, 1000);
        $('#Category-' + pk).animate({ backgroundColor: "white" }, 1000);
        $('#Status-' + pk).animate({ backgroundColor: "white" }, 1000);
        $('#Date-' + pk).animate({ backgroundColor: "white" }, 1000);

    } catch (e) {
        alert(e.Message);
    }
}
//----------------------------------------------------
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    if (evt.currentTarget != null) {
        evt.currentTarget.className += " active";
    }
}
