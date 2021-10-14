const urls = {
    CHECK_BALANCE: "https://dev.onebanc.ai/uiservices/upi.asmx/checkBalance",
    REQ_PAY: "https://dev.onebanc.ai/uiservices/upi.asmx/getReqPay",
    RESP_PAY: "https://dev.onebanc.ai/uiservices/upi.asmx/getRespPay",
    VALIDATE_ADDRESS: "https://dev.onebanc.ai/uiservices/upi.asmx/setValidateAddress",
    CUSTOMER_INFORMATION: "https://dev.onebanc.ai/uiservices/upi.asmx/getCustomerInformation",
    SUGGESTED_CONTACTS: "https://dev.onebanc.ai/uiservices/upi.asmx/getSuggestedContacts",
    PENDING_TRANSACTIONS: "https://dev.onebanc.ai/uiservices/upi.asmx/getPendingTransactions",
    TRANSACTION_HISTORY: "https://dev.onebanc.ai/uiservices/upi.asmx/getTransactionHistory"
};

const TYPE = { "Pay": 1, "Collect": 2 },
    STATUS = { "Pending": 1, "Success": 2, "Failed": 3, "Suggested": 4 },
    DIRECTION = { "Sent": 1, "Received": 2 },
    ACTION = { "Cancel": 1, "Reject": 2, "Remind": 3, "Accept": 4 };

function showErrorScreen() {
    $('body').find("table").hide().end().find("#loader").hide().end().find("#error_screen").show().end();
}

function showLoading(selector) {
    $(selector).html("<img id='loader' src='data:image/gif;base64,R0lGODlhEAAQAPIAAP///zqHrc/h6mylwjqHrYW0zJ7D1qrL2yH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=='>")
    if ((selector) == ".body") {
        $("#loader").css({ "width": "60px", "height": "60px", "margin": "30% 0 0 30%" });
        $(".heading").hide();
    }
}

function showMandatory(selectClass) {
    $("." + selectClass).html("Please fill out this field");
}


function formatDate(date) {
    var d = (date.split('T')[0].split('-'));
    return d[2] + '/' + d[1] + '/' + d[0];
}

function formatTime(date) {
    var d = (date.split('T')[1].split(':'));
    if (d[0] >= '0' && d[0] < '12') {
        return d[0] + ':' + d[1] + ' AM';
    } else if (d[0] == '12') {
        return '12:' + d[1] + 'PM';
    } else {
        return d[0] - 12 + ':' + d[1] + ' PM';
    }
}

function inrFormat(val) {
    var number = val.toString();
    var afterPoint = '';
    if (number.indexOf('.') > 0)
        afterPoint = number.substring(number.indexOf('.'), number.length);
    number = (number != "") ? Math.floor(number) : "";
    number = number.toString();
    var lastThree = number.substring(number.length - 3);
    var otherNumbers = number.substring(0, number.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return result;
}

function getHashObject() {
    var hashDict = {};
    var items = location.hash.replace(new RegExp("^[\?#]"), "").split("&");
    for (var i = 0; i < items.length; i++) {
        var item = items[i].split("=");
        hashDict[item[0]] = decodeURI(item[1]);
    }
    return hashDict;
}

function autocomplete(selector, array) {
    $(selector).autocomplete({
        source: array,
        minLength: 0,
    }).focus(callFocus)
}

function callFocus() {
    return $(this).autocomplete("search", "");
}

function mandatoryField(selector) {
    var len = $("input").length;
    var is_valid = true;
    for (var i = 0; i < len; i++) {
        var id = $("input").eq(i).attr("id");
        var val = $("#" + id).val();
        if (selector == "form") {
            if (i == 1 || i == 2) {
                if ($("." + id).is(':visible') == true && val == "") {
                    is_valid = false;
                }
            } else {
                if (val == "") {
                    is_valid = false;
                }
            }
        } else {
            if (val == "") {
                is_valid = false;
            }
        }
        if (is_valid == false) {
            showMandatory(id + "error");
            $("." + id + "error").show();
        } else {
            $("." + id + "error").hide();
        }
    }
    return is_valid;
}

$(document).ready(callAction)

function callAction() {
    var loc = location.href,
        fileName = loc.split('/')[loc.split('/').length - 1].split('#')[0].split('.')[0],
        hashDictionary = getHashObject(),
        data = { customerId: hashDictionary.id, };
    if (fileName == "index") {
        var arrayCustid = ['1234567', '1', '2'],
            arrayAction = ["Pay", "Collect", "See Transaction History", "See Pending Transactions"];
        autocomplete("#cust_id", arrayCustid);
        autocomplete("#action", arrayAction);
    } else if (fileName == "form") {
        if (hashDictionary.hasOwnProperty("amount")) {
            var receiver_upi = hashDictionary.partnerUpiAddress.split('%40');
            $("#amount").val(hashDictionary.amount);
            $("#receiver").val(receiver_upi[0] + '@' + receiver_upi[1]);
        }
        $("#button").html(hashDictionary.action);
        $(".verify_upi").hide();
        showLoading($(".sendererror"));
        showLoading($(".receivererror"));
        $.getJSON(urls.CUSTOMER_INFORMATION, data)
            .done(senderDropdown)
            .fail(showErrorScreen)
        $.getJSON(urls.SUGGESTED_CONTACTS, data)
            .done(receiverDropdown)
            .fail(showErrorScreen)
    } else if (fileName == "transactionHistory") {
        showLoading(".body");
        $.getJSON(urls.TRANSACTION_HISTORY, data)
            .done(transactionHistory)
            .fail(showErrorScreen)
    } else if (fileName == "pendingTransactions") {
        showLoading(".body");
        $.getJSON(urls.PENDING_TRANSACTIONS, data)
            .done(pendingTransactions)
            .fail(showErrorScreen)
    }
}

function proceedToAction() {
    var is_valid = mandatoryField();
    if (is_valid == false) return;
    var parameters = {
            id: $("#cust_id").val(),
            action: $("#action").val(),
        },
        file;
    if (parameters.action == "Pay" || parameters.action == "Collect") file = "form";
    else if (parameters.action == "See Transaction History") file = "transactionHistory";
    else if (parameters.action == "See Pending Transactions") file = "pendingTransactions";
    $("input").val("");
    location.href = "../html/" + file + ".html#" + $.param(parameters);
}

function senderDropdown(result) {
    $("#loader").remove();
    var upiAddresses = [];
    for (var i = 0; i < result["customerAccountInfo"].length; i++) {
        upiAddresses.push(result["customerAccountInfo"][i]["upiAddress"]);
    }
    autocomplete("#sender", upiAddresses);
}

function receiverDropdown(result) {
    $("#loader").remove();
    var upiAddresses = [];
    for (var i = 0; i < result["suggestedContacts"].length; i++) {
        upiAddresses.push(result["suggestedContacts"][i]["upiAddress"]);
    }
    autocomplete("#receiver", upiAddresses);
}

function transactionHistory(result) {
    $(".heading").show();
    $("#loader").remove();
    var txnarray = [];
    if (result["errorMessage"] == "Invalid CustomerId") {
        showErrorScreen();
    } else {
        for (var i = 0; i < result["transactions"].length; i++) {
            var transaction = result["transactions"][i],
                amount = inrFormat(transaction["amount"]),
                date = formatDate(transaction["lastUpdatedOn"]),
                time = formatTime(transaction["lastUpdatedOn"]);
            var payment_status = paymentStatus(transaction["type"], transaction["direction"], transaction["status"], transaction["action"]);
            var $txn_clone = $("#template").find(".txn_history").clone();
            $($txn_clone).find(".description").text(transaction["description"]).end()
                .find(".time").text(time).end()
                .find(".acc_no").text(transaction["partnerUpiAddress"]).end()
                .find(".date").text(date).end()
                .find(".amount").text("₹" + amount).end()
                .find(".action").text(payment_status).end();
            $txn_clone.data(result["transactions"][i]);
            txnarray.push($txn_clone);
        }
        $(".heading").show();
        $(".transaction_history").html(txnarray);
    }
}

function paymentStatus(type, direction, status, action) {
    if (ACTION.Cancel == action) {
        return "Request Cancelled";
    } else if (ACTION.Reject == action) {
        return "Request Rejected";
    } else if (ACTION.Remind == action) {
        return "Reminded Request";
    }
    if ((((TYPE.Pay == type) && ((DIRECTION.Sent == direction) || (DIRECTION.Received == direction))) || ((TYPE.Collect == type) && (DIRECTION.Received == direction))) && (STATUS.Pending == status)) {
        return ("pending");
    } else if ((((TYPE.Pay == type && DIRECTION.Sent == direction) || (TYPE.Collect = type && DIRECTION.Received == direction))) && (STATUS.Success == status)) {
        return ("Paid");
    } else if (STATUS.Failed == status) {
        return ("Paymnet Failed");
    } else if (((TYPE.Pay == type && DIRECTION.Received == direction) || (TYPE.Collect == type && DIRECTION.Sent == direction)) && (STATUS.Success == status)) {
        return ("Payment Received");
    } else {
        return ("Payment not received yet");
    }
}

function pendingTransactions(result) {
    $(".pending").show();
    console.log(result["transactions"].length);
    $("#loader").remove();
    if (result["errorMessage"] == "Invalid CustomerId") {
        showErrorScreen();
    } else if (result["transactions"].length == 0) {
        // $("body").empty();
        console.log('1');
        // $("body").html("<h3>No Pending Transactions!</h3><h3><a href='../js/index.html'>Please Go Back!</a></h3>")
        $("#nopending").show();
        $("#goback").show();
    } else {
        $(".sent").find(".pay_req").remove();
        $(".receive").find(".pay_req").remove();
        for (var i = 0; i < result["transactions"].length; i++) {
            var transactions = result["transactions"][i],
                type = transactions["type"],
                direction = transactions["direction"];
            var $req_clone = $("#template").find(".pay_req").clone();
            $req_clone.find(".description").text(transactions["description"]).end()
                .find(".amount").text("₹" + inrFormat(transactions["amount"])).end()
                .find(".date").text(formatDate(transactions["lastUpdatedOn"])).end()
                .find(".time").text(formatTime(transactions["lastUpdatedOn"])).end()
                .find(".upi").text(transactions["partnerUpiName"]).end();
            $req_clone.data(result["transactions"][i]);
            if (TYPE.Collect == type) {
                if (DIRECTION.Sent == direction) {
                    $req_clone.find(".remind").text("Remind");
                    $req_clone.find(".cancel").text("Cancel");
                    $(".sent").append($req_clone);
                } else {
                    $req_clone.find(".pay").text("Pay");
                    $req_clone.find(".reject").text("Reject");
                    $(".receive").append($req_clone);
                }
            }
            $(".heading").show();
        }
    }
}

function hideReceiverUpi() {
    $(".receiver_upi").hide();
    $(".verify_upi").show();
}

function payRequestAction() {
    var is_valid = mandatoryField("form");
    if (is_valid == false) return;
    var hashDict = getHashObject(),
        payment_type;
    if ($("#button").text() == "Pay") payment_type = 1;
    else payment_type = 2;
    var data = {
        customerId: hashDict.id,
        customerUpiAddress: $("#sender").val(),
        device: "hello",
        partnerUpiAddress: $("#receiver").val(),
        respValAdd: "Hi!",
    };
    if ($("#verify_upi").val() != "") {
        delete data.partnerUpiAddress;
        data["partnerUpiAddresses"] = $("#verify_upi").val();
        $.post(urls.VALIDATE_ADDRESS, data)
            .done(verifyUpi)
            .fail(showErrorScreen)
    } else {
        if (hashDict.hasOwnProperty('amount')) {
            data["transactionId"] = hashDict.transactionId;
            data["referenceId"] = hashDict.referenceId;
            data["action"] = 4;
            payment_type = 2;
        }
        data["amount"] = $("#amount").val();
        data["currencyType"] = "INR";
        data["paymentType"] = payment_type;
        data["description"] = "19/1/2021";
        $.post(urls.REQ_PAY, data)
            .done(callReqPay)
            .fail(showErrorScreen)
    }
}

function verifyUpi(result) {
    var result = JSON.parse(result);
    var buttonText = $("#button").text(),
        hashDict = getHashObject(),
        payment_type;
    if (buttonText == "Pay") payment_type = 1;
    else payment_type = 2;
    data = {
        customerId: hashDict.id,
        customerUpiAddress: result["customerUpiAddress"],
        device: "hello",
        partnerUpiAddress: result["partnerUpiAddresses"][0],
        amount: $("#amount").val(),
        currencyType: "INR",
        paymentType: payment_type,
        description: "21/01/2021",
    };
    $.post(urls.REQ_PAY, data)
        .done(callReqPay)
        .fail(showErrorScreen)
}

function callReqPay(result) {
    var result = JSON.parse(result);
    var data = {
        transactionId: result["transactionId"],
        referenceId: result["referenceId"],
        respPay: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>  <ns2:RespPay  xmlns:ns2="http://npci.org/upi/schema/"  xmlns:ns3="http://npci.org/cm/schema/">  <Head ver="2.0" ts="2018-02-17T13:50:48+05:30" orgId="NPCI" msgId="1GRDpegBbA5wfsdnypyf"/>  <Txn id="" note="testpay" refId="804813039157" refUrl="http://axis.com/upi" ts="2018-02-17T13:39:54.944+05:30" type="PAY" custRef="804813039157" initiationMode="00">  <RiskScores>  <Score provider="NPCI" type="TXNRISK" value="00995"/>  </RiskScores>  </Txn>  <Resp reqMsgId="OBNc2ed455b797e4add8392110cfc528acc" result="SUCCESS" actn="">  <Ref type="PAYER" seqNum="1" addr="vibhore@oneybl" settAmount="200" settCurrency="INR" approvalNum="169353" respCode="00" regName="Vibhore" orgAmount="200" acNum="058010100083000" IFSC="ICIC0000058" code="0000"/>  <Ref type="PAYEE" seqNum="1" addr="Manindersingh@ybl" settAmount="2.00" settCurrency="INR" approvalNum="959826" respCode="00" regName="Maninder" orgAmount="200"  acNum="910010050136217" IFSC="BKID0000004" code="0000" />  </Resp>  </ns2:RespPay>',
    };
    if (result["errorMessage"] == "Insufficiant balance !!!") {
        $("#less_balance").show();
        $("#goback").show();
    } else if (result["errorMessage"] == "Invalid UpiAddress") {
        $("#error_screen").remove();
        $("#invalid_upi").show();
        $("#goback").show();
    }
    $.post(urls.RESP_PAY, data)
        .done(callRespPay)
        .fail(showErrorScreen)
}

function callRespPay(result) {
    var result = JSON.parse(result);
    var hashDict = getHashObject();
    var parameters = {
        id: hashDict.id,
        action: "See Transaction History",
    }
    $("input").val("");
    location.href = "../html/transactionHistory.html#" + $.param(parameters);
}

function checkBalance() {
    if ($("#sender").val() == "") {
        $(".error").hide();
        showMandatory("sendererror");
        $(".sendererror").show();
    } else {
        $(".sendererror").hide();
    }
    var hashDictionary = getHashObject();
    var data = {
        customerId: hashDictionary.id,
        upiAddress: $("#sender").val(),
    };
    $.post(urls.CHECK_BALANCE, data)
        .done(printBalance)
        .fail(showErrorScreen)
}

function printBalance(result) {
    $("#text_bal").show();
    var result = JSON.parse(result);
    $("#balance").html("₹" + inrFormat(result["balance"]));
}

function performAction(object) {
    var action = $(object).text();
    var data = $(object).closest(".pay_req").data(),
        action_value, payment_type;
    var parameters = {
        amount: data["amount"],
        partnerUpiAddress: data["partnerUpiAddress"],
        transactionId: data["transactionId"],
        referenceId: data["referenceId"],
    }
    if (action == "Cancel") {
        action_value = 1;
        payment_type = 2;
        $(object).closest(".pay_req").remove();
    } else if (action == "Reject") {
        action_value = 2;
        payment_type = 1;
        $(object).closest(".pay_req").remove();
    } else if (action == "Remind") {
        action_value = 3;
        payment_type = 2;
    } else if (action == "Pay") {
        action_value = 4;
        payment_type = 1;
        parameters["id"] = data["customerId"];
        parameters["action"] = "pay";
        $(object).closest(".pay_req").remove();
        $("input").val("");
        location.href = "../html/form.html#" + $.param(parameters);
    }
    parameters["action"] = action_value;
    parameters["customerId"] = data["customerId"];
    parameters["device"] = "Hello!";
    parameters["customerUpiAddress"] = data["customerUpiAddress"];
    parameters["respValAdd"] = "Hi!";
    parameters["currencyType"] = "INR";
    parameters["paymentType"] = payment_type;
    parameters["description"] = "test 22-dec-2021";
    $.post(urls.REQ_PAY, parameters)
        .done(callReqPay)
        .fail(showErrorScreen)
}
$(".upi").keydown(validateUpi);

function validateUpi(e) {
    if (e.keyCode == 32 || e.keyCode == 9) e.preventDefault();
}

function preventCharacters(e) {
    var value = e.which || e.keyCode;
    if ((value != 9) && (value < 48 || value > 57)) {
        e.preventDefault();
    }
}

function custIdValidate() {
    if ($("#cust_id").val() == '0') $("#cust_id").val('');
}

function preventDigits(e) {
    var key = e.which || e.keyCode;
    if (!((key == 8) || (key == 32) || (key == 46) || (key == 16) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
        e.preventDefault();
    } else {
        if ($.trim($("#action").val()) == "") {
            $("#action").val('');
        }
    }
}

function preventPasteCharacters(e) {
    var value = e.clipboardData.getData('text') || window.clipboardData.getData('text');
    regEx = new RegExp("^[1-9]{1}[0-9]{0,8}$");
    if (regEx.test(value) == false) e.preventDefault();
}

function preventPasteDigits(e) {
    var value = e.clipboardData.getData('text') || window.clipboardData.getData('text');
    regEx = new RegExp("^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$");
    if (regEx.test(value) == false) e.preventDefault();
}
$(".upi").keydown(validateUpi);

function validateUpi(e) {
    if (e.keyCode == 32 || e.keyCode == 9) e.preventDefault();
}

function validateAmount(e) {
    var number = ($(".stylednumber").val()).replaceAll(',', '');
    if (parseInt(number) == 100000) {
        e.preventDefault();
        if (e.keyCode == 8) return;
    }
    var character = e.key,
        newValue = (number + character);
    if ((e.keyCode != 8) && ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode != 46 || $(".stylednumber").val().indexOf('.') != -1))) {
        e.preventDefault();
    }
    if (isNaN(number) || parseFloat(newValue) * 100 % 1 > 0) {
        if (e.keyCode != 8) {
            $(".stylednumber").val(inrFormat(number));
            e.preventDefault();
        }
    }
    if ((e.keyCode == 32 || e.keyCode == 9) ||
        (Math.round(newValue * 100) < 100) ||
        (Math.round(newValue * 100) > 10000000))
        e.preventDefault();
}

function showVal() {
    $(".stylednumber").val($(".stylednumber").val().replaceAll(',', ''));
    $(".stylednumber").val(inrFormat($(".stylednumber").val()));
    // var regEx = new RegExp("[1-9]{1}[0-9]{0,1}[,]?[0-9]{0,3}([.][0-9]{0,2})?$");
    var regEx = new RegExp("^[1-9]{1}[,]?[0-9]{0,2}[,]?[0-9]{0,3}([.][0-9]{0,2})?$");
    var newValue = $(".stylednumber").val();
    if (parseInt(newValue.replaceAll(',', '')) != 100000) {
        if (regEx.test(newValue) == false) {
            $(".stylednumber").val('');
            // e.preventDefault();
        }
    }
    if ((Math.round(newValue.replaceAll(',', '') * 100) < 100) ||
        (Math.round(newValue.replaceAll(',', '') * 100) > 10000000))
        $(".stylednumber").val('');
}

function validatePasteAmount(e) {
    var value = e.clipboardData.getData('text') || window.clipboardData.getData('text');
    var regEx = new RegExp("[1-9]{1}[0-9]{0,1}[,]?[0-9]{0,3}([.][0-9]{0,2})?$");
    var newValue = $(".stylednumber").val() + value;
    if (regEx.test(value) == false) {
        e.preventDefault();
    }
    if ((Math.round(newValue.replaceAll(',', '') * 100) < 100) ||
        (Math.round(newValue.replaceAll(',', '') * 100) > 10000000))
        e.preventDefault();
}