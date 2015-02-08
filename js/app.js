// fake data
var p0 = {name:'Rojie', title:'xiabi', zip:94403, avatar:"/img/cat.jpg", post:"Like cat music", id:"0"}
var p1 = {name:'Shine', title:'shacha', zip:94541, avatar:"/img/fox.jpg", post:"Practising Rojie\'s song", id:"1"}
var p2 = {name:'ricki', title:'gAygAy', zip:94555, avatar:"/img/puppy.jpg", post:"I just learned to poop music. I just learned to poop music. I just learned to poop music. I just learned to poop music. I just learned to poop music. I just learned to poop music. I just learned to poop music.", id:"2"}
var people = {}
people["0"] = p0
people["1"] = p1
people["2"] = p2

// generate some random users
for (var i=0; i<100; i++) {
    var name = Math.random().toString(35).substring(2, 20);
    var title = Math.random().toString(35).substring(2, 7);
    var zip = Math.floor(Math.random() * 6162) + 90000;
    var post = Math.random().toString(35).substring(2, 10) + ' ' + Math.random().toString(35).substring(2, 10);
    var id = Math.random().toString(35).substring(2, 7);
    var p = {name:name, title:title, zip:zip, avatar:"/img/person.jpg", post:post, id:id};
    people[id] = p;
}

var zip2loc = {}
zip2loc[94403] = {x:37.53, y:-122.3}
zip2loc[94541] = {x:37.674, y:-122.089}
zip2loc[94555] = {x:37.572, y:-122.048}

var map;
var detailedMarker;
var inDetail = false; // in map or in post

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

    var p = people[this.id]
    $('.owner-avatar').attr('src', p.avatar)
    $('.owner-name').text(p.name)
    $('.owner-title').text(p.title)
    $('.owner-post').text(p.post)
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
    var mapCenter = new google.maps.LatLng(x, y)
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
    for (var k in people) {
        var obj = GetPersonInfoHTML(people[k])
        var loc;
        if (people[k].zip in zip2loc)
            loc = zip2loc[people[k].zip]
        else {
            loc.x = 37.5735 + Math.random() * 2 - 1
            loc.y = -122.0469 + Math.random() * 2 - 1
        }
        PlaceInfoOnMap(obj, loc.x, loc.y, k)
    }
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

// function ZoomChanged() {
//     var zoomLevel = map.getZoom();
//     console.log(zoomLevel);
//     if (zoomLevel < 10) {
//         // scale all avatars
//     }
// }

function TestPHP() {
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
	if (req.status == 200) {
	    console.log(req.responseText)
	}
    }
    req.open('GET', '/php/get_all_users.php', true)
    req.send()
}

$(document).ready(function() {
    function initialize() {
        InitializeGoogleMap()
        InitializePeopleData()
        InitializeCallback()
        $('.interaction-pane').hide()
	TestPHP()
    }
    google.maps.event.addDomListener(window, 'load', initialize);
})