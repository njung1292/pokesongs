$(document).ready( function() {
    // Add event listeners
    $(document).keypress(function(e) {
        if ((e.which == 32) && (e.target = document.body)) {
            e.preventDefault();
            pause();
        } else if (e.which == 37) {
            back();
        } else if (e.which == 39) {
            forward();
        }
    });
    $('audio').on('ended', function() {
        forward();
    });
    $('audio').on('played'), function() { pause() };
    $('audio').on('paused'), function() { pause() };
    $('#back').click( function() { back() });
    $('#forward').click( function() { forward() });
    $('#pause').click( function() { pause() });
    $('#gameSearch').submit(function(e) {
        e.preventDefault();
        refreshSongList();
    });
    $('#game').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            refreshSongList();
        }
    });
});
