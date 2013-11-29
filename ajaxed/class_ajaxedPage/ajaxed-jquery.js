/*
    ajaxed-jquery.js
    2013-11-27 17:30
    version 2.1.2  - Damien MATHIEU <damsfx#gmail.com>
    

    based on HappyJack's script.
        happyjake#gmail.com - http://code.google.com/p/ajaxed-jquery-edition/   

    requirement:
        jQuery 1.9.1 + jQuery Form Plugin (both minified version compiled in /ajaxed/js/jquery.js)
        DO NOT include prototype.js


    Licensed under the Lesser GNU (LGPL) open source license version 2.1.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    ajaxed is a good libary for the good old asp.

    This file is a client side code for ajaxed.
*/

function ajaxed() {};

ajaxed.prototype.indicator = document.createElement('div');

$(document).ajaxStart(function(){ 
    s = ajaxed.prototype.indicator.style;
    s.background = "#cc0000";
    s.color = "#fff";
    s.position = "absolute";
    s.right = "4px";
    s.top = "4px";
    document.body.appendChild(ajaxed.prototype.indicator);
});

$(document).ajaxStop(function(){ 
    document.body.removeChild(ajaxed.prototype.indicator);
});

//optional: onComplete, url (because of bug in iis5 http://support.microsoft.com/kb/216493)
ajaxed.callback = function(theAction, func, params, formid) { 

    if (params) {
		params=jQuery.extend({}, params, {PageAjaxed: theAction});
    } else {
		if ($('#' + formid).length) {
			params = $('#' + formid).formSerialize() + "&PageAjaxed=" + theAction;
		} else {
			if ($('#frm').length) {
				params = $('#frm').formSerialize() + "&PageAjaxed=" + theAction;
			} else {
				params = {};
			}
		}
    }

    uri = window.location.href;

    uri = window.location.href.replace(/#.*$/ig, '');
	if (ajaxed.prototype.debug) ajaxed.debug("Action (to be handled in callback):\n\n" + theAction);
    if (ajaxed.prototype.debug) ajaxed.debug("URL called:\n\n" + uri);
    if (ajaxed.prototype.debug) ajaxed.debug("Params passed to xhr:\n\n" + params);
    $.post( uri, 
        //{ name: "John", time: "2pm" }, 
        params,
        function(data, status, trans){
            if (ajaxed.prototype.debug) ajaxed.debug("Response on callback:\n\n" + data);
            if (!trans.responseText.startsWith('{ "root":') && 
                    !trans.responseText.startsWith('pagePart:')) {
                ajaxed.callbackFailure(trans);
            } else if (trans.responseText.startsWith('pagePart:')) {
                var content = trans.responseText.replace(/^pagePart:/g, '');
                if (typeof func == "string") return $('#'+func).html(content);
                if (func) func(content);
            } else {
                if (func) func($.parseJSON(data).root);
            }
        },
        "text"
    ).fail(function(trans, textStatus, errorThrown) {
        alert( "error whith ajax request\n\n" );
    });
}
ajaxed.callbackFailure = function(data) {
    friendlyMsg = data;
    friendlyMsg = friendlyMsg.replace(new RegExp("(<head[\\s\\S]*?</head>)|(<script[\\s\\S]*?</script>)", "gi"), "");
    friendlyMsg = friendlyMsg.replace(new RegExp("/<\/?[^>]+>/gi"), '');
    friendlyMsg = friendlyMsg.replace(new RegExp("[\\s]+", "gi"), " ");
    alert(friendlyMsg);
}
ajaxed.debug = function(msg){
    if(window.console){
        console.log(msg);
    }else{
        alert("<DEBUG MESSAGE>\n\n" + msg);
    };
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}