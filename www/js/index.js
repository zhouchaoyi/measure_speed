var TIME=30*1000; //间隔时间
var HOUR_TIME=TIME/(3600*1000);
var EARTH_RADIUS = 6378.137;//地球半径
var prevLocation=null;

document.addEventListener('deviceready', function () {
    if (navigator.notification) { // Override default HTML alert with native dialog
        window.alert = function (message) {
            navigator.notification.alert(
                message,    // message
                null,       // callback
                "测速", // title
                'OK'        // buttonName
            );
        };
    }
    var noop = function(){}
    window.locationService.getCurrentPosition(function(pos){
        prevLocation={};
        prevLocation.latitude=pos.coords.latitude;
        prevLocation.longitude=pos.coords.longitude;
        //alert(JSON.stringify(prevLocation));
        window.locationService.stop(noop,noop);
    },function(e){
        alert(JSON.stringify(e))
        window.locationService.stop(noop,noop)
    });    
    setInterval("measureSpeed()",TIME);
    
}, false);

function measureSpeed() {
    var noop = function(){}
    window.locationService.getCurrentPosition(function(pos){
        var speed=GetSpeed(prevLocation.latitude,prevLocation.longitude,pos.coords.latitude,pos.coords.longitude,HOUR_TIME);
        //alert("prevLocation.latitude="+prevLocation.latitude+"  prevLocation.longitude="+prevLocation.longitude+" pos.latitude="+pos.coords.latitude+" pos.longitude="+pos.coords.longitude+" HOUR_TIME="+HOUR_TIME);
        //alert(speed);
        var highestSpeed=localStorage.getItem("highest_speed");
        if(speed>highestSpeed) { 
            $("#divAlert").css("display","block");
        }else {
            $("#divAlert").css("display","none");
        }
        $("#divCurSpeed").html("当前速度:"+speed+"km/h");
        prevLocation.latitude=pos.coords.latitude;
        prevLocation.longitude=pos.coords.longitude;
        window.locationService.stop(noop,noop);
    },function(e){
        alert(JSON.stringify(e));
        window.locationService.stop(noop,noop);
    });    
}


function rad(d)
{
   return d * Math.PI / 180.0;
}

function GetSpeed(lat1,lng1,lat2,lng2,time)
{
   var radLat1 = rad(lat1);
   var radLat2 = rad(lat2);
   var a = radLat1 - radLat2;
   var b = rad(lng1) - rad(lng2);

   var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
   s = s * EARTH_RADIUS;
   //s = Math.round(s * 10000) / 10000;
   //return s;
   var speed=Math.round(s/time * 10000) / 10000;
   return speed;
}

document.addEventListener("backbutton", function() {
    $.mobile.changePage("#index",{transition: "slide"});
}, false);

$(document).on("pageinit",function(event){
    var highestSpeed=localStorage.getItem("highest_speed");
    if(highestSpeed!=null) {
        $("#divHighSpeed").html("设置的最高速度:"+highestSpeed+"km/h");
        $("#divHighSpeed").css("display","block");
        $("#highest_speed").val(highestSpeed);
    }
});

$("#set_speed").click(function(){
	$.mobile.changePage("#detail",{transition: "slide"});
});

$("#saveBtn").click(function(){
    if($("#highest_speed").val()=="") {
        alert("请填写最高速度");
        return;
    }
    localStorage.setItem("highest_speed",$("#highest_speed").val());
    $("#divHighSpeed").html("设置的最高速度:"+$("#highest_speed").val()+"km/h");
    $("#divHighSpeed").css("display","block");
    $("#divAlert").css("display","none");
    $.mobile.changePage("#index",{transition: "slide"});
});





