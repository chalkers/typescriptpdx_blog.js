var Blog = require("../");

var tspdxBlog = new Blog();

/**
* When the "end" event is triggered an array of article 
* metadata is returned
**/
tspdxBlog.on("end", console.dir);

/**
* If a parsing, network or HTTP error occurs an
* error object is passed in to the handler or callback
**/
tspdxBlog.on("error", console.error);