// fake data
var p0 = {name:'Rojie', title:'xiabi', zip:94403, avatar:"/img/cat.jpg", post:"Like cat music", id:"0"}
var p1 = {name:'Shine', title:'shacha', zip:94541, avatar:"/img/fox.jpg", post:"Practising Rojie\'s song", id:"1"}
var p2 = {name:'ricki', title:'gAygAy', zip:94555, avatar:"/img/puppy.jpg", post:"I just learned to poop music. I just learned to poop music. I just learned to poop music. I just learned to poop music. I just learned to poop music. I just learned to poop music. I just learned to poop music.", id:"2"}

var fake_comments = [{name:'xiao_a', content:'xiao_a has a comment'}, {name:'xiao_b', content:'xiao_b comments'}]

var users = {}
var map;
var detailedMarker;
var inDetail = false; // in map or in post

function CommentsReady() {

    if (this.readyState == 4 && this.status == 200) {
        var comments = JSON.parse(this.responseText)
        for (var i in comments) {
            var comment_box = $('<div></div>')
            comment_box.addClass('comment')
            comment_box.text(comments[i].content)
            $('.comments-container').append(comment_box)
        }
    }
}

function PostReady() {
    if (this.readyState == 4 && this.status == 200) {
        var user_data = JSON.parse(this.responseText)
        console.log(user_data)
        if ('name' in user_data) {
            $('.owner-name').text(user_data.name)
        }
        if ('posts' in user_data && user_data.posts.length > 0) {
            var post = user_data.posts[0].content
            $('.owner-post').text(post)
            
            var req = new XMLHttpRequest()
            req.onreadystatechange = CommentsReady
            req.open('GET', '/php/get_comments.php?pid=' + post.id, true)
            req.send() 
        }
    }
}

function ShowInteractionPane() {

    $('.interaction-pane').show()
    if (inDetail) return
    inDetail = true

    $('.flag-confirm').hide()

    var reply_options = ['also recommend Beethoven\' Symphony no.5',
        'Mahler is much better',
        'Go ahead to listen to Justin Bieber']
    for (var i in reply_options) {
        var reply_option_box = $('<div></div>')
        reply_option_box.text(reply_options[i])
        reply_option_box.addClass('reply-option')
        $('.reply-options-container').append(reply_option_box)
    }
    var reply_textbox = $('<input>')
    reply_textbox.attr('type', 'text')
    reply_textbox.val('Type your own...')
    reply_textbox.addClass('reply-textbox')
    $('.reply-options-container').append(reply_textbox)
    $('.reply-options-container').hide()

    // TO-DO: read info from db
   
    var req = new XMLHttpRequest()
    req.onreadystatechange = PostReady
    req.open('GET', '/php/get_user_detail.php?uid=' + this.id, true)
    req.send() 
    var p = users[this.id]
    $('.owner-avatar').attr('src', p.avatar)
}

// ui code for avatar
function GetPersonInfoHTML(p) {

    var img = $('<img></img>')
    img.attr('src', p.avatar)
    img.addClass('avatar')
    return img
}

// ui code for info box
function GetPersonDetailHTML(p) {
    var box = $('<div></div>')
    box.addClass('detail-box')
    var post = $('<div></div>')
    post.text(p.post)
    box.append(post)
    return box
}

function PlaceInfoOnMap(obj, x, y, id) {
    var content = obj[0].outerHTML
    x = parseFloat(x) + Math.random() * 0.04 - 0.02
    y = parseFloat(y) + Math.random() * 0.04 - 0.02
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

function InitializeGoogleMap() {
    var mapOptions = {
        zoom: 13,
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
        for (var id in users) {
        users[id].avatar = '/img/person.jpg'
                var obj = GetPersonInfoHTML(users[id])
                PlaceInfoOnMap(obj, users[id].lat, users[id].log, id)
            }
        }
    }
    req.open('GET', '/php/get_all_users.php', true)
    req.send()

}

function InitializeCallback() {
    function ClosePane() {
        $('.interaction-pane').hide()
        // remove all dynamically generated contents
        $('.reply-options-container').empty()
        inDetail = false
    }
    $('.close-button').click(ClosePane)

    $('.like-button').attr('src', '/img/heart_grey.png')
    function LikePost() {
        $('.like-button').attr('src', '/img/heart_red.png')
    }
    $('.like-button').click(LikePost)

    function ReplyPost() {
        $('.reply-options-container').toggle()
    }
    $('.reply-button').click(ReplyPost)

    function Flag() {
        console.log("here")
        $('.flag-confirm').toggle()
    }
    $('.flag-button').click(Flag)
}

$(document).ready(function() {
    function initialize() {
        InitializeGoogleMap()
        InitializePeopleData()
        InitializeCallback()
        $('.interaction-pane').hide()
    }
    google.maps.event.addDomListener(window, 'load', initialize);
})
