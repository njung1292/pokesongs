var text = '';
var gameListUrl = 'http://www.brawlcustommusic.com/gamelist';

jQuery.ajax = (function(_ajax){
                  var protocol = location.protocol,
                      hostname = location.hostname,
                      exRegex  = RegExp(protocol + '//' + hostname),
                      YQL      = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
                      query    = 'select * from html where url=\'{URL}\' and xpath=\'*\'';
               
                  function isExternal(url) {
                    return !exRegex.test(url) && /:\/\//.test(url);
                  }
                  return function(o) {
                            var url = o.url;
                            if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
               
                              // Manipulate options so that JSONP-x request is made to YQL
               
                              o.url = YQL;
                              o.dataType = 'json';
                             
                              o.data = {
                                q: query.replace('{URL}', url + (o.data ? (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data) : '')),
                                format: 'xml'
                              };
               
                              // Since it's a JSONP request
                              // complete === success
                              if (!o.success && o.complete) {
                                o.success = o.complete;
                                delete o.complete;
                              }
               
                              o.success = (function(_success){
                                return function(data) {
                            
                                    if (_success) {
                                        // Fake XHR callback.
                                        _success.call(this, {
                                                      responseText: data.results[0]
                                                      // YQL screws with <script>s
                                                      // Get rid of them
                                                      .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                                                      }, 'success');
                                    }
                            
                                };
                              })(o.success);
                            }
                            return _ajax.apply(this, arguments);        
                          };
                  })(jQuery.ajax);

$(document).ready( function() {
  var songList = new linkedList();
  var songRegEx = /\'s([0-9]*)\'|\'\/\d+\'>([^<]*)/gm;
  var baseUrl = 'http://www.brawlcustommusic.com/game/';

  function addListeners() {
    $('audio').on('ended', function() {
      console.log('song:', songList.curr);
      updateNowPlaying(songList, songList.curr.next);
    });
    $('audio').on('played'), function() { pause() };
    $('audio').on('paused'), function() { pause() };
    $('#back').click(function() {
      updateNowPlaying(songList, songList.curr.prev);
    });
    $('#forward').click(function() {
      updateNowPlaying(songList, songList.curr.next);
    })
    $('#pause').click(function(){ pause() });
    $('#submit').click(function() { getSongs(baseUrl + $('#gameUrl').val()) });
  }

  // Request all the songs
  function getSongs(gameUrl) {
    console.log('getting songs from: ' + gameUrl);
    $.ajax({
           url: gameUrl,
           type: 'GET',
           success: function(res) {
            var str = res.responseText;
            var m = '';
            var songInfo = [];
            songList = new linkedList();
            var i=0;
     
            while ((m = songRe.exec(str)) !== null) {
              if (m.index === songRe.lastIndex) {
                songRe.lastIndex++;
              }
              if (i%2 == 0){
                // Get the song id
                songInfo[0] = m[1];
              } else {
                // Get the song title
                songInfo[1]=m[2];
                songList.add(new node(songInfo));
                songInfo = [];
              }
              i++;
            }
            console.log('songList', songList);
            updateNowPlaying(songList, songList.curr.next);
            listSongs(songList);
         }
    });
  }

  function pause() {
    var audio = $('audio');
    if (audio[0].paused) {
      audio[0].play();
      $('#pause-btn').attr('class','glyphicon glyphicon-pause');
    } else {
      audio[0].pause();
      $('#pause-btn').attr('class','glyphicon glyphicon-play');
    }
  }

  function updateNowPlaying(songList, song) {
    songList.curr = song;
    var title = song.data[1];
    var id = song.data[0];
    $('.nowPlaying').text('Now Playing: ' + title);
    $('audio').attr('src', getSrc(song));
    $('#'+id).attr('class','list-group-item active');
    $('#'+id).siblings().attr('class','list-group-item');
    if ($('audio')[0].paused) pause();
  }

  function listSongs(songList) {
    $('#songList').empty();
    var n = songList.head.next;
    var i = 0;
    while (n.next != null) {
      var data = n.data;
      var songId = data[0];
      var songTitle = data[1];
      $('#songList').append('<a href=\'#\' class=\'list-group-item\' id=' +\
        songId + '>' + songTitle + '</a>');
      $('#' + songId).click(function() {
        updateNowPlaying(songList, songList.find(this.id));
      });
      n = n.next;
    }
  }

  function getSrc(song) {
    var link = 'http://www.brawlcustommusic.com/music/mp3/';
    if (song.next != null) {
      var id = song.data[0];
      var path = link + id + '.mp3';
      return path;
    }
  }
  addListeners();
});

// // Request all the games
// function getGames() {
//   $.ajax({
//           url: gameListUrl,
//           type: 'GET',
//           success: function(res) {
//             var str = res.responseText;
//             console.log('str: ' + str);
//           }
//   });
// }

function removeSong(songQueue, id) {
  // Check if the song is currently playing
  // It is not currently playing so just remove it from the list
}
