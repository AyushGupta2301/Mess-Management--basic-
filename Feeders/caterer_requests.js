$(function () {
    // alert('document loaded');
    $("#dishsubmit").on("click", function () {
        var dishes = document.getElementsByName('dishes');
        let req = [];
        let message = "Today's Menu : \n"

        for (i = 0; i < dishes.length; i++) {
            if (dishes[i].value == "") {
                alert("Fields Shouldn't be empty");
                return;
            }
            message += "<b><i>" + dishes[i].value + "</i></b>\n";
            // alert(message);
            req.push(dishes[i].value);
        }
        message += "Please post your attendance on our Website\n";
        req.push("0");
        $.ajax('http://127.0.0.1:8081/menu_enter', {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            data: JSON.stringify(req),
            statusCode: {
                200: function (resp, status) {
                    alert(resp);
                    document.getElementById('buttonbar').innerHTML = "<h2> Menu has been Set successfully</h2>";
                }
            }
        });
        let paramperson = { 'chat_id': '1158109698', 'text': message, 'parse_mode': 'HTML' }
        $.post('https://api.telegram.org/bot2133097358:AAFLewQeNHQysJS6sOIJ0L1ZMRuSX-rNTc8/sendMessage', paramperson, function (returnedData) {
            console.log(returnedData);
        });

    });
    $('#fetchb').on("click", function () {
        $.ajax('http://127.0.0.1:8081/menu_get', {
            method: "POST",
            data: JSON.stringify({
                "data": "none"
            }),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                200: function (resp, status) {
                    let menlst = resp;
                    let menu_list = [];
                    let menu = document.getElementById('menu');
                    menu.innerHTML = "";
                    for (i = 0; i < menlst.length; i++) {
                        menu_list.push(menlst[i].item);
                        menu.innerHTML += "<h4> <i class='fa fa-angle-double-right'></i>  " + menlst[i].item + "</h4>";
                    }

                }
            }
        })

        $.ajax('http://127.0.0.1:8081/fetch_atten', {
            method: "POST",
            data: JSON.stringify({
                "data": "none"
            }),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                200: function (resp, status) {
                    var numstu = 0;
                    for (i = 0; i < resp.length; i++) {
                        if (resp[i].tenAtten == 1) numstu++;
                    }
                    let atten = document.getElementById('tenAtten');
                    atten.innerHTML = numstu + "/500"
                    $.ajax('http://127.0.0.1:8081/fetch_amt', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify({
                            "data": "none"
                        }),
                        statusCode: {
                            200: function (resp, status) {
                                let ingrlst = resp;
                                var finingre = {};
                                let ingredi = document.getElementById('ingredients');
                                for (i = 0; i < ingrlst.length; i++) {
                                    din = ingrlst[i].ingredients;
                                    for (j in din) {
                                        if (finingre[j] == undefined) {
                                            finingre[j] = numstu * din[j];
                                        }
                                        else {
                                            finingre[j] += numstu * din[j];
                                        }
                                    }
                                }
                                ingredi.innerHTML = "";
                                for (i in finingre) {
                                    ingredi.innerHTML += "<h4> <i class='fa fa-align-left'></i> " + i + " ---> " + finingre[i] + " grams </h4>"
                                }
                            }
                        }
                    })


                }
            }
        })
    })
    $('#stsess').on("click", function () {
        setInterval(function () {
            $.ajax('http://127.0.0.1:8081/fetch_atten', {
                method: "POST",
                data: JSON.stringify({
                    "data": "none"
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                statusCode: {
                    200: function (resp, status) {
                        var temp = resp;
                        var numstua = 0;
                        var numstut = 0;
                        for (i = 0; i < resp.length; i++) {
                            if (resp[i].tenAtten == 1) numstut++;
                            if (resp[i].tenAtten == 1 && resp[i].actAtten == 1) numstua++;
                            if (resp[i].spAtten==1){
                                document.getElementById('avspAtten').innerHTML = resp[i].studID + "<br>";
                            }
                            if (resp[i].tenAtten == 0 && resp[i].actAtten == 1); 
                        }
                        document.getElementById('actAtten').innerHTML = numstua;
                        document.getElementById('tenAttens').innerHTML = numstut;



                    }
                }
            });
            $.ajax('http://127.0.0.1:8081/sub_gen', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "type": "fetchSubsT"
                }),
                statusCode: {
                    200: function (resp1, status) {
                        document.getElementById("spAtten").innerHTML = "";
                        if(resp1.length==0){
                            document.getElementById('spAtten').innerHTML = "none";
                            return;
                        }
                        let new_table = document.createElement('table');
                        new_table.className = "tspAtten";
                        new_table.innerHTML = "<tr><th> S.No. </th><th> Substitution From </th><th> Substitution To </th></tr>";
                        for (i = 0; i < resp1.length; i++) {
                            // let new_row = document.createElement('tr');
                            new_table.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + resp1[i].emitID + "</td><td>" + resp1[i].recvID + "</td></tr>";
                            // penal_table.append(new_row);
                        }
                        document.getElementById('spAtten').append(new_table);
                    }
                }
            });
        }, 5000)
        //here substitution will come
    })
    $("#endsess").on("click", function () {
        $.ajax('http://127.0.0.1:8081/fetch_atten', {
            method: "POST",
            data: JSON.stringify({
                "data": "none"
            }),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                200: function (resp, status) {
                    var numstu = 0;
                    for (i = 0; i < resp.length; i++) {
                        if (resp[i].tenAtten == 1 && resp[i].actAtten == 0) {
                            $.ajax('http://127.0.0.1:8081/penal_action', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                data: JSON.stringify({
                                    "studID": resp[i].studID,
                                    "type": "put"
                                }),
                                statusCode: {
                                    200: function (mresp, status) {
                                        console.log(mresp.studID);
                                    }
                                }
                            })
                        }
                    }
                }
            }
        })
    })
    $('#finsubmit').on("click",function(){
        alert("logs recorded");
    })
})