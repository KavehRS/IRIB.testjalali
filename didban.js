/****************************************************************
 PROGRAM:   Didban Lib
 AUTHOR:    Kaveh Rezaei Shiraz
 LOGON ID :    kavehrs
 DUE DATE:  11/14/2020
 Version : 2.0.5 for test
 FUNCTION:  Get Data From Cleint side and send for IRIB Analytic Server
 INPUT:     ACTIVITY, SERVICE_TYPE, CONTENT_TYPE
 ****************************************************************/


// Nourozzadeh api
var url = "http://192.168.200.35:8000/api/",
    auth_token = "Token 2156356dfa66dfd64b60ca2992509ada", sys_id = "iribcsspr99", system_id;
var user_id, active_session, ip, session_id, ttl = 30, ttl = 30, counter = ttl;





var ACTIVITY = {Play: 1, Pause: 2, FDStart: 3, FDEnd: 4, BDStart: 5, BDEnd: 6, ContentView: 7,};
var SERVICE_TYPE = {Live: 1, TimeShift: 2, CatchUp: 3, OnDemand: 4,};
var CONTENT_TYPE = {Video: 1, Audio: 2, Image: 3, Text: 4,};

function getUserIP(onNewIP) {
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function () {
        },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;
    ipFound = false;

    function iterateIP(ip) {
        if (!localIPs[ip] && ip != '0.0.0.0') onNewIP(ip);
        ipFound = true;
    }


    pc.createDataChannel("");

    pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (ipFound) exit;
            if (line.indexOf('IP4') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function (reason) {
    });


    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}


if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}


function getCookie(name) {
    name = name + "=";
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

//function setCookie(key, value);
//{
  //  if (!value) {
     //   document.cookie = "{0}=;.format(key);
       // return;
    //}

    //var dt = new Date();
    //dt.setMinutes(dt.getMinutes() + timeout);
    //document.cookie = "{0}={1}; expires=".format(key, value, dt.toUTCString());
//}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


function create_SID() {
    var dt = new Date().getTime();
    var sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return sid;
}

getUserIP(function (_ip) {
    ip = _ip;
});

sessionFactory = {

    check: function () {
        var token = getCookie('token');
        if (token) {
            active_session = token;
            console.log("Session is already opened. Token {0}".format(token));
        } else {
            sessionFactory.init(user_id);
        }
        return true;
    },

    init: function (_user_id) {
        if (!ip) {
            setTimeout(function () {
                if (counter-- == 0) {
                    counter = ttl;
                    return;
                }
                sessionFactory.init(user_id);
            }, 1000);
            return;
        }

        var token = getCookie('token');
        if (user_id == _user_id && token) {
            setCookie('token', token);
            return;
        }
        sys_is = system_id
        user_id = _user_id != null ? _user_id : create_UUID();
        session_id = session_id != null ? session_id : create_SID();
        user_agent = navigator.userAgent;
        referer = document.location.origin;
        //document.getElementById("url").textContent = document.URL;    
        xReferer = document.URL;
        var data = '{"sys_id": "{0}", "user_id": "{1}", "session_id": "{2}", "ip": "{3}","user_agent": "{4}", "referer": "{5}", "xReferer": "{6}"}'.format(sys_id, user_id, session_id, ip, user_agent, referer, xReferer)
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "{0}session/".format(url), true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader('Authorization', auth_token);
        xmlhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 201) {
                setCookie('token', JSON.parse(this.responseText).id);
                console.log("Success: {0}: {1}".format(this.status, this.responseText));
            } else {
                console.log("Error: {0}: {1}".format(this.status, this.responseText));
            }
        };
        xmlhttp.send(data);
        return true;
    },

    expire: function () {
        var token = getCookie('token');

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("PATCH", "{0}session/{1}/".format(url, token), true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader('Authorization', auth_token);
        xmlhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                setCookie('token', null);
                console.log("Success: {0}: {1}".format(this.status, this.responseText));
                user_id = null;
            } else {
                console.log("Error: {0}: {1}".format(this.status, this.responseText));
            }
        };
        xmlhttp.send();
        return true;
    }
}

activityFactory = {
    log: function (session_id, channel_id, content_id, content_type_id, service_id, action_id, time_code) {
        sessionFactory.check();
        var token = getCookie('token');
        var data = '{"session_id": "{0}", "channel_id": "{1}", "content_id": "{2}","content_type_id": "{3}", "service_id": "{4}","action_id": "{5}", "time_code": "{6}"}'.format(
            token, session_id, channel_id, content_id, content_type_id, service_id, action_id, time_code);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "{0}event/".format(url), true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader('Authorization', auth_token);
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                setCookie('token', session_id);
                console.log("token {0} did activity {1}".format(token, action_id));
            } else {

                console.log("Activity logging failed.")
            };
        };
        xmlhttp.send(data);
        return true;
    }
}
