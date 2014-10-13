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
    for (var i = 0; i < masterSongList.length; i++) {
        var song = masterSongList[i];
        var songId = song.href.substring(1);
        var songTitle = song.content;
        $('#songList').append('<a href=\'#\' class=\'list-group-item\' id=' + songId + '>' + songTitle + '</a>');
        $('#' + songId).click(function(e) {
            e.preventDefault();
            updateNowPlaying({'content': this.text, 'href': "/" + this.id}, $(this).index());
        });
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