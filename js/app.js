var you;
var users = {}
var posts = []
var markers = []
var curr_post_index = -1
var curr_info_marker;
var map;
var inDetail = false; // in map or in post
var curr_zip = 94555

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

function GetPostAndItsComments(post) {

    $('#owner-post').text(post.content)        
    var req = new XMLHttpRequest()
    req.onreadystatechange = CommentsReady
    req.open('GET', '/php/get_comments.php?pid=' + post.id, true)
    req.send() 
}

function PostReady() {
    if (this.readyState == 4 && this.status == 200) {
        var user_data = JSON.parse(this.responseText)
        console.log(user_data)
        if ('name' in user_data) {
            $('#owner-name').text(user_data.name)
        }
        if ('posts' in user_data && user_data.posts.length > 0) {
            posts = user_data.posts
            if (posts.length > 0) {
                curr_post_index = posts.length-1
                GetPostAndItsComments(posts[curr_post_index])
            }
        }
    }
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

    var reply_options = ['also recommend Beethoven\' Symphony no.5',
        'Mahler is much better',
        'Go ahead to listen to Justin Bieber']
    for (var i in reply_options) {
        var reply_option_box = $('<a href="#"></a>')
        reply_option_box.text(reply_options[i])
        reply_option_box.addClass('list-group-item')
        reply_option_box.attr('id', 'reply-option')
        $('#reply-options-container').append(reply_option_box)
    }
    var reply_textbox = $('<input>')
    reply_textbox.addClass('list-group-item form-control')
    reply_textbox.attr('type', 'text')
    reply_textbox.attr('placeholder', 'Type your own...')
    reply_textbox.attr('id', 'reply-textbox')
    $('#reply-options-container').append(reply_textbox)
    $('#reply-options-container').hide()

    var req = new XMLHttpRequest()
    req.onreadystatechange = PostReady
    req.open('GET', '/php/get_user_detail.php?uid=' + this.id, true)
    req.send() 
    var p = users[this.id]
    $('#owner-avatar').attr('src', '/php/get_avatar.php?n='+p.user_name)
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
    var lat = map.center.lat()
    var log = map.center.lng()

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

                var ret = JSON.parse(req.responseText)
                users = ret.users
                curr_zip = ret.zip
                PlaceUsersNicely(users, ret.log, ret.lat)
            }
        }
    }
    req.open('GET', '/php/update_area.php?lat='+lat+'&log='+log+'&zipold='+curr_zip, true)
    req.send()
}

function InitializeGoogleMap() {
    var mapOptions = {
        zoom: 13,
        disableDoubleClickZoom: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        center: new google.maps.LatLng(37.5735, -122.0469),
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
            var ret = JSON.parse(req.responseText)
            users = ret.users
            PlaceUsersNicely(users, ret.log, ret.lat)
        }
    }
    req.open('GET', '/php/get_all_users.php?zip='+curr_zip, true)
    req.send()
}

function InitializeCallback() {

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
                }
                else {
                    $('#password-textbox').val('')
                    $('#username-textbox').val('')

                    $('#login-container').hide()
                    $('#postbar').show()
                    you = JSON.parse(req.responseText)
                    createCookie('token', you.token, 1)
                    $('#name-on-top').text(you.name)
                    $('#post-on-top').text(you.content)
                }
            }
        }
        req.open('GET', '/php/login.php?un='+un+'&pw='+pw, true)
        req.send()
    }
    $('#login-button').click(Login)

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
    function ClosePane() {
        $('#interaction-pane').modal('hide')
        // remove all dynamically generated contents
        $('#reply-options-container').empty()
        $('#comments-container').empty()
        posts = []
        inDetail = false
    }
    $('#interaction-pane').on('hidden.bs.modal', ClosePane)

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

    function PrevPost() {
        if (curr_post_index > 0) {
            curr_post_index = curr_post_index - 1
            GetPostAndItsComments(posts[curr_post_index])
        }
    }
    $('#prev-post-button').click(PrevPost)

    function NextPost() {
        if (curr_post_index != -1 &&curr_post_index < posts.length-1) {
            curr_post_index = curr_post_index + 1
            GetPostAndItsComments(posts[curr_post_index])
        }
    }
    $('#next-post-button').click(NextPost)

    function Logout() {
        eraseCookie('token')
        $('#login-container').show()
        $('#taskbar').hide()
    }
    $('#logout-button').click(Logout)
}

function CheckSession() {
    
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            if (req.responseText == 'need login') {
                    
            }
            else {
                $('#login-container').hide()
                $('#postbar').show()
                you = JSON.parse(req.responseText)
                $('#name-on-top').text(you.name)
                $('#post-on-top').text(you.content)
            }
        }
    }
    req.open('GET', '/php/check_session.php', true)
    req.send()
}

$(document).ready(function() {
    function initialize() {
        InitializeGoogleMap()
        InitializePeopleData()
        InitializeCallback()
        CheckSession()
        $('#interaction-pane').hide()
    }
    google.maps.event.addDomListener(window, 'load', initialize);
})
