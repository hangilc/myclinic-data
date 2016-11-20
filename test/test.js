var mysql = require("mysql");
var conti = require("conti");

var dbConfig = {
	host: process.env.MYCLINIC_DB_TEST_HOST || "localhost",
	user: process.env.MYCLINIC_DB_TEST_USER,
	password: process.env.MYCLINIC_DB_TEST_PASS,
	database: "myclinic_test",
	dateStrings: true
};

var conn;

before(function(){
	conn = mysql.createConnection(dbConfig);
});

after(function(done){
	this.timeout(10000);
	var tables = ["disease", "disease_adj", "hoken_koukikourei", "hoken_roujin", "hoken_shahokokuho",
		"hotline", "iyakuhin_master_arch", "kouhi", "patient", "pharma_drug", "pharma_queue", "presc_example",
		"shinryoukoui_master_arch", "shoubyoumei_master_arch", "shuushokugo_master", "stock_drug",
		"tokuteikizai_master_arch", "visit", "visit_charge", "visit_conduct", "visit_conduct_drug",
		"visit_conduct_kizai", "visit_conduct_shinryou", "visit_drug", "visit_gazou_label",
		"visit_payment", "visit_shinryou", "visit_text", "wqueue"];
	conti.forEach(tables, function(table, done){
		conn.query("truncate table " + table, done);
	}, function(err){
		conn.end(function(){
			done(err);
		})
	})
});

exports.getConnection = function(){
	return conn;
};
