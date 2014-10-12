// Server-side scraper for html content from a website

var YQL = require('yql');
var query = "select * from html where (url=@url) and (xpath=@xpath)";

// module.exports = {
//     makeQuery : function(url, xpath, callback) {
//         console.log("making query...");
//         var i = 0;

//         while (true) {
//             console.log("attempt: ", i);
//             new YQL.exec(query, function(response) {
//                 if (response.error) {
//                     console.log("error with makeQuery: ", response.error.description);
//                 } else if (response.query.results != null) {
//                     console.log("response:\n", response);
//                     callback(response.query.results.a);
//                     return;
//                 } else {
//                     console.log("no response :( ");
//                 }
//             }, {"url": url, "xpath": xpath});
//             i++;
//         }
//     }
// }

module.exports = {
    makeQuery : function(url, xpath, callback) {
        console.log("making query...");
        new YQL.exec(query, function(response) {
            if (response.error) {
                console.log("error with makeQuery: ", response.error.description);
            } else if (response.query.results != null) {
                console.log("response:\n", response);
                callback(response.query.results.a);
            } else {
                console.log("no response :( ");
                callback([]);
            }
        }, {"url": url, "xpath": xpath});
    }
}