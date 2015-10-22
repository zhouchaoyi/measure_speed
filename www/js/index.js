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
}, false);

$("#set_speed").click(function(){
	$.mobile.changePage("#detail",{transition: "slide"});
});
