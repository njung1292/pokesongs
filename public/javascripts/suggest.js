// connect browser socket to the server!
var suggest_socket = io.connect('http://localhost:5000/suggest');

var games = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('content'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    local: []
});

games.initialize();

// Populate the suggestion engine AND create a hash table of the games
suggest_socket.on('data', function(data) {
    console.log("client received data!");
    hashGames(data);
    games.add(data);
});

$(document).ready(function() {
    $('.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
        },  
        {
        name: 'games',
        displayKey: 'content',
        // `ttAdapter` wraps the suggestion engine in an adapter that
        // is compatible with the typeahead jQuery plugin
        source: games.ttAdapter()
    });

    $()
});
