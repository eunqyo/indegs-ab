var PostDispatcher = require('../Dispatcher/PostDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var _post;

var updatePostSection = function(data){
	if(_post == null) _post = {};
	if(data.idx == 1){
		_post.A = data;
	} else {
		_post.B = data;
	}
}

var updatePostTitle = function(title){
	if(_post == null) _post = {};
	_post.title = title;
}

var updatePostDescription = function(description){
	if(_post == null) _post = {};
	_post.description = description;
}

var emptyPost = function(){
	_post = null;
}

var PostStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getPost:function(){
		return _post;
	}
});

PostDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'UPDATE_POST_SECTION':
			updatePostSection(action.data);
			PostStore.emit('change');
			break;
		case 'UPDATE_POST_TITLE':
			updatePostTitle(action.data);
			PostStore.emit('change');
			break;
		case 'UPDATE_POST_DESCRIPTION':
			updatePostDescription(action.data);
			PostStore.emit('change');
			break;
		case 'EMPTY_POST':
			emptyPost();
			PostStore.emit('change');
			break;

		default:
			return true;
	}
});

module.exports = PostStore;