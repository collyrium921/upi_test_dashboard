$(document).ready(function () {
    $("#customer").change(function () {

        var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getTransactionHistory";
        var custId = $(this).val();
        // console.log(custId);
        $.ajax({
            type: "POST",
            url: url,
            data: { customerId: custId },
            dataType: "json",
            success: function (json) {
                // console.log(json);

                $(".transaction_history").find(".txn_history").remove();
                // $(".button").find("#balance").remove();

                for (var i = 0; i < json["transactions"].length; i++) {
                    var txn = json["transactions"][i];
                    var desc = txn["description"];
                    var upiAdd = txn["partnerUpiAddress"];
                    var amount = txn["amount"];
                    var date = txn["lastUpdatedOn"];
                    var type = txn["type"];
                    var dir = txn["direction"];
                    var status = txn["status"];
                    var $txn_clone = $("#template").find(".txn_history").clone();
                    $txn_clone.find(".desc").text(desc).end();
                    // $txn_clone.find(".amt").text("Amount: ₹"+amount).end();
                    $txn_clone.find(".acc_no").text(upiAdd).end();
                    $txn_clone.find(".date").text(date).end();
                    if (type == 1) {
                        if (dir == 1) {
                            if (status == 1) {
                                $txn_clone.find(".amt_pending").text("₹" + amount).end();
                                $txn_clone.find(".action_pending").text("Payment pending").end();
                            } else if (status == 2) {
                                $txn_clone.find(".amt_received").text("-₹" + amount).end();
                                $txn_clone.find(".action_success").text("Paid").end();
                            } else if (status == 3) {
                                $txn_clone.find(".amt_pending").text("₹" + amount).end();
                                $txn_clone.find(".action_failed").text("Payment failed").end();
                            }
                        } else {
                            if (status == 1) {
                                $txn_clone.find(".amt_pending").text("₹" + amount).end();
                                $txn_clone.find(".action_pending").text("Payment pending").end();
                            } else if (status == 2) {
                                $txn_clone.find(".amt_paid").text("+₹" + amount).end();
                                $txn_clone.find(".action_success").text("Payment Received").end();
                            } else if (status == 3) {
                                $txn_clone.find(".amt_pending").text("₹" + amount).end();
                                $txn_clone.find(".action_failed").text("Payment failed").end();
                            }
                        }
                    } else {
                        if (dir == 1) {
                            if (status == 1) {
                                $txn_clone.find(".amt_pending").text("₹" + amount).end();
                                $txn_clone.find(".action_pending").text("Payment not received yet").end();
                            } else if (status == 2) {
                                $txn_clone.find(".amt_received").text("+₹" + amount).end();
                                $txn_clone.find(".action_success").text("Payment Received").end();
                            } else if (status == 3) {
                                $txn_clone.find(".amt_pending").text("₹" + amount).end();
                                $txn_clone.find(".action_failed").text("Payment failed").end();
                            }
                        } else {
                            if (status == 1) {
                                $txn_clone.find(".amt_pending").text("₹" + amount).end();
                                $txn_clone.find(".action_pending").text("Payment pending").end();
                            } else if (status == 2) {
                                $txn_clone.find(".amt_paid").text("-₹" + amount).end();
                                $txn_clone.find(".action_success").text("Paid amount").end();
                            } else if (status == 3) {
                                $txn_clone.find(".amt_pending").text("₹" + amount).end();
                                $txn_clone.find(".action_failed").text("Payment failed").end();
                            }
                        }
                    }
                    $txn_clone.data(json["transactions"][i]);
                    // console.log(json["transactions"][i])

                    $(".transaction_history").append($txn_clone);
                }
            }
        });

        var url_p = "https://dev.onebanc.ai/uiservices/upi.asmx/getPendingTransactions";
        // console.log(custId);
        $.ajax({
            type: "POST",
            url: url_p,
            data: { customerId: custId },
            dataType: "json",
            success: function (json) {
                // console.log(json);
                $(".sent").find(".pay_req").remove();
                $(".receive").find(".pay_req").remove();
                for (var i = 0; i < json["transactions"].length; i++) {
                    var txn = json["transactions"][i];
                    var desc = txn["description"];
                    var upiName = txn["partnerUpiName"];
                    var amount = txn["amount"];
                    var f_amount = inrFormat(amount);
                    var date = txn["lastUpdatedOn"];
                    var type = txn["type"];
                    var dir = txn["direction"];
                    var status = txn["status"];
                    var $req_clone = $("#template").find(".pay_req").clone();
                    // console.log(txn);
                    $req_clone.find(".desc").text(desc).end();
                    $req_clone.find(".amt_paid").text("₹" + f_amount).end();
                    $req_clone.find(".date").text(date).end();
                    $req_clone.find(".upi").text(upiName).end();
                    $req_clone.data(json["transactions"][i]);
                    if (type == 2) {
                        if (dir == 1) {
                            $req_clone.find(".remind").text("Remind").end();
                            $req_clone.find(".cancel").text("Cancel").end();
                            $(".sent").append($req_clone);
                        } else {
                            $req_clone.find(".pay").text("Pay").end();
                            $req_clone.find(".reject").text("Reject").end();
                            $(".receive").append($req_clone);
                        }
                    }

                }
            }
        });

        var url1 = "https://dev.onebanc.ai/uiservices/upi.asmx/getCustomerInformation";
        $.ajax({
            type: "POST",
            url: url1,
            data: { customerId: custId },
            dataType: "json",
            success: function (json) {
                var s = '<option value="0">-Select-</option>';
                for (var i = 0; i < json["customerAccountInfo"].length; i++) {
                    s += '<option>' + json["customerAccountInfo"][i]["upiAddress"] + '</option>';
                }
                $("#sender").html(s);
                // console.log(json);
                $("#sender").change(function () {
                    var id = $(this).val();
                    // console.log(id);
                })
            }
        })

        var url2 = "https://dev.onebanc.ai/uiservices/upi.asmx/getSuggestedContacts";
        $.ajax({
            type: "POST",
            url: url2,
            data: { customerId: custId },
            dataType: "json",
            success: function (json) {
                var s = '<option value="0">-Select-</option>';
                for (var i = 0; i < json["suggestedContacts"].length; i++) {
                    s += '<option>' + json["suggestedContacts"][i]["upiAddress"] + '</option>';
                }
                $("#receiver").html(s);
                // console.log(json);
                $("#receiver").change(function () {
                    var id = $(this).val();
                    // console.log(id);
                })
            }
        })

        $("#option").change(function () {
            var id = $(this).val();
            // console.log(id);
        })
    });
});

function amount_validate(event) {
    var x = event.which || event.keyCode;
    if (x < 48 || x > 57) {
        event.preventDefault();
    }
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

$('input.Stylednumber').keyup(function () {
    var input = $(this).val().replaceAll(',', '');
    if (input.length < 1)
        $(this).val('');
    else {
        var val = parseFloat(input);
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

function check_bal() {
    var custId = $("#customer").val();
    var upi = $("#sender").val();
    // console.log(custId, upi);
    var url = "https://dev.onebanc.ai/uiservices/upi.asmx/checkBalance";
    $.ajax({
        type: "POST",
        url: url,
        data: {
            customerId: custId,
            upiAddress: upi
        },
        dataType: "json",
        success: function (json) {
            var bal = json["balance"];
            var f_bal = inrFormat(bal);
            document.getElementById("balance").innerHTML = "₹" + f_bal;
        }
    })
}

function pay(id) {

    var custId = $("#customer").val();
    var upi = $("#sender").val();
    var par_upi = $("#receiver").val();
    var amt = $("#amount").val();
    var p_type = 0;
    if (id == 1) {
        p_type = 1;
    } else {
        p_type = 2;
    }
    var data = {
        customerId: custId,
        customerUpiAddress: upi,
        device: "hello",
        partnerUpiAddress: par_upi,
        amount: amt,
        currencyType: "ruppee",
        paymentType: p_type,
        description: "for date 26-dec-2020",
    }
    // if(obj!=null){
    //     var action=$(obj).text();
    //     var objectdata=$(obj).closest(".pay_req");
    //     data["action"]=action;
    //     data["transactionId"]=objectdata["transactionId"];
    //     // data["paymentType"]=2;
    // }
    var url = "https://dev.onebanc.ai/uiservices/upi.asmx/getReqPay";
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        success: function (json) {
            // console.log(json);
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
                success: function (json) {
                    // console.log(json);

                }
            })
        }
    })
}

function fun(obj) {
    var action = $(obj).text();
    var data = $(obj).closest(".pay_req").data();
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
        $(obj).closest(".pay_req").remove();
    } else if (action == "Reject") {
        act = 2;
        $(obj).closest(".pay_req").remove();
    } else if (action == "Remind") {
        act = 3;
        p_type = 2;
    } else if (action == "Pay") {
        act = 4;
        p_type = 1;
        $(obj).closest(".pay_req").remove();
    }
    console.log(action, data, t_id, ref_id, par_upi, upi, custId, amt, act, p_type);
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
        success: function (json) {
            console.log(json);
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
                success: function (json) {
                    console.log(json);
                    var url_p = "https://dev.onebanc.ai/uiservices/upi.asmx/getPendingTransactions";
                    $.ajax({
                        type: "POST",
                        url: url_p,
                        data: { customerId: json["transaction"]["customerId"], },
                        dataType: "json",
                        success: function (json) {
                            console.log(json);
                            for (var i = 0; i < json["transactions"].length; i++) {
                                if (json["transactions"][i]["transactionId"] == custId) {
                                    console.log(json["transactions"][i])
                                    var txn = json["transactions"][i];
                                    var desc = txn["description"];
                                    var upiName = txn["partnerUpiName"];
                                    var amount = txn["amount"];
                                    var f_amount = inrFormat(amount);
                                    var date = txn["lastUpdatedOn"];
                                    var type = txn["type"];
                                    var dir = txn["direction"];
                                    var status = txn["status"];
                                    var $req_clone = $("#template").find(".pay_req").clone();
                                    // console.log(txn);
                                    $req_clone.find(".desc").text(desc).end();
                                    $req_clone.find(".amt_paid").text("₹" + f_amount).end();
                                    $req_clone.find(".date").text(date).end();
                                    $req_clone.find(".upi").text(upiName).end();
                                    $req_clone.data(json["transactions"][i]);
                                    if (type == 2) {
                                        if (dir == 1) {
                                            $req_clone.find(".remind").text("Remind").end();
                                            $req_clone.find(".cancel").text("Cancel").end();
                                            $(".sent").append($req_clone);
                                        } else {
                                            $req_clone.find(".pay").text("Pay").end();
                                            $req_clone.find(".reject").text("Reject").end();
                                            $(".receive").append($req_clone);
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            })
        }
    });
}