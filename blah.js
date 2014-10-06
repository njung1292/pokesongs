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
        var songQueue = [];
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
            songInfo[1] = m[2];
            songQueue[j] = songInfo;
            songList.add(new node(songInfo));
            j++;
			songInfo = [];
          }
          i++;
        }
        updateNowPlaying(songList);
        listSongs(songList);
     }
});

function updateNowPlaying(songList){
  var title = songList.head.next.data[1];
  var id = songList.head.next.data[0];
  var audio = document.createElement("audio");
  var source = document.createElement("source");
  displayHeadTitle(title);
  audio.controls = true;
  source.type ="audio/mpeg";
  source.src = getHeadSrc(songList);
  audio.appendChild(source);
  document.getElementById("player").appendChild(audio);
}

function listSongs(songList) {
  var n = songList.head.next;
  while (n.next != null) {
    var data       = n.data;
    var songId     = data[0];
    var songTitle  = data[1];
    var li       = document.createElement("li");
    li.id        = songId;
    var titleText  = document.createTextNode(songTitle);
    li.appendChild(titleText);
    document.getElementById("songList").appendChild(li);
	}
}

function displayHeadTitle(title) {
  var titleNode = document.createTextNode("Now Playing: " + title);
  document.getElementById("nowPlaying").appendChild(titleNode);
}


function getHeadSrc(songList) {
  var link = 'http://www.brawlcustommusic.com/music/mp3/';
  if (songList.head.next != null) {
    var id = songList.head.next.data[0];
    var path = link + id + '.mp3';
    return path;
  }
}

function removeSong(songList, songId) {
  console.log("removing: " + songId);
  // Check if the song is currently playing
  if (songList.head.next.data[0] == songId) {
  }
  // It is not currently playing so just remove it from the list
  else {
	var n = songList.find(songId);
	songList.remove(n);
	var p = document.getElementById(songId);
	p.parentNode.removeChild(p);
  }
		

