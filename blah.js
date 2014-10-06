var text = "";
var re = /\"s([0-9]*)\"|\"\/\d+\">([^<]*)/gm;

jQuery.ajax = (function(_ajax){
                  var protocol = location.protocol,
                      hostname = location.hostname,
                      exRegex  = RegExp(protocol + '//' + hostname),
                      YQL      = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
                      query    = 'select * from html where url="{URL}" and xpath="*"';
               
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
$.ajax({
       url: 'http://www.brawlcustommusic.com/game/42',
       type: 'GET',
       success: function(res) {
        var str = res.responseText;
        var m;
        var songList = new linkedList();
        var songInfo = [];
        var i=0;
        var j=0;
 
        while ((m = re.exec(str)) !== null) {
          if (m.index === re.lastIndex) {
            re.lastIndex++;
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
        $("audio").on('ended', function() {
          playNext(songList);
        });
        updateNowPlaying(songList, songList.curr.next);
        listSongs(songList);
     }
});

function playNext(songList) {
  updateNowPlaying(songList, songList.curr.next);
}

function updateNowPlaying(songList, song) {
  songList.curr = song;
  console.log("curr: ", songList.curr);
  var title = song.data[1];
  var id = song.data[0];
  $("#nowPlaying").replaceWith("<p id='nowPlaying'>Now Playing: " + title + "</p>");
  $("audio").attr("src", getSrc(song));
}

function listSongs(songList) {
  var n = songList.head.next;
  while (n.next != null) {
    var data = n.data;
    var songId = data[0];
    var songTitle = data[1];
    $("#songList").append("<li id=" + songId + ">" + songTitle + "</li>");
    $("#" + songId).click(function() {
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
    console.log("src: " + path);
    return path;
  }
}

function removeSong(songQueue, id) {
  // Check if the song is currently playing
  // It is not currently playing so just remove it from the list
}
