var UserDispatcher = require('../Dispatcher/UserDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var _cards;
var _mode;
var _published;
var _participated;
var _user;
var _activity;

var sortByDate = function(a,b){
	if(a.date < b.date){return 1;}
	if(a.date > b.date){return -1;}
	return 0;
}

var updateUser = function(userObj){
	_user = userObj.user;
	_activity = userObj.activity;
}

var updateUserPic = function(userObj){
	_user = userObj;
}

var updateUserActivities = function(data){
	if(data == null) return null;
	else {
		_published = data.published;
		_participated = data.participated;
		console.log(_published)
	}
}

var updateUserImageLike = function(imageObj){
	var published = _cards.published;
	var participated = _cards.participated;
	for(var i = 0; i < published.length; i++){
		if(published[i].card.A._id == imageObj._id){
			published[i].card.A.like = imageObj.like;
			break;
		}
		if(published[i].card.B._id == imageObj._id){
			published[i].card.B.like = imageObj.like;
			break;
		}
	}
	for(var i = 0; i < participated.length; i++){
		if(participated[i].card.A._id == imageObj._id){
			participated[i].card.A.like = imageObj.like;
			break;
		}
		if(participated[i].card.B._id == imageObj._id){
			participated[i].card.B.like = imageObj.like;
			break;
		}
	}
};


var updateParticipated = function(participated){
	_participated = participated;
}

var changeMode = function(mode){
	_mode = mode;
}


var UserStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getUser:function(){
		return _user;
	},
	getActivity:function(){
		return _activity;
	},
	getUserCards:function(){
		return _cards;
	},
	getPublished:function(){
		return _published;
	},
	getParticipated:function(){
		return _participated;
	},
	getMode:function(){
		return _mode;
	}
});

UserDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'UPDATE_USER':
			updateUser(action.data);
			UserStore.emit('change');
			break;
		case 'UPDATE_USER_PIC':
			updateUserPic(action.data);
			UserStore.emit('change');
			break;
		case 'UPDATE_USER_ACTIVITIES':
			updateUserActivities(action.data);
			UserStore.emit('change');
			break;
		case 'UPDATE_USER_IMAGE_LIKE':
			updateUserImageLike(action.data);
			UserStore.emit('change');
			break;
		case 'UPDATE_PARTICIPATED':
			updateParticipated(action.data);
			UserStore.emit('change');
			break;
		case 'CHANGE_MODE':
			changeMode(action.data);
			UserStore.emit('change');
			break;

		default:
			return true;
	}
});

module.exports = UserStore;