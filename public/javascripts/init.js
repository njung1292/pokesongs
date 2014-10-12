$(document).ready( function() {
    // Add event listeners
    $('audio').on('ended', function() {
        console.log('song ended.');
        forward();
    });
    $('audio').on('played'), function() { pause() };
    $('audio').on('paused'), function() { pause() };
    $('#back').click( function() {
        console.log('back');
        back();
    });
    $('#forward').click( function() {
        console.log('forward');
        forward();
    });
    $('#pause').click( function() { pause() });
    $('#gameSearch').submit(function(e) {
        e.preventDefault();
        refreshSongList();
    });
});
