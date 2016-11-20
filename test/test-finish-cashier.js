var expect = require("chai").expect;
var test = require("./test.js");
var service = require("../index.js");
var conti = require("conti");
var moment = require("moment");
var mConsts = require("myclinic-consts");

describe("Testing finish charge", function(){
	it("case 1", function(done){
		var conn = test.getConnection();
		var visit = {
			patient_id: 1000,
			v_datetime: "2016-11-20 21:53:00",
			shahokokuho_id: 0,
			roujin_id: 0,
			koukikourei_id: 0,
			kouhi_1_id: 0,
			kouhi_2_id: 0,
			kouhi_3_id: 0
		};
		var wqueue = { wait_state: mConsts.WqueueStateWaitCashier };
		var amount = 1000;
		var paytime = "2016-11-20 22:02:03";
		var payments;
		var finishedWqueue;
		conti.exec([
			function(done){
				service.insertVisit(conn, visit, done); 
			},
			function(done){
				wqueue.visit_id = visit.visit_id;
				service.insertWqueue(conn, wqueue, done);
			},
			function(done){
				service.finishCashier(conn, visit.visit_id, amount, paytime, done);
			},
			function(done){
				service.listPayment(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					payments = result;
					done();
				});
			},
			function(done){
				service.findWqueue(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					finishedWqueue = result;
					done();
				});
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(payments).eql([{
				visit_id: visit.visit_id,
				amount: amount,
				paytime: paytime
			}]);
			expect(finishedWqueue).equal(null);
			done();
		});
	});

	it("case 2", function(done){
		var conn = test.getConnection();
		var visit = {
			patient_id: 1000,
			v_datetime: "2016-11-20 21:53:00",
			shahokokuho_id: 0,
			roujin_id: 0,
			koukikourei_id: 0,
			kouhi_1_id: 0,
			kouhi_2_id: 0,
			kouhi_3_id: 0
		};
		var wqueue = { wait_state: mConsts.WqueueStateWaitCashier };
		var amount = 1000;
		var paytime = "2016-11-20 22:02:03";
		var payments;
		var finishedWqueue;
		conti.exec([
			function(done){
				service.insertVisit(conn, visit, done); 
			},
			function(done){
				wqueue.visit_id = visit.visit_id;
				service.insertWqueue(conn, wqueue, done);
			},
			function(done){
				service.insertPharmaQueue(conn, {
					visit_id: visit.visit_id,
					pharma_state: mConsts.PharmaQueueStateWaitPack
				}, done);
			},
			function(done){
				service.finishCashier(conn, visit.visit_id, amount, paytime, done);
			},
			function(done){
				service.listPayment(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					payments = result;
					done();
				});
			},
			function(done){
				service.findWqueue(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					finishedWqueue = result;
					done();
				});
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(payments).eql([{
				visit_id: visit.visit_id,
				amount: amount,
				paytime: paytime
			}]);
			expect(finishedWqueue).eql({
				visit_id: visit.visit_id,
				wait_state: mConsts.WqueueStateWaitDrug
			});
			done();
		});
	});

});

