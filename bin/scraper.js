// Server-side scraper for html content from a website

var YQL = require('yql');
var query = "select * from html where (url=@url) and (xpath=@xpath)";

module.exports = {
    makeQuery : function(url, xpath, callback) {
        new YQL.exec(query, function(response) {
            if (response.error) {
                console.log("error with makeQuery: ", response.error.description);
            } else if (response.query.results != null) {
                //response.qurey.results.a is an ARRAY of js object of the form
                // {"href": "/game/{GAMEID}", "content": "{TITLE}"}
                console.log("response:\n", response);
                callback(response.query.results.a);
            } else {
                console.log("no response :( ");
                callback([]);
            }
        }, {"url": url, "xpath": xpath});
    }
}