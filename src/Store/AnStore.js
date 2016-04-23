var AppDispatcher = require('../Dispatcher/AppDispatcher.js');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var _analysis;
var _generalLike;


var updateAnalysis = function(analysis){
	_analysis = analysis;
	_generalLike = [];
	for(var i =0 ; i < analysis.A.like.length; i ++){
		_generalLike.push({
			section:"a",
			date:analysis.A.like[i].date
		})
	}
	for(var i=0;i<analysis.B.like.length;i++){
		_generalLike.push({
			section:"b",
			date:analysis.B.like[i].date
		})
	}
	console.log('hello')
}




var AnStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getAnalysis:function(){
		return _analysis;
	},
	getGeneralLike:function(){
		return _generalLike;
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'UPDATE_ANALYSIS':
			updateAnalysis(action.data);
			AnStore.emit('change');
			break;
		default:
			return true;
	}
});

module.exports = AnStore;