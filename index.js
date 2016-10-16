"use strict";

var db = require("myclinic-db");

Object.keys(db).forEach(function(key){
	exports[key] = db[key];
});


