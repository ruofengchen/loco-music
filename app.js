// fake data
var p0 = {name:'Rojie', title:'xiabi', zip:94403, avatar:"img/cat.jpg", post:"Like cat music", id:"0"}
var p1 = {name:'Shine', title:'shacha', zip:94541, avatar:"img/fox.jpg", post:"Practising Rojie\'s song", id:"1"}
var p2 = {name:'ricki', title:'gAygAy', zip:94555, avatar:"img/puppy.jpg", post:"I just learned to poop music.", id:"2"}
var people = {}
people["0"] = p0
people["1"] = p1
people["2"] = p2

// generate some random users
for (var i=0; i<100; i++) {
    var name = Math.random().toString(35).substring(2, 10);
    var title = Math.random().toString(35).substring(2, 7);
    var zip = Math.floor(Math.random() * 6162) + 90000;
    var post = Math.random().toString(35).substring(2, 10) + ' ' + Math.random().toString(35).substring(2, 10);
    var id = Math.random().toString(35).substring(2, 7);
    var p = {name:name, title:title, zip:zip, avatar:"img/person.jpg", post:post, id:id};
    people[id] = p;
}

var zip2loc = {}
zip2loc[94403] = {x:37.53, y:-122.3}
zip2loc[94541] = {x:37.674, y:-122.089}
zip2loc[94555] = {x:37.572, y:-122.048}

var map;
var detailedMarker;
var inDetail = false; // in map or in post

// on-click trigger
function UpdatePersonDetailInfoBox() {
    // remove previous detail box first
    if (detailedMarker) {
        var theBox = $(detailedMarker.content)
        theBox.find('.detail-box').remove()
        theBox.find('.name-tag').hide()
        theBox.find('.title-tag').hide()
        detailedMarker.setContent(theBox[0].outerHTML)
        
    }

    var box = $(this.content)
    var id = box.attr('id')
    
    var txt_box = GetPersonDetailHTML(people[id])
    box.append(txt_box)
    box.find('.name-tag').show()
    box.find('.title-tag').show()

    this.setContent(box[0].outerHTML)
    detailedMarker = this
}

function ShowInteractionPane() {

    if (inDetail) return
    inDetail = true

    var box = $('<div></div>')
    box.addClass('interaction-pane')

    var top_bar = $('<div></div>')
    top_bar.addClass('top-bar')

    var closeBtn = $('<img></img>')
    closeBtn.attr('src', 'img/x.png')
    closeBtn.addClass('close-button')
    function ClosePane() {
        $('.interaction-pane').remove()
        inDetail = false
    }
    closeBtn.click(ClosePane)

    // owner's box
    var owner_box = $('<div></div>')
    owner_box.addClass('owner-box')

    var id = $(this.content).attr('id')
    var owner_avatar = GetPersonInfoHTML(people[id])
    owner_avatar.find('.name-tag').show()
    owner_avatar.find('.title-tag').show()
    owner_box.append(owner_avatar)

    var owner_post_content = "Some random post. Damn, I don't want to play music, I just want to poop!!"
    var owner_post = $('<div></div>')
    owner_post.addClass('owner-post')
    owner_post.text(owner_post_content)
    owner_box.append(owner_post)

    top_bar.append(closeBtn)
    box.append(top_bar)
    box.append(owner_box)

    $('body').append(box)
}

// ui code for avatar
function GetPersonInfoHTML(p) {

    var box = $('<div></div>')
    box.addClass('whole-box')
    box.attr('id', p.id)

    var innerbox = $('<div></div>')
    innerbox.addClass('inner-box')

    var frame = $('<div></div>')
    frame.addClass('avatar-frame')

    var img = $('<img></img>')
    img.attr('src', p.avatar)
    img.addClass('avatar')

    var nametag = $('<div></div>')
    nametag.addClass('name-tag')
    nametag.text(p.name)
    nametag.hide()

    var titletag = $('<div></div>')
    titletag.addClass('title-tag')
    titletag.text(p.title)
    titletag.hide()

    frame.append(img)
    innerbox.append(frame)
    innerbox.append(nametag)
    innerbox.append(titletag)
    box.append(innerbox)

    return box
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

function PlaceInfoOnMap(obj, x, y) {
    var content = obj[0].outerHTML
    var mapCenter = new google.maps.LatLng(x, y)
    var marker = new RichMarker({
        position: mapCenter,
        map: map,
        draggable: false,
        content: content,
        shadow: '',
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
        PlaceInfoOnMap(obj, loc.x, loc.y)
    }
}

// function ZoomChanged() {
//     var zoomLevel = map.getZoom();
//     console.log(zoomLevel);
//     if (zoomLevel < 10) {
//         // scale all avatars
//     }
// }

$(document).ready(function() {
    function initialize() {
        InitializeGoogleMap()
        InitializePeopleData()
    }
    google.maps.event.addDomListener(window, 'load', initialize);
})