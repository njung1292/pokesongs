// Initialize important information
var gameDict = {};
var currentIdx = -1;
var masterGame = "";
var masterSongList = [];
// var utils_socket = io.connect('http://localhost:5000/utils');
var utils_socket = io.connect('http://pokesongs.herokuapp.com/utils');

// Setup socket to respond to songlist data from the server
utils_socket.on('data', function (data) {
    masterSongList = data;
    listSongs();
    currentIdx = -1;
    forward();
});

function enableButtons() {
    $('#submit').attr('class', 'btn btn-default');
    $('.tt-hint').prop('disabled', false);
    $('#game').prop('disabled', false);
    $('#game').css('background-color', '');
}

function hashGames(data) {
    hashObjects(data, gameDict);
}

function hashObjects(data, dict) {
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        dict[obj.content] = obj.href;
    }
}

function back() {
    if (currentIdx == 0) {
        currentIdx = masterSongList.length - 1;
    } else {
        currentIdx -= 1;
    }
    updateNowPlaying(masterSongList[currentIdx], currentIdx);
}

function forward() {
    if (currentIdx == masterSongList.length - 1) {
        currentIdx = 0;
    } else {
        currentIdx += 1;
    }
    updateNowPlaying(masterSongList[currentIdx], currentIdx);
}

// called whenever a new song is played
function updateNowPlaying(song, idx) {
    currentIdx = idx;
    songId = song.href.substring(1);
    songTitle = song.content;
    var src = 'http://www.brawlcustommusic.com/music/mp3/' + songId + '.mp3';
    $('#nowPlaying').text('Now Playing: ' + songTitle);
    $('audio').attr('src', src);

    // for highlighting the now playing song
    $('#'+songId).attr('class','list-group-item active');
    $('#'+songId).siblings().attr('class','list-group-item');
    if ($('audio')[0].paused) pause();
}

// called only when a new game is selected
function listSongs() {
    $('#songList').empty();
    $('#title').text(masterGame);
    var baseUrl = 'http://www.brawlcustommusic.com/music/mp3/';
    // Add each song to the list as a link
    // for testing only!
    // var masterSongList = [{'href':'/1','content':'a'},{'href':'/2','content':'b'},{'href':'/3','content':'c'},{'href':'/4','content':'  d'}]
    for (var i = 0; i < masterSongList.length; i++) {
        var song = masterSongList[i];
        var songId = song.href.substring(1);
        var songTitle = song.content;
        var href = baseUrl + songId + '.mp3';
        var link = $('<a></a>')
            .addClass('list-group-item clearfix')
            .attr('id', songId)
            .attr('href', '#')
            .appendTo('#songList');
        var songTitleSpan = $('<span></span>')
            .text(songTitle)
            .appendTo(link);
        var buttonSpan = $('<span></span>')
            .addClass('pull-right')
            .appendTo(link);
        var copyButton = $('<button>Copy link</button>')
            .addClass('btn btn-xs btn-info copy-button')
            .attr('data-clipboard-text', href)
            .click(function(event) {
                event.stopPropagation();
            })
            .appendTo(buttonSpan);
        $('#' + songId).click(function(e) {
            e.preventDefault();
            updateNowPlaying({'content': this.text, 'href': "/" + this.id}, $(this).index());
        });
        $('#songList').append('<button id="copy-button" data-clipboard-text="' + href + '"');
        if (i == masterSongList.length - 1) {
            var client = new ZeroClipboard( $('.copy-button') );
        }
    }
}

// called after selecting a new game. refreshes the song list
function refreshSongList() {
    masterGame = $('#game').val();
    masterSongList = [];
    utils_socket.emit('game', gameDict[masterGame]);
}

function pause() {
    var audio = $('audio');
    if (audio[0].paused) {
        audio[0].play();
        $('#pause-btn').attr('class', 'glyphicon glyphicon-pause');
    } else {
        audio[0].pause();
        $('#pause-btn').attr('class', 'glyphicon glyphicon-play');
    }
}

// ZeroClipboard
// function initClipboardClient() {
//     var client = new ZeroClipboard( $('.copy-button') );

//     client.on( 'aftercopy', function( event ) {
//         // console.log("copied text to clipboard: " + event.data["text/plain"]);
//     } );
// }