var DataDispatcher = require('../Dispatcher/DataDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var _data;

const getAgeArray = function(like){
	if(like == null) return [];
	var thisYear = (new Date()).getFullYear();
	var res = [];
	for(var i=0;i<like.length;i++){
		res.push({
			value:thisYear - like[i].author.age,
			user:like[i].author
		})
	}
	return res;
}

const getSexArray = function(like){
	if(like == null) return [];
	var res = [];
	for(var i=0;i<like.length;i++){
		res.push({
			value:like[i].author.sex,
			user:like[i]
		})
	}
	return res;
}

var updateCard = function(card){
	if(_data == null) _data = {};
	_data.A = {},_data.B = {};
	_data.A._age = getAgeArray(card.A.like);
	_data.A._sex = getSexArray(card.A.like);
	_data.B._age = getAgeArray(card.B.like);
	_data.B._sex = getSexArray(card.B.like);
}




var DataStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getData:function(){
		return _data;
	},
	getGeneralLike:function(){
		return _generalLike;
	}
});

DataDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'UPDATE_CARD':
			updateCard(action.data);
			DataStore.emit('change');
			break;
		default:
			return true;
	}
});

module.exports = DataStore;