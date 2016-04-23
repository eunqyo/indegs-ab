var AppDispatcher = require('../Dispatcher/AppDispatcher.js');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
// var AppAPI = require('../API/AppAPI.js');


var login = false;
var _card;
var route;
var _post = {"A":null,"B":null,"title":null,"text":null};
var _AB={};
var _session = false;
var _upload = {}
var _user;

var updatePostImage = function(file,section){
	if(section == 'a'){
		_post.A = file
	} else {
		_post.B = file
	}
	// if(obj.section == 'a') _post.imageA = obj;
	// else _post.imageB = obj;
}

var updatePostTitle = function(title){
	if(title.length == 0 || title == null){
		_post.title = null
	} else {
		_post.title = title;
	}
}

var updatePostText = function(text){
	if(text.length == 0 || text == null){
		_post.text = null
	} else {
		_post.text = text;
	}
}


var updateAB = function(id){
	function find(id,_card){
		for(var i=0;i<_card.length;i++){
			if(_card[i]._id == id){
				_AB = _card[i]
			}
		}
	}
	find(id,_card)
}

var sendAB = function(data){
	_AB = data
}


var compare = function(a,b){
	if(a._id < b._id){return 1;}
	if(a._id > b._id){return -1;}
	return 0;
}

var updateCard = function(card){
	if(_card != undefined){
		function find(card, _card){
			for(var i=0;i<_card.length;i++){
				if(_card[i]._id == card._id){
					_card[i] = card;
					_card.sort(compare)
					break;
				}
			}
			if(i == _card.length){
				_card.unshift(card);
				_card.sort(compare);
			}
		}
		find(card, _card);
	} else {
		_card = [];
		_card.push(card);
	}
}

var updateSession = function(session){
	_session = session;
}

var updateUser = function(user){
	_user = user;
	if(_session!=null&&_user!=null&&_session._id == _user._id){
		_session = _user;
	}
}

var changeRoute = function(r){
	route = r
}

var updateUpload = function(upload){
	_upload = upload
}

var updateLike = function(image){
	function find(image,_card){
		for(var i=0;i<_card.length;i++){
			if(_card[i].imageA._id == image._id){
				_card[i].imageA == image 
			}
		}
	}
	find(image,_card);
}

var AppStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getSession:function(){
		return _session
	},
	getUser:function(){
		return _user
	},
	getCard:function(){
		return _card
	},
	getRoute:function(){
		return route
	},
	getPost:function(){
		return _post
	},
	getAB:function(){
		return _AB
	},
	getUpload:function(){
		return _upload
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'UPDATE_SESSION':
			updateSession(action.data);
			AppStore.emit('change');
			break;
		case 'UPDATE_USER':
			updateUser(action.data);
			AppStore.emit('change');
			break;
		case 'CHANGE_ROUTE':
			changeRoute(action.data);
			AppStore.emit('change');
			break;
		case 'UPDATE_POST_IMAGE':
			updatePostImage(action.data,action.section);
			AppStore.emit('change');
			break;
		case 'UPDATE_POST_TITLE':
			updatePostTitle(action.data);
			AppStore.emit('change');
			break;
		case 'UPDATE_POST_TEXT':
			updatePostText(action.data);
			AppStore.emit('change');
			break;
		default:
			return true;
	}
});

module.exports = AppStore;