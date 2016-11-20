"use strict";

var db = require("myclinic-db");

Object.keys(db).forEach(function(key){
	exports[key] = db[key];
});

function add(mod){
	Object.keys(mod).forEach(function(key){
		exports[key] = mod[key];
	});
}

add(require("myclinic-db"));
add(require("./src/finish-cashier.js"));

