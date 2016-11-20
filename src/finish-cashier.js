var db = require("myclinic-db");
var conti = require("conti");
var mConsts = require("myclinic-consts");

exports.finishCashier = function(conn, visitId, amount, paytime, done){
	var hasPharmaQueue, wqueue;
	conti.exec([
		function(done){
			db.insertPayment(conn, {
				visit_id: visitId,
				amount: amount,
				paytime: paytime
			}, done);
		},
		function(done){
			db.findPharmaQueue(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				hasPharmaQueue = !!result;
				done();
			});
		},
		function(done){
			db.getWqueue(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				wqueue = result;
				done();
			});
		},
		function(done){
			if( hasPharmaQueue ){
				wqueue.wait_state = mConsts.WqueueStateWaitDrug;
				db.updateWqueue(conn, wqueue, done);
			} else {
				db.deleteWqueue(conn, visitId, done);
			}
		}
	], done);
};

