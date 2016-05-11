var SearchDispatcher = require('../Dispatcher/SearchDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var _result = [];


var updateSearchResult = function(result){
	_result = result;
}

var SearchStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getSearchResult:function(){
		return _result;
	}
});

SearchDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'UPDATE_SEARCH_RESULT':
			updateSearchResult(action.data);
			SearchStore.emit('change');
			break;
		default:
			return true;
	}
});

module.exports = SearchStore;