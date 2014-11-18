// Suggestion engine for auto-completion of search queries

// connect browser socket to the server!
// var suggest_socket = io.connect('http://localhost:5000/suggest');
var suggest_socket = io.connect('http://pokesongs.herokuapp.com/suggest');

// Initialize Bloodhound with the 'content' field of each game as the tokenizer
var games = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('content'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    local: []
});

games.initialize();

// Populate the suggestion engine and create a hash table of the games
suggest_socket.on('data', function(data) {
    hashGames(data);
    games.add(data);
    // Replace loading gif with container and enable navbar buttons and inputs
    $(document).ready(function() {
        if ($('#loading') != null) {
            $('#loading').remove();
            $('#main').attr('hidden', false);
        }
        enableButtons();
    });
});

// Initialize typeahead
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
});
