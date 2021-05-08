var active_session, ip, user_id, timeout = 1,url = "http://192.168.115.248:8083/", system_id = "Developer",
    auth_token = "Bearer Lrn90RnJZ+X5nVgQ9cKjrJSpgHTQtkLz3Mw1sX4B7RYnhNdy0Oqp",
    ttl = 30, counter = ttl, ACTIVITY = {Play: 1, Pause: 2, FDStart: 3, FDEnd: 4, BDStart: 5, BDEnd: 6, ContentView: 7},
    SERVICE_TYPE = {Live: 1, TimeShift: 2, CatchUp: 3, OnDemand: 4},
    CONTENT_TYPE = {Video: 1, Audio: 2, Image: 3, Text: 4};

// function getUserIP(onNewIP) {
//     var pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({iceServers: []}),
//         n = function () {
//         }, o = {}, i = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

//     function r(pc) {
//         o[pc] || "0.0.0.0" == pc || onNewIP(pc), ipFound = !0
//     }

//     ipFound = !1,pc.createDataChannel(""), pc.createOffer().then(function (onNewIP) {
//         onNewIP.sdp.split("\n").forEach(function (onNewIP) {
//             ipFound && exit, onNewIP.indexOf("IP4") < 0 || onNewIP.match(i).forEach(r)
//         }), pc.setLocalDescription(onNewIP, n, n)
//     }).catch(function (onNewIP) {
//     }), pc.onicecandidate = function (onNewIP) {
//         onNewIP && onNewIP.candidate && onNewIP.candidate.candidate && onNewIP.candidate.candidate.match(i) && onNewIP.candidate.candidate.match(i).forEach(r)
//     }
// }

// function getUserIP(onNewIP) {
//     //  onNewIp - your listener function for new IPs
//     //compatibility for firefox and chrome
//     var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
//     var pc = new myPeerConnection({
//             iceServers: []
//         }),
//         noop = function () {
//         },
//         localIPs = {},
//         ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
//         key;
//     ipFound = false;
//
//     function iterateIP(ip) {
//         if (!localIPs[ip] && ip != '0.0.0.0') onNewIP(ip);
//         ipFound = true;
//     }
//
//
//     //create a bogus data channel
//     pc.createDataChannel("");
//
//     // create offer and set local description
//     pc.createOffer().then(function (sdp) {
//         sdp.sdp.split('\n').forEach(function (line) {
//             if (ipFound) exit;
//             if (line.indexOf('IP4') < 0) return;
//             line.match(ipRegex).forEach(iterateIP);
//         });
//
//         pc.setLocalDescription(sdp, noop, noop);
//     }).catch(function (reason) {
//         // An error occurred, so handle the failure to connect
//     });
//
//
//     //listen for candidate events
//     pc.onicecandidate = function (ice) {
//         if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
//         ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
//     };
// }



/////////////////////////
function getIPs(callback) {
  var ip_dups = {};
  
  //compatibility for firefox and chrome
  var RTCPeerConnection = window.RTCPeerConnection
    || window.mozRTCPeerConnection
    || window.webkitRTCPeerConnection;
  var useWebKit = !!window.webkitRTCPeerConnection;

  //bypass naive webrtc blocking using an iframe
  if(!RTCPeerConnection){
    //NOTE: you need to have an iframe in the page right above the script tag
    //
    //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
    //<script>...getIPs called in here...
    //
    var win = iframe.contentWindow;
    RTCPeerConnection = win.RTCPeerConnection
      || win.mozRTCPeerConnection
      || win.webkitRTCPeerConnection;
    useWebKit = !!win.webkitRTCPeerConnection;
  }

  //minimal requirements for data connection
  var mediaConstraints = {
    optional: [{RtpDataChannels: true}]
  };

  //firefox already has a default stun server in about:config
  //    media.peerconnection.default_iceservers =
  //    [{"url": "stun:stun.services.mozilla.com"}]
  var servers = undefined;

  //add same stun server for chrome
  if(useWebKit)
    servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

  //construct a new RTCPeerConnection
  var pc = new RTCPeerConnection(servers, mediaConstraints);

  function handleCandidate(candidate){
    //match just the IP address
    var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
    var ip_addr = ip_regex.exec(candidate)[1];

    //remove duplicates
    if(ip_dups[ip_addr] === undefined)
        callback(ip_addr);

    ip_dups[ip_addr] = true;
  }

  //listen for candidate events
  pc.onicecandidate = function(ice){
    //skip non-candidate events
    if(ice.candidate)
      handleCandidate(ice.candidate.candidate);
  };

  //create a bogus data channel
  pc.createDataChannel("");

  //create an offer sdp
  pc.createOffer(function(result){
    //trigger the stun server request
    pc.setLocalDescription(result, function(){}, function(){});
  }, function(){});

  //wait for a while to let everything done
  setTimeout(function(){
    //read candidate info from local description
    var lines = pc.localDescription.sdp.split('\n');
    lines.forEach(function(line){
      if(line.indexOf('a=candidate:') === 0) {
        handleCandidate(line);
      }
    });
  }, 1000);
}

getIPs(function(ip){
  //local IPs
  if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {
    console.log(ip);
  }
});


/////////////////////////

// A helper function for string manipulation
// if (!String.prototype.format) {
//     String.prototype.format = function () {
//         var args = arguments;
//         return this.replace(/{(\d+)}/g, function (match, number) {
//             return typeof args[number] != 'undefined'
//                 ? args[number]
//                 : match
//                 ;
//         });
//     };
// }




// function getCookie(name) {
//     name += "=";
//     for (var ca = decodeURIComponent(document.cookie).split(";"), n = 0; n < ca.length; n++) {
//         for (var o = ca[n]; " " == o.charAt(0);) o = o.substring(1);
//         if (0 == o.indexOf(name)) return o.substring(name.length, o.length)
//     }
//     return ""
// }

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



// function setCookie(key, value) {
//     if (value) {
//         var n = new Date;
//         n.setMinutes(n.getMinutes() + timeout), document.cookie = "{0}={1}; expires={2}".format(key, value, n.toUTCString())
//     } else document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key)
// }

function setCookie(key, value) {
    if (!value) {
        // Expire cookie
        document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key);
        return;
    }

    var dt = new Date();
    dt.setMinutes(dt.getMinutes() + 5*timeout);
    document.cookie = "{0}={1}; expires={2}".format(key, value, dt.toUTCString());
}


function _setCookie(key, value) {
    if (!value) {
        // Expire cookie
        document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key);
        return;
    }

    var dt = new Date();
    dt.setMinutes(dt.getMinutes() + 1*timeout);
    document.cookie = "{0}={1}; expires={2}".format(key, value, dt.toUTCString());
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
// String.prototype.format || (String.prototype.format = function () {
//     var e = arguments;
//     return this.replace(/{(\d+)}/g, function (t, n) {
//         return void 0 !== e[n] ? e[n] : t
//     })
// }),

// function create_UUID() {
//     var e = (new Date).getTime();
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
//         var n = (e + 16 * Math.random()) % 16 | 0;
//         return e = Math.floor(e / 16), ("x" == t ? n : 3 & n | 8).toString(16)
//     })
// }

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}



String.prototype.format || (String.prototype.format = function () {
    var e = arguments;
    return this.replace(/{(\d+)}/g, function (t, n) {
        return void 0 !== e[n] ? e[n] : t
    })
}),

 getIPs(function (e) {
    ip = e
}), sessionFactory = {
    check: function () {
        var e = getCookie("token");
        return e ? (active_session = e, console.log("Session is already opened. Token {0}".format(e))) : sessionFactory.init(user_id), !0
    }, init: function (e) {
        if (ip) {
            var t = getCookie("token");
            var m = getCookie("token1");
            if (user_id != e || !t) {
                t = create_UUID();
                m = create_SID();
                user_id = null != e ? e : t, setCookie("token", t), session_id = null != e ? m : m,  setCookie("token1", m), user_agent = navigator.userAgent, referer = document.location.origin, xReferer = document.location.origin;
                var n = '{"sys_id": "{0}", "user_id": "{1}", "session_id": "{2}", "ip": "{3}","user_agent": "{4}", "referer": "{5}", "xReferer": "{6}"}'.format(system_id, user_id, session_id, ip, user_agent, referer, xReferer),
                    o = new XMLHttpRequest;
                return o.open("POST", "{0}session/".format(url), !0), o.setRequestHeader("Content-Type", "application/json"), o.setRequestHeader("Authorization", auth_token), o.onreadystatechange = function () {
                    4 == this.readyState && 201 == this.status ? console.log("Success: {0}: {1}".format(this.status, this.responseText)) : console.log("Error: {0}: {1}".format(this.status, this.responseText))
                }, o.send(n), !0
            }
            setCookie("token", t)
            setCookie("token1",m)
        } else setTimeout(function () {
            0 != counter-- ? sessionFactory.init(user_id) : counter = ttl
        }, 1e3)
    },
    expire: function () {
        return setCookie("token", null), user_id = null, !0
    }
}, activityFactory = {
    log: function (e, t, n, o, i, r) {
        sessionFactory.check();
        var a = getCookie("token1"),
            s = '{"session_id": "{0}", "channel_id": "{1}", "content_id": "{2}","content_type_id": "{3}", "service_id": "{4}","action_id": "{5}", "time_code": "{6}"}'.format(a, e, t, n, o, i, r),
            c = new XMLHttpRequest;
        return c.open("POST", "{0}event/".format(url), !0), c.setRequestHeader("Content-Type", "application/json"), c.setRequestHeader("Authorization", auth_token), c.onreadystatechange = function () {
            4 == this.readyState && 201 == this.status ? (setCookie("token1", a), console.log("Token {0} did activity {1}".format(a, i))) : console.log("Activity logging failed.")
        }, c.send(s), !0
    }
};
