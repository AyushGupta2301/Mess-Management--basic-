$(function(){
    $('#mainformsubmit').on("click",function(){
        let sid = document.getElementsByName('studID')[0].value;
        $.ajax('http://127.0.0.1:8081/atten_put',{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            data: JSON.stringify({
                "studID": sid,
                "attentype": "actAttensp",
                "value":1
            }),
            statusCode:{
                200: function(resp,status){
                    alert("Attendance Updated");
                }
            }
        })
    });
})