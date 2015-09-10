var assert = require("chai").assert;
var fs = require("fs");
var nock = require("nock");
var Blog = require("../");

var POSTS = [ { title: 'WebStorm and TypeScript',
    link: 'http://typescriptpdx.com/blog/2015/07/webstorm-and-typescript',
    publishDate: new Date("Sat Jul 25 2015 17:00:00 GMT-0700 (PDT)") },
  { title: 'TypeScript - A Brief Overview',
    link: 'http://typescriptpdx.com/blog/2015/07/typescript-a-brief-overview',
    publishDate: new Date("Sun Jul 12 2015 17:00:00 GMT-0700 (PDT)") } ];


describe("Blog", function(){
    describe("parsing", function() {
        it("should return the blog posts on 200", function(done){
            nock('http://typescriptpdx.com')
                .get('/feed.xml')
                .reply(200, function (uri, requestBody) {
                    return fs.createReadStream(__dirname + '/feed.xml', 'utf8')
                });
            var tspdxBlog = new Blog();    
            tspdxBlog.on("end", function(articles) {
                assert.isArray(articles, "should be an array");
                assert.lengthOf(articles, 2, "The articles array should be 2 in length");
                assert.deepEqual(articles, POSTS, "Articles were not as expected");
                done();
            });
            tspdxBlog.on("error", console.error);
        });
        
        it("should return the blog posts on 302", function(done){
            nock('http://typescriptpdx.com')
                .get('/feed.xml')
                .reply(302, function (uri, requestBody) {
                    return fs.createReadStream(__dirname + '/feed.xml', 'utf8')
                });
            var tspdxBlog = new Blog();    
            tspdxBlog.on("end", function(articles) {
                assert.isArray(articles, "should be an array");
                assert.lengthOf(articles, 2, "The articles array should be 2 in length");
                assert.deepEqual(articles, POSTS, "Articles were not as expected");
                done();
            });
            tspdxBlog.on("error", console.error);
        });
        it("should error on 404", function(done){
            nock('http://typescriptpdx.com')
                .get('/feed.xml')
                .reply(404, function (uri, requestBody) {
                    return fs.createReadStream(__dirname + '/feed.xml', 'utf8')
                });
            var tspdxBlog = new Blog();    
            tspdxBlog.on("end", console.log);
            tspdxBlog.on("error", function(e){
                assert.equal(e.message, "There was an error getting the RSS feed for TypeScript PDX. (Not Found)")
                done();
            });
        });  
    });
});
