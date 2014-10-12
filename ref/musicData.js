function musicData(name, id) {
    // fields
    this.name = name;
    this.id = id;

    // methods
    this.getSrc = getSrc;
}

function getSrc() {
    var baseUrl = 'http://www.brawlcustommusic.com/music/mp3/';
    return baseUrl + this.id + '.mp3';
}