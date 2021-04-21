// Local variables
var url = "http://192.168.143.18:8876/api/",
    auth_token = "Token DE9C3CFBF147067970C4CAC7F3874247", system_id = "Developer2";
var user_id, active_session, ip, ttl = 30, ttl = 30, counter = ttl;

// Enumerations
var ACTIVITY = {Play: 1, Pause: 2, FDStart: 3, FDEnd: 4, BDStart: 5, BDEnd: 6, ContentView: 7,};
var SERVICE_TYPE = {Live: 1, TimeShift: 2, CatchUp: 3, OnDemand: 4,};
var CONTENT_TYPE = {Video: 1, Audio: 2, Image: 3, Text: 4,};

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
function getUserIP(onNewIP) {
    //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
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


    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (ipFound) exit;
            if (line.indexOf('IP4') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function (reason) {
        // An error occurred, so handle the failure to connect
    });


    //listen for candidate events
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}


// A helper function for string manipulation
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


// Get the value of key 'name' from cookie
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

// Sets the key and its value in cookie
function setCookie(key, value) {
    if (!value) {
        // Expire cookie
        document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key);
        return;
    }

    var dt = new Date();
    dt.setMinutes(dt.getMinutes() + timeout);
    document.cookie = "{0}={1}; expires={2}".format(key, value, dt.toUTCString());
}

// Generate a 128bit UUID
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


// Generate a 128bit SID (Session)
function create_SID() {
    var dt = new Date().getTime();
    var sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return sid;
}

// Get client's ip at page load
getUserIP(function (_ip) {
    ip = _ip;
});

sessionFactory = {

    // Checks if a valid session exists. If not, creates one
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

    // Creates new session valid during timeout
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
        if (user_id == _user_id && token) { // A valid session exists
            setCookie('token', token); // Extend session validation
            return;
        }
        sys_is = system_id
        user_id = _user_id != null ? _user_id : create_UUID();
        session_id = _session_id != null ? _session_id : create_SID();
        user_agent = navigator.userAgent;
        referer = document.location.origin;
        xReferer = document.location.origin;

        var data = '{"sys_id": "{0}", "user_id": "{1}", "session_id": "{2}", "ip": "{3}","user_agent": "{4}", "referer": "{5}", "xReferer": "{6}"}'.format(system_id, user_id, t, ip, user_agent, referer, xReferer)

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "{0}session/".format(url), true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader('Authorization', auth_token);
        xmlhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 201) {
                // @todo: must extract session id
                setCookie('token', JSON.parse(this.responseText).id);
                console.log("Success: {0}: {1}".format(this.status, this.responseText));
            } else {
                console.log("Error: {0}: {1}".format(this.status, this.responseText));
            }
        };
        xmlhttp.send(data);
        return true;
    },

    // Expire cookie and session
    expire: function () {
        var token = getCookie('token');

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("PATCH", "{0}session/{1}/".format(url, token), true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader('Authorization', auth_token);
        xmlhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                // @todo: must extract session id
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
    log: function (channel_id, content_id, content_type_id, service_id, action_id, time_code) {
        sessionFactory.check();
        var token = getCookie('token');

        var data = '{"session_id": "{0}", "channel_id": "{1}", "content_id": "{2}","content_type_id": "{3}", "service_id": "{4}","action_id": "{5}", "time_code": "{6}"}'.format(
            token, channel_id, content_id, content_type_id, service_id, action_id, time_code);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "{0}event/".format(url), true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader('Authorization', auth_token);
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                // Extend session validation
                setCookie('token', token);
                console.log("Token {0} did activity {1}".format(token, action_id));
            } else {

                console.log("Activity logging failed.")
            }
        };
        xmlhttp.send(data);
        return true;
    }

