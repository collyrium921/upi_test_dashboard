$(document).ready(callIndex);

function callIndex() {
    var type = { "Pay": 1, "Collect": 2 },
        status = { "Pending": 1, "Success": 2, "Failed": 3, "Suggested": 4 },
        direction = { "Sent": 1, "Received": 2 },
        action = { "Cancel": 1, "Reject": 2, "Remind": 3, "Accept": 4 };
    $("#cust_id").change(selectCustomer);
    $("#action").change(selectAction);

    function callAction(act) {
        if (act == "Pay" || act == "Collect") {
            return "form";
        } else if (act == "See Transaction History") {
            return "transactionHistory";
        } else if (act == "See Pending Transaction") {
            return "pendingTransactions";
        }
    }

    function selectCustomer() {
        var id = $("#cust_id").val();
        var act = $("#action").val();
        if (act != "") {
            var loc = callAction(act);
            location.href = loc + ".html#" + "cid=" + id + "&action=" + act;
            $("#cust_id").val("");
            $("#action").val("");
        }
    }

    function selectAction() {
        var act = $("#action").val()
        var id = $("#cust_id").val();
        if (id != "") {
            var loc = callAction(act);
            location.href = loc + ".html#" + "cid=" + id + "&action=" + act;
            $("#cust_id").val("");
            $("#action").val("");
        }
    }

    function getLocation() {
        var loc = location.href;
        var fileName = location.href.split("/")[location.href.split("/").length - 1].split(".")[0];
        var cust_id = loc.split('/')[7].split('#')[1].split('&')[0].split('=')[1];
        var action = loc.split('/')[7].split('#')[1].split('&')[1].split('=')[1];
        if (fileName == "transactionHistory") {
            var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getTransactionHistory";
            var data = { customerId: cust_id, }
            apiCall(fileName, url, data);
        } else if (fileName == "pendingTransactions") {
            var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getPendingTransactions";
            var data = { customerId: cust_id, }
            apiCall(fileName, url, data);
        } else if (fileName == "form") {
            $(".verify").hide();
            if (action == "Pay") {
                $("#button").html("Pay");
            } else {
                $("#button").html("Send Request");
            }

            function sender() {
                var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getCustomerInformation";
                var data = { customerId: cust_id, }
                fileName = "Sender";
                apiCall(fileName, url, data);
            }

            function receiver() {
                var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getSuggestedContacts";
                var data = { customerId: cust_id, }
                fileName = "Receiver";
                apiCall(fileName, url, data);

            }
            sender();
            receiver();
        }
    }

    function apiCall(fileName, url, data) {
        // show loading
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json",
            success: function(json) {
                // hide loading
                if (fileName == "transactionHistory") {
                    transactionHistory(json);
                } else if (fileName == "pendingTransactions") {
                    pendingTransactions(json);
                } else if (fileName == "Sender") {
                    function customerInfo(json) {
                        var s = '<option value="0">-Select-</option>';
                        $.each(json["customerAccountInfo"], function(index) {
                            s += '<option>' + json["customerAccountInfo"][index]["upiAddress"] + '</option>';
                        })
                        $("#sender").html(s);
                    }
                    customerInfo(json);
                } else if (fileName == "Receiver") {
                    function suggestedContacts(json) {
                        var s = '<option value="0">-Select-</option>';
                        $.each(json["suggestedContacts"], function(index) {
                            s += '<option>' + json["suggestedContacts"][index]["upiAddress"] + '</option>';
                        })
                        $("#receiver").html(s);
                    }
                    suggestedContacts(json);
                } else if (fileName == "CheckBal") {
                    function check_bal(json) {
                        var bal = inrFormat(json["balance"]);
                        $("#balance").text("₹" + bal);
                    }
                    check_bal(json);
                } else if (fileName == "reqPay") {
                    function req_pay(json) {
                        var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getRespPay",
                            data = {
                                transactionId: json["transactionId"] || '124',
                                referenceId: json["referenceId"] || '234',
                                respPay: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>  <ns2:RespPay  xmlns:ns2="http://npci.org/upi/schema/"  xmlns:ns3="http://npci.org/cm/schema/">  <Head ver="2.0" ts="2018-02-17T13:50:48+05:30" orgId="NPCI" msgId="1GRDpegBbA5wfsdnypyf"/>  <Txn id="" note="testpay" refId="804813039157" refUrl="http://axis.com/upi" ts="2018-02-17T13:39:54.944+05:30" type="PAY" custRef="804813039157" initiationMode="00">  <RiskScores>  <Score provider="NPCI" type="TXNRISK" value="00995"/>  </RiskScores>  </Txn>  <Resp reqMsgId="OBNc2ed455b797e4add8392110cfc528acc" result="SUCCESS" actn="">  <Ref type="PAYER" seqNum="1" addr="vibhore@oneybl" settAmount="200" settCurrency="INR" approvalNum="169353" respCode="00" regName="Vibhore" orgAmount="200" acNum="058010100083000" IFSC="ICIC0000058" code="0000"/>  <Ref type="PAYEE" seqNum="1" addr="Manindersingh@ybl" settAmount="2.00" settCurrency="INR" approvalNum="959826" respCode="00" regName="Maninder" orgAmount="200"  acNum="910010050136217" IFSC="BKID0000004" code="0000" />  </Resp>  </ns2:RespPay>',
                            };
                        apiCall("respPay", url, data);
                    }
                    req_pay(json);

                } else if (fileName == "respPay") {
                    var cust_id = location.href.split('/')[7].split('#')[1].split('&')[0].split('=')[1];
                    location.href = "transactionHistory.html#cid=" + cust_id + "&action=See Transaction History";
                } else if (fileName == "setValidateAddress") {
                    console.log(json);
                }
            }
        })
    }

    function transactionHistory(json) {
        $(".trans_history").find('.txn_history').remove();
        $.each((json["transactions"]), function(index) {
            var txn = json["transactions"][index];
            var amount = inrFormat(txn["amount"]);
            var date = formatDate(txn["lastUpdatedOn"]);
            var time = formatTime(txn["lastUpdatedOn"]);
            var typ = txn["type"];
            var dir = txn["direction"];
            var stat = txn["status"];
            var act = txn["action"];
            var $txn_clone = $("#template").find(".txn_history").clone();
            $txn_clone.find(".description").text(txn["description"]).end();
            $txn_clone.find(".time").text(time).end();
            $txn_clone.find(".acc_no").text(txn["partnerUpiAddress"]).end();
            $txn_clone.find(".date").text(date).end();
            if (type.Pay == typ) {
                if (direction.Sent == dir) {
                    if (status.Pending == stat) {
                        $txn_clone.find(".amount").text("₹" + amount).end();
                        $txn_clone.find(".action").text("Payment pending").end();
                    } else if (status.Success == stat) {
                        $txn_clone.find(".amount").text("-₹" + amount).end();
                        $txn_clone.find(".action").text("Paid").end();
                    } else if (status.Failed == stat) {
                        $txn_clone.find(".amount").text("₹" + amount).end();
                        $txn_clone.find(".action").text("Payment failed").end();
                    }
                } else {
                    if (status.Pending == stat) {
                        $txn_clone.find(".amount").text("₹" + amount).end();
                        $txn_clone.find(".action").text("Payment pending").end();
                    } else if (status.Success == stat) {
                        $txn_clone.find(".amount").text("+₹" + amount).end();
                        $txn_clone.find(".action").text("Payment received").end();
                    } else if (status.Failed == stat) {
                        $txn_clone.find(".amount").text("₹" + amount).end();
                        $txn_clone.find(".action").text("Payment failed").end();
                    }
                }
            } else {
                if (direction.Sent == dir) {
                    if (status.Pending == stat) {
                        $txn_clone.find(".amount").text("₹" + amount).end();
                        $txn_clone.find(".action").text("Payment not received yet").end();
                    } else if (status.Success == stat) {
                        $txn_clone.find(".amount").text("+₹" + amount).end();
                        $txn_clone.find(".action").text("Payment received").end();
                    } else if (status.Failed == stat) {
                        $txn_clone.find(".amount").text("₹" + amount).end();
                        $txn_clone.find(".action").text("Payment failed").end();
                    }
                } else {
                    if (status.Pending == stat) {
                        $txn_clone.find(".amount").text("₹" + amount).end();
                        $txn_clone.find(".action").text("Payment pending").end();
                    } else if (status.Success == stat) {
                        $txn_clone.find(".amount").text("-₹" + amount).end();
                        $txn_clone.find(".action").text("Paid").end();
                    } else if (status.Failed == stat) {
                        $txn_clone.find(".amount").text("₹" + amount).end();
                        $txn_clone.find(".action").text("Payment failed").end();
                    }
                }
                if (action.Cancel == act) {
                    $txn_clone.find(".amount").text("₹" + amount).end();
                    $txn_clone.find(".action").text("Request Cancelled").end();
                } else if (action.Reject == act) {
                    $txn_clone.find(".amount").text("₹" + amount).end();
                    $txn_clone.find(".action").text("Request Rejected").end();
                } else if (action.Remind == act) {
                    $txn_clone.find(".amount").text("₹" + amount).end();
                    $txn_clone.find(".action").text("Reminded request").end();
                }
            }
            $txn_clone.data(json["transactions"][index]);
            $(".trans_history").append($txn_clone);
        })
    }

    function pendingTransactions(json) {
        console.log(json);
        $(".sent").find(".pay_req").remove();
        $(".receive").find(".pay_req").remove();
        $.each(json["transactions"], function(index) {
            var txn = json["transactions"][index];
            var date = formatDate(txn["lastUpdatedOn"]);
            var time = formatTime(txn["lastUpdatedOn"]);
            var amount = inrFormat(txn["amount"]);
            var typ = txn["type"];
            var dir = txn["direction"];
            var $req_clone = $("#template").find(".pay_req").clone();
            $req_clone.find(".description").text(txn["description"]).end();
            $req_clone.find(".amount").text("₹" + amount).end();
            $req_clone.find(".date").text(date).end();
            $req_clone.find(".time").text(time).end();
            $req_clone.find(".upi").text(txn["partnerUpiName"]).end();
            $req_clone.data(json["transactions"][index]);
            if (type.Collect == typ) {
                if (direction.Sent == dir) {
                    $req_clone.find(".remind").text("Remind").end();
                    $req_clone.find(".cancel").text("Cancel").end();
                    $(".sent").append($req_clone);
                } else {
                    $req_clone.find(".pay").text("Pay").end();
                    $req_clone.find(".reject").text("Reject").end();
                    $(".receive").append($req_clone);
                }
            }
        });
    }

    function formatDate(date) {
        var d = (date.split('T')[0].split('-'));
        return d[2] + '/' + d[1] + '/' + d[0];
    }

    function formatTime(date) {
        var d = (date.split('T')[1].split(':'));
        if (d[0] >= '0' && d[0] < '12') {
            return d[0] + ':' + d[1] + ' AM';
        } else {
            return d[0] - 12 + ':' + d[1] + ' PM';
        }
    }

    $("#button").click(function() {
        var p_type;
        var loc = location.href,
            cust_id = loc.split('/')[7].split('#')[1].split('&')[0].split('=')[1];
        var action = loc.split('/')[7].split('#')[1].split('&')[1].split('=')[1];
        if (action == "Pay") p_type = 1;
        else p_type = 2;
        if ($("#verify_upi").val() != "") {
            var url_v = "https://dev.onebanc.ai/uiservices/upi.asmx/setValidateAddress",
                fileName = "setValidateAddress";
            var data_v = {
                customerId: cust_id,
                customerUpiAddress: $("#sender").val(),
                device: "hello",
                partnerUpiAddresses: $("#verify_upi").val(),
                respValAdd: "gjhffh",
            };
            console.log(data_v);
            apiCall(fileName, url_v, data_v);
        }
        var data = {
            customerId: cust_id,
            customerUpiAddress: $("#sender").val(),
            device: "hello",
            partnerUpiAddress: ($("#receiver").val() == "0" || $("#receiver").val() == null) ? $("#verify_upi").val() : $("#receiver").val(),
            amount: $("#amount").val(),
            currencyType: "ruppee",
            paymentType: p_type,
            description: "for 28/12/20",
        };
        var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getReqPay";
        var fileName = "reqPay";
        apiCall(fileName, url, data);
    });
    $("#check_bal").click(function() {
        // console.log(123);
        var loc = location.href;
        var url = "https://dev.onebanc.ai/uiservices/upi.asmx/checkBalance",
            cust_id = loc.split('/')[7].split('#')[1].split('&')[0].split('=')[1],
            upi = $("#sender").val(),
            data = { customerId: cust_id, upiAddress: upi, }
        fileName = "CheckBal";
        apiCall(fileName, url, data);
    });

    $("#verify").click(function() {
        $(".receiver").hide();
        $(".verify").show();
    });

    $('input.Stylednumber').keyup(function() {
        var input = $(this).val().replaceAll(',', '');
        if (input.length < 1)
            $(this).val('');
        else {
            var formatted = inrFormat(input);
            if (formatted.indexOf('.') > 0) {
                var split = formatted.split('.');
                formatted = split[0] + '.' + split[1].substring(0, 2);
            }
            $(this).val(formatted);
        }
    });

    function inrFormat(val) {
        var x = val;
        x = x.toString();
        var afterPoint = '';
        if (x.indexOf('.') > 0)
            afterPoint = x.substring(x.indexOf('.'), x.length);
        x = Math.floor(x);
        x = x.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
        return res;
    }
    getLocation();
}

function amount_validate(event) {
    var x = event.which || event.keyCode;
    if (x < 48 || x > 57) {
        event.preventDefault();
    }
}

function action(obj) {
    var action = $(obj).text();
    // console.log(action);
    var data = $(obj).closest(".pay_req").data();
    console.log(data);
    var t_id = data["transactionId"];
    var ref_id = data["referenceId"];
    var par_upi = data["partnerUpiAddress"];
    var upi = data["customerUpiAddress"];
    var custId = data["customerId"];
    var amt = data["amount"];
    var act = 0;
    var p_type = 0;
    if (action == "Cancel") {
        act = 1;
        p_type = 2;
        $(obj).closest(".pay_req").remove();
    } else if (action == "Reject") {
        act = 2;
        p_type = 1;
        $(obj).closest(".pay_req").remove();
    } else if (action == "Remind") {
        act = 3;
        p_type = 2;
    } else if (action == "Pay") {
        act = 4;
        p_type = 1;
        $(obj).closest(".pay_req").remove();
    }
    // console.log(action, data, t_id, ref_id, par_upi, upi, custId, amt, act, p_type);
    var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getReqPay";
    $.ajax({
        type: "POST",
        url: url,
        data: {
            customerId: custId,
            customerUpiAddress: upi,
            device: "hello",
            transactionId: t_id,
            referenceId: ref_id,
            action: act,
            partnerUpiAddress: par_upi,
            amount: amt,
            currencyType: "ruppee",
            paymentType: p_type,
            description: "for date 24-dec-2020",
        },
        dataType: "json",
        success: function(json) {
            var txn_id = json["transactionId"];
            var ref_id = json["referenceId"];
            var resp = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>  <ns2:RespPay  xmlns:ns2="http://npci.org/upi/schema/"  xmlns:ns3="http://npci.org/cm/schema/">  <Head ver="2.0" ts="2018-02-17T13:50:48+05:30" orgId="NPCI" msgId="1GRDpegBbA5wfsdnypyf"/>  <Txn id="" note="testpay" refId="804813039157" refUrl="http://axis.com/upi" ts="2018-02-17T13:39:54.944+05:30" type="PAY" custRef="804813039157" initiationMode="00">  <RiskScores>  <Score provider="NPCI" type="TXNRISK" value="00995"/>  </RiskScores>  </Txn>  <Resp reqMsgId="OBNc2ed455b797e4add8392110cfc528acc" result="SUCCESS" actn="">  <Ref type="PAYER" seqNum="1" addr="vibhore@oneybl" settAmount="200" settCurrency="INR" approvalNum="169353" respCode="00" regName="Vibhore" orgAmount="200" acNum="058010100083000" IFSC="ICIC0000058" code="0000"/>  <Ref type="PAYEE" seqNum="1" addr="Manindersingh@ybl" settAmount="2.00" settCurrency="INR" approvalNum="959826" respCode="00" regName="Maninder" orgAmount="200"  acNum="910010050136217" IFSC="BKID0000004" code="0000" />  </Resp>  </ns2:RespPay>';
            var url1 = "https://dev.onebanc.ai/uiservices/upi.asmx/getRespPay";
            $.ajax({
                type: "POST",
                url: url1,
                data: {
                    transactionId: txn_id,
                    referenceId: ref_id,
                    respPay: resp,
                },
                dataType: "json",
                success: function(json) {
                    console.log(json);
                }
            })
        }
    });
}