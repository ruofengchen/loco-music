var you;
var users = {}
var posts = []
var curr_post_index = -1
var map;
var detailedMarker;
var inDetail = false; // in map or in post

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
function GetPersonInfoHTML(p) {

    var img = $('<img></img>')
    img.attr('src', '/php/get_avatar.php?n='+p.user_name)
    img.attr('id', 'avatar')
    img.addClass('img-circle')
    return img
}

// ui code for info box
function GetPersonDetailHTML(p) {
    var box = $('<div></div>')
    box.attr('id', 'detail-box')
    var post = $('<div></div>')
    post.text(p.post)
    box.append(post)
    return box
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
    google.maps.event.addListener(marker, 'click', ShowInteractionPane)
}

function PlaceUsersNicely(users) {
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
        var x = parseFloat(users[0].lat)
        var y = parseFloat(users[0].log)
        var cnt = 0
        var finished = 0
        while (1) {
            for (var i=0; i<steps[p]; i++) {
                var obj = GetPersonInfoHTML(users[cnt])
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
    // google.maps.event.addListener(map, 'zoom_changed', ZoomChanged);
}

function InitializePeopleData() {

    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            users = JSON.parse(req.responseText)
            PlaceUsersNicely(users)
        }
    }
    req.open('GET', '/php/get_all_users.php', true)
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
}

$(document).ready(function() {
    function initialize() {
        InitializeGoogleMap()
        InitializePeopleData()
        InitializeCallback()
        $('#interaction-pane').hide()
    }
    google.maps.event.addDomListener(window, 'load', initialize);
})
