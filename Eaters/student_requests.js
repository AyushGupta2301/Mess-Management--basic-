$(function () {
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
                if (resp.length == 0) {
                    let menu = document.getElementById('menu');
                    menu.innerHTML = "<h2> Next Batch Menu Not Set Yet </h2>"
                    document.getElementById('datamain').innerHTML = "";
                    document.getElementById('buttonbar').innerHTML = "";
                    return;
                }
                let menlst = resp;
                let menu_list = [];
                let menu = document.getElementById('menu');
                const d = new Date(menlst[0].inserted_at);
                menu.innerHTML = "<i> Added at : " + d.toString().substring(0, 24) + "</i>";
                for (i = 0; i < menlst.length; i++) {
                    menu_list.push(menlst[i].item);
                    menu.innerHTML += "<h4> <i class='fa fa-angle-double-right'></i>  " + menlst[i].item + "</h4>";
                }

            }
        }
    })
    $('#tenAtten_submit').on("click", function () {
        var sid = document.getElementsByName('studID')[0].value;
        $.ajax('http://127.0.0.1:8081/atten_put', {
            method: "POST",
            data: JSON.stringify({
                "studID": sid,
                "attentype": "tenAtten",
                "value": 1
            }),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                200: function (resp, status) {
                    alert("Attendance Posted Successfully")
                }

            }
        })
    })
    $('#penal_submit').on("click", function () {
        var sid = document.getElementsByName('pstudID')[0].value;
        $.ajax('http://127.0.0.1:8081/penal_action', {
            method: "POST",
            data: JSON.stringify({
                "studID": sid,
                "type": "fetch",
            }),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                200: function (resp1, status) {
                    let penal_table = document.getElementById('tpenalty');
                    if (resp1.length == 0) {
                        document.getElementById("penalty").innerHTML = "<h1> No penalties Found </h1>";
                        return;
                    }
                    else {
                        document.getElementById("penalty").innerHTML = "";
                        let new_table = document.createElement('table');
                        new_table.className = "tpenalty";
                        new_table.innerHTML = "<tr><th> S.No. </th><th> Penalty Amount </th><th> Penalty Date </th></tr>";
                        for (i = 0; i < resp1.length; i++) {
                            // let new_row = document.createElement('tr');
                            new_table.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + resp1[i].Amount + "</td><td>" + resp1[i].Timestamp.substring(0, 24) + "</td></tr>";
                            // penal_table.append(new_row);
                        }
                        document.getElementById('penalty').append(new_table);
                    }
                }

            }
        })
    })
})
