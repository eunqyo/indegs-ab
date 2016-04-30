var DataDispatcher = require('../Dispatcher/DataDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var _card;
var _data;

var getImageLikers = function(image){
	var ALikers = [];
	var like = image.like;
	if(like == null || like.length == 0) return null;
	for(var i=0;i<like.length;i++){
		ALikers.push(like[i].author);
	};
	return ALikers;
}

var getLikesBySex = function(image){
	var res = {}
	res.menLikes = 0;
	res.womenLikes = 0;
	var like = image.like;
	if(like == null || like.length == 0) return res;
	for(var i=0;i<like.length;i++){
		if(like[i].author.sex == 0){
			res.menLikes ++ 
		} else {
			res.womenLikes ++
		}
	}
	return res;
}


var updateCard = function(card){
	_card = card;
	_data = {};
	_data.ALikers = getImageLikers(_card.A);
	_data.BLikers = getImageLikers(_card.B);
	_data.ALikes = getLikesBySex(_card.A);
	_data.BLikes = getLikesBySex(_card.B);
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