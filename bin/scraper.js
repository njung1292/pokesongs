// Server-side scraper for html content from a website

var YQL = require('yql');
var query = "select * from html where (url=@url) and (xpath=@xpath)";

module.exports = {
    makeQuery : function(url, xpath, callback) {
        new YQL.exec(query, function(response) {
            if (response.error) {
                console.log("error with makeQuery: ", response.error.description);
                callback([]);
            } else if (response.query.results != null) {
                if (response.query.results.a instanceof Array) {
                    // Got an array of results
                    callback(response.query.results.a);
                } else {
                    // Got one object as a result
                    callback([response.query.results.a]);
                }
            } else {
                // Got no results
                console.log("No results");
                callback([]);
            }
        }, {"url": url, "xpath": xpath});
    }
}