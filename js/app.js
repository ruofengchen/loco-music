var you;
var users = {}
var markers = []
var curr_user_data;
var curr_info_marker;
var curr_district_x;
var curr_district_y;
var map;
var inDetail = false; // in map or in post

function ShowInfo(s) {
    $('#popup-info').show()
    $('#popup-info').text(s)
}

function KnowGeo(lat, log) {
    InitializeGoogleMap(lat, log)
    InitializePeopleData()
    $('#postbar').show()
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function CommentsReady() {

    if (this.readyState == 4 && this.status == 200) {
        $('#comments-container').empty()
        var comments = JSON.parse(this.responseText)
        for (var i in comments) {
            var comment_box = $('<div></div>')
            comment_box.attr('id', 'comment-box')
            var comment_content = $('<div></div>')
            comment_content.addClass('breadcrumb')
            comment_content.attr('id', 'comment-content')
            comment_content.text(comments[i].content)
            var comment_name = $('<div></div>')
            comment_name.attr('id', 'comment-name')
            var shortname = comments[i].name.substring(0, 6)+'.'
            comment_name.text('---- '+shortname)
            comment_box.append(comment_content)
            comment_box.append(comment_name)
            $('#comments-container').append(comment_box)
        }
    }
}

function ClosePane() {
    $('#interaction-pane').modal('hide')
    // remove all dynamically generated contents
    $('#comments-container').empty()
    posts = []
    inDetail = false
}

function DisplayUserData(user_data) {

    $('#owner-post').text(decodeURIComponent(user_data.content))
    if (user_data.sound_url) {
        $('#soundcloud-frame').attr('src', "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/34019569&color=0066cc")        
        $('#soundcloud-frame').show()
    }
    else {
        $('#soundcloud-frame').hide()
    }

    var rating = (parseFloat(user_data.r0) + parseFloat(user_data.r1) + parseFloat(user_data.r2) + parseFloat(user_data.r3) + parseFloat(user_data.r4)) / 5
    console.log(rating)
    $('.stars-display').rating('update', rating)
    //var req = new XMLHttpRequest()
    //req.onreadystatechange = CommentsReady
    //req.open('GET', '/php/get_comments.php?pid=' + p.id, true)
    //req.send() 
}

function ShowInteractionPane() {

    $('#interaction-pane').modal('show')
    if (inDetail) return
    inDetail = true

    // reset
    posts = [];
    curr_post_index = -1;
    $('#owner-post').text('')

    $('#flag-confirm').hide()
    
    $('#soundcloud-frame').hide()
    $('#reply-options-container').hide()

    var p = users[this.id]
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == 'no posts') {
                return
            }
            var user_data = JSON.parse(this.responseText)
            jQuery.extend(user_data, p)
            user_data.max_version = user_data.version
            console.log(user_data)
            DisplayUserData(user_data)
            curr_user_data = user_data
        }
    }
    req.open('GET', '/php/get_user_detail.php?uid=' + this.id, true)
    req.send() 
    $('#owner-avatar').attr('src', '/php/get_avatar.php?n='+p.user_name)
    $('#owner-name').text(p.name)
}

// ui code for avatar
function GetMarkerInfoHTML(color, music_type) {
    var box = $('<div></div>')
    box.addClass = $('marker-container')
    var marker = $('<img></img>')
    marker.attr('src', '/img/marker-'+color+'.png')
    marker.addClass('marker-image')
    var type = $('<img></img>')
    type.attr('src', '/img/'+music_type+'.png')
    type.addClass('music-type-image')
    box.append(marker)
    box.append(type)
    return box
}

// ui code for info box
function ShowUserInfo() {

    if (curr_info_marker) { 
        curr_info_marker.setMap(null)
    } 

    // get position of marker and adjust infowindow's
    var dx = map.center.lat() - this.position.lat()
    var dy = map.center.lng() - this.position.lng()
    if (dx>-0.00001 && dx<0.00001 && dy>-0.00001 && dy<0.00001) {
        dx = 0.01
    }
    var dist = Math.sqrt(dx*dx+dy*dy)
    var new_lat = this.position.lat() + dx / dist * 0.015
    var new_log = this.position.lng() + dy / dist * 0.015
    var pos = new google.maps.LatLng(new_lat, new_log)

    var p = users[this.id]
    var infobox = $('<div></div>')
    infobox.addClass('infobox')
    var avatar = $('<img></img>')
    avatar.addClass('avatar')
    avatar.attr('src', '/php/get_avatar.php?n='+p.user_name)
    infobox.append(avatar)
    var name = $('<div></div>')
    name.addClass('name-in-infobox')
    name.text(p.name)
    infobox.append(name)
    content = infobox[0].outerHTML
    var marker = new RichMarker({
        position: pos,
        map: map,
        draggable: false,
        content: content,
        id: this.id
    });
    marker.setZIndex(5)
    google.maps.event.addListener(marker, 'click', ShowInteractionPane)
    curr_info_marker = marker
}

function PlaceInfoOnMap(obj, x, y, id) {
    var content = obj[0].outerHTML
    x = parseFloat(x)
    y = parseFloat(y)
    var mapCenter = new google.maps.LatLng(parseFloat(x), parseFloat(y))
    var marker = new RichMarker({
        position: mapCenter,
        map: map,
        draggable: false,
        content: content,
        shadow: '',
        id: id
    });
    google.maps.event.addListener(marker, 'click', ShowUserInfo)
    markers.push(marker)
}

function PlaceUsersNicely(users, log, lat) {
    if (users.length > 0) {
        var unit_x = 0.004
        var unit_y = 0.004
        var dx = [-2,-1,1,2,1,-1]
        var dy = [0,-1.7320508,-1.7320508,0,1.7320508,1.7320508]
        for (var i=0; i<6; i++) {
            dx[i] = dx[i] * unit_x
            dy[i] = dy[i] * unit_y
        }
        var steps = [1,0,1,1,1,1]
        var p = 0
        var x = parseFloat(lat)
        var y = parseFloat(log)
        var cnt = 0
        var finished = 0
        while (1) {
            for (var i=0; i<steps[p]; i++) {
                var obj = GetMarkerInfoHTML('green', 'guitar')
                PlaceInfoOnMap(obj, x, y, cnt)
                x = x + dx[p]
                y = y + dy[p]
                cnt = cnt + 1
                if (cnt >= users.length - 1) {
                    finished = 1
                    break
                }
            }

            if (finished == 1) {
                break
            }

            p = p + 1
            if (p == 6) {
                p = 0
                for (var i=0; i<6; i++) {
                    steps[i] = steps[i] + 1
                }
            }
        }
    }
}

function MapMoveAround() {
    var district_x = (map.center.lat() / 0.1) | 0
    var district_y = (map.center.lng() / 0.1) | 0

    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            if (req.responseText == 'no need update') {

            }
            else {
                // remove all markers
                for (var i=0; i<markers.length; i++) {
                    markers[i].setMap(null)
                }
                markers = []

                users = JSON.parse(req.responseText)
                for (var i in users) {
                    var obj = GetMarkerInfoHTML('green', users[i].type)
                    PlaceInfoOnMap(obj, users[i].lat, users[i].log, users[i].id)
                    curr_district_x = district_x
                    curr_district_y = district_y
                }
            }
        }
    }
    req.open('GET', '/php/update_area.php?dx='+district_x+'&dy='+district_y+'&cdx='+curr_district_x+'&cdy='+curr_district_y, true)
    req.send()
}

function InitializeGoogleMap(lat, log) {
    var mapOptions = {
        zoom: 13,
        disableDoubleClickZoom: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        center: new google.maps.LatLng(lat, log),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        styles: [{featureType:"all", elementType:"labels", stylers:[{visibility:"off"}]}]
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    google.maps.event.addListener(map, 'dragend', MapMoveAround);
    
}

function InitializePeopleData() {

    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            users = JSON.parse(req.responseText)
            for (var i in users) {
                var obj = GetMarkerInfoHTML('green', users[i].type)
                PlaceInfoOnMap(obj, users[i].lat, users[i].log, users[i].id)
                curr_district_x = (map.center.lat() / 0.1) | 0
                curr_district_y = (map.center.lng() / 0.1) | 0
            }
        }
    }
    req.open('GET', '/php/get_all_users.php?lat='+map.center.lat()+'&log='+map.center.lng(), true)
    req.send()
}

function InitializeCallback() {

    function DismissAlert() {
        $('#popup-info').hide()
    }
    $('#popup-info').click(DismissAlert)

    function ToggleMenu() {
        $('#menu').toggle()
    }
    $('#hamburger-button').click(ToggleMenu)

    function Login() {
        
        var un = $('#username-textbox').val()
        var pw = $('#password-textbox').val()
        var req = new XMLHttpRequest()
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                if (req.responseText == 'login failure') {
                    $('#password-textbox').val('')
                    ShowInfo('Login error. Try again?')
                }
                else {
                    $('#password-textbox').val('')
                    $('#username-textbox').val('')

                    $('#postbar').show()
                    you = JSON.parse(req.responseText)
                    console.log("login:"+JSON.stringify(you))
                    createCookie('token', you.token, 1)
                    $('#name-on-top').text(you.name)
                    $('#post-on-top').text(decodeURIComponent(you.content))
                    $('#startup-pane').hide()
                    KnowGeo(parseFloat(you.lat), parseFloat(you.log))
                }
            }
        }
        req.open('GET', '/php/login.php?un='+un+'&pw='+pw, true)
        req.send()
    }
    $('#login-button').click(Login)

    function SwitchToRegister() {
        $('#login-container').hide()
        $('#register-container').show()
    }
    $('#switch-to-register').click(SwitchToRegister)

    function SelectInstrumentsInRegister() {
        $('#selected-instrument').text('Your music instrument is '+$(this).text())
    }
    $('.select-instrument-item').click(SelectInstrumentsInRegister)

    function GetGeo() {
        if (navigator.geolocation) {
            
            function ShowPosition(position) {
                var lat = position.coords.latitude
                var log = position.coords.longitude
                $('#geo').text('&lat='+lat.toString()+'&log='+log.toString())
                var req = new XMLHttpRequest()
                req.onreadystatechange = function() {
                    if (req.readyState == 4 && req.status == 200) {
                        var geo_struct = JSON.parse(req.responseText)
                        $('#get-geo-button').text('Your location is '+geo_struct.results[3].formatted_address)
                    }
                }
                req.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+log, true)
                req.send()
            }
            navigator.geolocation.getCurrentPosition(ShowPosition) 
        }
        else {
            console.log('does not support geo')
        }
    }
    $('#get-geo-button').click(GetGeo)

    function SwitchToLogin() {
        $('#login-container').show()
        $('#register-container').hide()
    }
    $('#switch-to-login').click(SwitchToLogin)

    function Register() {
        var s = 'un='+$('#username-textbox-register').val()+'&dn='+$('#name-textbox-register').val()+'&em='+$('#email-textbox-register').val()+'&pw='+$('#password-textbox-register').val()+'&inst='+$('#selected-instrument').text().substring('Your music instrument is '.length)+$('#geo').text()
        var req = new XMLHttpRequest()
        req.onreadystatechange = function() {
            if (req.responseText == 'register success') {
                ShowInfo('Congratulations, now you are one of us.')
                SwitchToLogin()
            } 
        }

        req.open('GET', '/php/register.php?'+s)
        req.send()
    }
    $('#register-button').click(Register)

    function ShowTaskbar() {
        $('#postbar').hide()
        $('#taskbar').show()
    }
    $('#show-taskbar-button').click(ShowTaskbar)

    function ShowPostbar() {
        $('#postbar').show()
        $('#taskbar').hide()
    }
    $('#show-postbar-button').click(ShowPostbar)
    $('#interaction-pane').on('hidden.bs.modal', ClosePane)

    function NewPost() {
        console.log(you)
        $('#new-post-pane').modal('show')
        $('#new-session-to-recent-commit-button').text('New Session for '+decodeURIComponent(you.title))
    }
    $('#new-post-button').click(NewPost)

    function NewSessionToRecentCommit() {
        $('#upload-media-box').show()
    }
    $('#new-session-to-recent-commit-button').click(NewSessionToRecentCommit)

    function ShowOlderCommits() {
        console.log(you)
        var req = new XMLHttpRequest()
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                console.log(req.responseText) 
            }
        }

        req.open('GET', '/php/get_commits.php?uid='+you.id, true)
        req.send()
    }
    $('#switch-to-other-commit-button').click(ShowOlderCommits)

    // when video is selected/captured
    function PlayVideoFile() {
        var file = this.files[0]
        var type = file.type
        var videoPlayer = document.getElementById('video-player')
        if (videoPlayer.canPlayType(type)) {
            var fileURL = URL.createObjectURL(file);
            videoPlayer.src = fileURL
        }
    }
    document.getElementById('camera-input').addEventListener('change', PlayVideoFile, false)

    function UploadMedia() {
        var file = document.getElementById('camera-input').files[0]
        var formData = new FormData()
        formData.append('video', file)
        var req = new XMLHttpRequest()
        req.onreadystatechange = function() {
            console.log(req.responseText) 
        }

        req.upload.addEventListener('progress', function(e){
            document.getElementById('progress-bar').style.width = Math.ceil(e.loaded/e.total*100) + '%';
        }, false);
        var new_version = parseFloat(you.version)+1
        req.open('POST', '/php/upload_video.php?cid='+you.recent_commit_id+'&v='+new_version)
        req.send(formData)
    }
    $('#upload-media-button').click(UploadMedia)

    function CenterYou() {
        map.setCenter(new google.maps.LatLng(parseFloat(you.lat), parseFloat(you.log)))
        MapMoveAround()        
    }
    $('#name-on-top').click(CenterYou)

    $('#like-button').attr('src', '/img/heart_grey.png')
    function LikePost() {
        $('#like-button').attr('src', '/img/heart_red.png')
    }
    $('#like-button').click(LikePost)

    function ReplyPost() {
        $('#reply-options-container').toggle()
    }
    $('#reply-button').click(ReplyPost)

    function Flag() {
        $('#flag-confirm').toggle()
    }
    $('#flag-button').click(Flag)

    function UpdateUserData(user_data) {
        curr_user_data.version = user_data.version
        curr_user_data.content = user_data.content
        curr_user_data.sound_url = user_data.sound_url
        curr_user_data.video_url = user_data.video_url
        curr_user_data.r0 = user_data.r0
        curr_user_data.r1 = user_data.r1
        curr_user_data.r2 = user_data.r2
        curr_user_data.r3 = user_data.r3
        curr_user_data.r4 = user_data.r4  
        DisplayUserData(curr_user_data)
    }

    function PrevPost() {
        if (curr_user_data.version == 0) {
            return
        }
        var v = parseFloat(curr_user_data.version) - 1
        var req = new XMLHttpRequest()
        
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                var user_data = JSON.parse(req.responseText)
                UpdateUserData(user_data)
            }
        }
        req.open('GET', '/php/get_session.php?v='+v+'&c='+curr_user_data.commit_id, true)
        req.send()
    }
    $('#prev-post-button').click(PrevPost)

    function NextPost() {
        if (curr_user_data.version == curr_user_data.max_version) {
            return
        }
        var v = parseFloat(curr_user_data.version) + 1
        var req = new XMLHttpRequest()
        
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                var user_data = JSON.parse(req.responseText)
                UpdateUserData(user_data)
            }
        }
        req.open('GET', '/php/get_session.php?v='+v+'&c='+curr_user_data.commit_id, true)
        req.send()
    }
    $('#next-post-button').click(NextPost)

    function Logout() {
        eraseCookie('token')
        $('#taskbar').hide()
        ShowInfo('Successfully logged out.')
    }
    $('#logout-button').click(Logout)
}

function CheckSession() {
    
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            if (req.responseText == 'need login') {
                ShowStartupPane()           
            }
            else {
                $('#postbar').show()
                you = JSON.parse(req.responseText)
                console.log("checked session: "+JSON.stringify(you))
                $('#name-on-top').text(you.name)
                if (you.content)
                    $('#post-on-top').text(decodeURIComponent(you.content))
                KnowGeo(parseFloat(you.lat), parseFloat(you.log))
            }
        }
    }
    req.open('GET', '/php/check_session.php', true)
    req.send()
}

function InitializeStarResources() {

    $('.stars').rating({
        min: 0,
        max: 5,
        step: 0.1,
        size: 'xs',
        showClear: false,
        showCaption: false
    });
    $('.stars-display').rating({
        min: 0,
        max: 5,
        step: 0.1,
        size: 'xs',
        showClear: false,
        showCaption: false,
        disabled: true,
        hoverEnabled: false
    });

}

function ShowStartupPane() {
    $('#startup-pane').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    })
}

$(document).ready(function() {
    function initialize() {
        InitializeCallback()
        InitializeStarResources()
        CheckSession()
        $('#interaction-pane').hide()
    }
    google.maps.event.addDomListener(window, 'load', initialize);
})
