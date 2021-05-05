
var url = "http://192.168.143.18:8876/api/",
    auth_token = "Bearer DE9C3CFBF147067970C4CAC7F3874247", sys_id = "iribcsspr99", system_id;
var user_id, active_session, ip, session_id, ttl = 30, counter = ttl;



var ACTIVITY = {Play: 1, Pause: 2, FDStart: 3, FDEnd: 4, BDStart: 5, BDEnd: 6, ContentView: 7,};
var SERVICE_TYPE = {Live: 1, TimeShift: 2, CatchUp: 3, OnDemand: 4,};
var CONTENT_TYPE = {Video: 1, Audio: 2, Image: 3, Text: 4,};

function getUserIP(onNewIP) {
    var pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({iceServers: []}),
        // var pc = new myPeerConnection({
        //         iceServers: []
        //     }),
        noop = function () {
        },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
    // key;
    // ipFound = false;

    function iterateIP(ip) {
        localIPs[ip] || "0.0.0.0" == ip || onNewIP(ip), ipFound = !0
        // if (!localIPs[ip] && ip != '0.0.0.0') onNewIP(ip);
        // ipFound = true;
    }

    ipFound = !1,

        pc.createDataChannel(""),

        pc.createOffer().then(function (onNewIP) {
            onNewIP.sdp.split('\n').forEach(function (onNewIP) {
                ipFound && exit, onNewIP.indexOf("IP4") < 0 || onNewIP.match(ipRegex).forEach(iterateIP)
            }), ip.setLocalDescription(onNewIP, noop, noop)
        }).catch(function (onNewIP) {
        }), ip.onicecandidate = function (onNewIP) {
        onNewIP && onNewIP.candidate && onNewIP.candidate.candidate && onNewIP.candidate.candidate.match(ipRegex) && onNewIP.candidate.candidate.match(ipRegex).forEach(iterateIP)

    }
}



function getCookie(name) {
    name += "=";
    for (var decodedCookie = decodeURIComponent(document.cookie).split(";"), n = 0; n < decodedCookie.length; n++) {
        for (var o = decodedCookie[n]; " " == o.charAt(0);) o = o.substring(1);
        if (0 == o.indexOf(name)) return o.substring(name.length, o.length)
    }
    return ""
}


function setCookie(key, value) {
    if (value) {
        var dt = new Date;
        dt.setMinutes(dt.getMinutes() + timeout), document.cookie = "{0}={1}; expires={2}".format(key, value, n.toUTCString())
    } else document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key)
}



// function setCookie(key, value);
// {
//     if (!value) {
//         document.cookie = "{0}=;.format(key);
//         return;
//     }
//
//     var dt = new Date();
//     dt.setMinutes(dt.getMinutes() + timeout);
//     document.cookie = "{0}={1}; expires=".format(key, value, dt.toUTCString());
// }

// function create_UUID() {
//     var dt = new Date().getTime();
//     var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = (dt + Math.random() * 16) % 16 | 0;
//         dt = Math.floor(dt / 16);
//         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//     });
//     return uuid;
// }


function create_UUID() {
    var dt = (new Date).getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (dt + 16 * Math.random()) % 16 | 0;
        return dt = Math.floor(dt / 16), ("x" == c ? r : 3 & r | 8).toString(16)
    })
}

String.prototype.format || (String.prototype.format = function () {
    var dt = arguments;
    return this.replace(/{(\d+)}/g, function (c, r) {
        return void 0 !== dt[r] ? dt[r] : c
    })
}),
// function create_SID() {
//     var dt = (new Date).getTime();
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//         var r = (dt + 16 * Math.random()) % 16 | 0;
//         return dt = Math.floor(dt / 16), ("x" == c ? r : 3 & r | 8).toString(16)
//     })
// }


// function create_SID() {
//     var dt = new Date().getTime();
//     var sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = (dt + Math.random() * 16) % 16 | 0;
//         dt = Math.floor(dt / 16);
//         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//     });
//     return sid;
// }

getUserIP(function (_ip) {
    ip = _ip;
}), sessionFactory = {
    check: function () {
        var e = getCookie("token");
        return e ? (active_session = e, console.log("Session is already opened. Token {0}".format(e))) : sessionFactory.init(user_id), !0
    }, init: function (e) {
        if (ip) {
            var t = getCookie("token");
            if (user_id != e || !t) {
                t = create_UUID();
                user_id = null != token ? token : t, setCookie("token", t), user_agent = navigator.userAgent, referer = document.location.origin, xReferer = document.location.origin;
                var n = '{"sys_id": "{0}", "user_id": "{1}", "session_id": "{2}", "ip": "{3}","user_agent": "{4}", "referer": "{5}", "xReferer": "{6}"}'.format(system_id, user_id, t, ip, user_agent, referer, xReferer),
                    o = new XMLHttpRequest;
                return o.open("POST", "{0}session/".format(url), !0), o.setRequestHeader("Content-Type", "application/json"), o.setRequestHeader("Authorization", auth_token), o.onreadystatechange = function () {
                    4 == this.readyState && 201 == this.status ? console.log("Success: {0}: {1}".format(this.status, this.responseText)) : console.log("Error: {0}: {1}".format(this.status, this.responseText))
                }, o.send(n), !0
            }
            setCookie("token", t)
        } else setTimeout(function () {
            0 != counter-- ? sessionFactory.init(user_id) : counter = ttl
        }, 1e3)
    }, expire: function () {
        return setCookie("token", null), user_id = null, !0
    }
}, activityFactory = {
    log: function (e, t, n, o, i, r) {
        sessionFactory.check();
        var a = getCookie("token"),
            s = '{"session_id": "{0}", "channel_id": "{1}", "content_id": "{2}","content_type_id": "{3}", "service_id": "{4}","action_id": "{5}", "time_code": "{6}"}'.format(a, e, t, n, o, i, r),
            c = new XMLHttpRequest;
        return c.open("POST", "{0}event/".format(url), !0), c.setRequestHeader("Content-Type", "application/json"), c.setRequestHeader("Authorization", auth_token), c.onreadystatechange = function () {
            4 == this.readyState && 201 == this.status ? (setCookie("token", a), console.log("Token {0} did activity {1}".format(a, i))) : console.log("Activity logging failed.")
        }, c.send(s), !0
    }
};

// sessionFactory = {
//
//     check: function () {
//         var token = getCookie('token');
//         if (token) {
//             active_session = token;
//             console.log("Session is already opened. Token {0}".format(token));
//         } else {
//             sessionFactory.init(user_id);
//         }
//         return true;
//     },
//
//     init: function (_user_id) {
//         if (!ip) {
//             setTimeout(function () {
//                 if (counter-- == 0) {
//                     counter = ttl;
//                     return;
//                 }
//                 sessionFactory.init(user_id);
//             }, 1000);
//             return;
//         }
//
//         var token = getCookie('token');
//         if (user_id == _user_id && token) {
//             setCookie('token', token);
//             return;
//         }
//         sys_is = system_id
//         user_id = _user_id != null ? _user_id : create_UUID();
//         session_id = session_id != null ? session_id : create_SID();
//         user_agent = navigator.userAgent;
//         referer = document.location.origin;
//         //document.getElementById("url").textContent = document.URL;
//         xReferer = document.URL;
//         var data = '{"sys_id": "{0}", "user_id": "{1}", "session_id": "{2}", "ip": "{3}","user_agent": "{4}", "referer": "{5}", "xReferer": "{6}"}'.format(sys_id, user_id, session_id, ip, user_agent, referer, xReferer)
//         var xmlhttp = new XMLHttpRequest();
//         xmlhttp.open("POST", "{0}session/".format(url), true);
//         xmlhttp.setRequestHeader("Content-Type", "application/json");
//         xmlhttp.setRequestHeader('Authorization', auth_token);
//         xmlhttp.onreadystatechange = function (data) {
//             if (this.readyState == 4 && this.status == 201) {
//                 setCookie('token', JSON.parse(this.responseText).id);
//                 console.log("Success: {0}: {1}".format(this.status, this.responseText));
//             } else {
//                 console.log("Error: {0}: {1}".format(this.status, this.responseText));
//             }
//         };
//         xmlhttp.send(data);
//         return true;
//     },
//
//     expire: function () {
//         var token = getCookie('token');
//
//         var xmlhttp = new XMLHttpRequest();
//         xmlhttp.open("PATCH", "{0}session/{1}/".format(url, token), true);
//         xmlhttp.setRequestHeader("Content-Type", "application/json");
//         xmlhttp.setRequestHeader('Authorization', auth_token);
//         xmlhttp.onreadystatechange = function (data) {
//             if (this.readyState == 4 && this.status == 200) {
//                 setCookie('token', null);
//                 console.log("Success: {0}: {1}".format(this.status, this.responseText));
//                 user_id = null;
//             } else {
//                 console.log("Error: {0}: {1}".format(this.status, this.responseText));
//             }
//         };
//         xmlhttp.send();
//         return true;
//     }
// }
//
// activityFactory = {
//     log: function (session_id, channel_id, content_id, content_type_id, service_id, action_id, time_code) {
//         sessionFactory.check();
//         var token = getCookie('token');
//         var data = '{"session_id": "{0}", "channel_id": "{1}", "content_id": "{2}","content_type_id": "{3}", "service_id": "{4}","action_id": "{5}", "time_code": "{6}"}'.format(
//             token, session_id, channel_id, content_id, content_type_id, service_id, action_id, time_code);
//
//         var xmlhttp = new XMLHttpRequest();
//         xmlhttp.open("POST", "{0}event/".format(url), true);
//         xmlhttp.setRequestHeader("Content-Type", "application/json");
//         xmlhttp.setRequestHeader('Authorization', auth_token);
//         xmlhttp.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 201) {
//                 setCookie('token', session_id);
//                 console.log("token {0} did activity {1}".format(token, action_id));
//             } else {
//
//                 console.log("Activity logging failed.")
//             };
//         };
//         xmlhttp.send(data);
//         return true;
//     }
// }
