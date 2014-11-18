// Initialize important information
var gameDict = {};
var gameTitles = [];
var currentIdx = -1;
var masterGame = "";
var masterSongList = [];
var baseUrl = 'http://www.brawlcustommusic.com/music/mp3/';
// var utils_socket = io.connect('http://localhost:5000/utils');
var utils_socket = io.connect('http://pokesongs.herokuapp.com/utils');

// Set up socket to respond to songlist data from the server
utils_socket.on('data', function (data) {
    masterSongList = data;
    currentIdx = -1;
    listSongs();
    forward();
});

function enableButtons() {
    $('.tt-hint').prop('disabled', false);
    $('#game').prop('disabled', false);
    $('#game').css('background-color', '');
    $('#randomGame').removeClass('disabled');
    $('#submit').removeClass('disabled');
    $('#nowPlaying').text('');
}

function hashGames(data) {
    hashObjects(data, gameDict);
}

function hashObjects(data, dict) {
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        dict[obj.content] = obj.href;
        gameTitles[i] = obj.content;
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

// called whenever a new song is played
function updateNowPlaying(song, idx) {
    currentIdx = idx;
    songId = song.href.substring(1);
    songTitle = song.content;
    var src = 'http://www.brawlcustommusic.com/music/mp3/' + songId + '.mp3';
    $('#nowPlaying').text(songTitle);
    $('audio').attr('src', src);

    // for highlighting the now playing song
    $('#'+songId).attr('class','list-group-item active');
    $('#'+songId).siblings().attr('class','list-group-item');
    if ($('audio')[0].paused) pause();
}

function makeListItem(songId, songTitle, href) {
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
        .tooltip({
            'animation': 'true',
            'toggle': 'click', 
            'title': 'Copied!'
        })
        .appendTo(buttonSpan);
    $('#' + songId).click(function(e) {
        e.preventDefault();
        updateNowPlaying({'content': songTitle, 'href': "/" + songId}, $(this).index());
    });
    $('#songList').append('<button id="copy-button" data-clipboard-text="' + href + '"');
}

// called only when a new game is selected
function listSongs() {
    $('#songList').empty();
    $('#title').text(masterGame);
    // Add each song to the list as a link
    for (var i = 0; i < masterSongList.length; i++) {
        var song = masterSongList[i];
        songId = song.href.substring(1);
        makeListItem(songId, song.content, baseUrl + songId + '.mp3');
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

function pickRandom() {
    var randomGameTitle = gameTitles[ gameTitles.length * Math.random() << 0 ];
    masterGame = randomGameTitle;
    masterSongList = [];
    utils_socket.emit('game', gameDict[masterGame]);
}
