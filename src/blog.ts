/// <reference path="../typings/tsd.d.ts" />

import events = require("events");
import http = require("http");
import libxmljs = require("libxmljs");


class Blog extends events.EventEmitter {
	
	constructor(private rssfeed: string = ""){
		super();
		let request = http.get("http://typescriptpdx.com/feed.xml", response => {
			if (response.statusCode !== 200 && response.statusCode !== 302) {
            	request.abort();
            	//Status Code Error
            	this.handleError(new Error(`There was an error getting the RSS feed for TypeScript PDX. (${http.STATUS_CODES[response.statusCode]})`));
        	} 
			//Read the data
        	response.on('data', this.handleData.bind(this))
			.on("error", this.handleError.bind(this))
			.on('end', () => {
				if(response.statusCode === 200 || response.statusCode === 302) this.handleEnd();	
			});
		});
		return this;
	}
	
	private parseNode(node): IBlogPost {
    	return {
        	title: node.get("title").text(),
        	link: node.get("link").text(),
        	publishDate: new Date(node.get("pubDate").text())
    	}     
	}
	
	private handleError(error: Error) {
		this.emit("error", error);
	}
	
	private handleData(chunk) {
		this.rssfeed += chunk;
	}
	
	private handleEnd() {
		try {
        	//Parse the data
			var xmlDoc = libxmljs.parseXmlString(this.rssfeed);                 
			var articles = xmlDoc.find("//rss/channel/item").map(this.parseNode.bind(this));
			this.emit("end", articles);
		} catch (error) {
			this.emit("error", error);
		}    		
	}
}

module.exports = Blog;