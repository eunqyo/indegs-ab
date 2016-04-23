var AppDispatcher = require('../Dispatcher/AppDispatcher.js');

var AppAction = {
	updateSession:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_SESSION',
			data:data
		})
	},
	updateUser:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_USER',
			data:data
		})
	},
	changeRoute:function(data){
		AppDispatcher.handleAction({
			actionType:'CHANGE_ROUTE',
			data:data
		})
	},
	updatePostImage:function(data,section){
		AppDispatcher.handleAction({
			actionType:'UPDATE_POST_IMAGE',
			data:data,
			section:section
		})
	},
	updatePostTitle:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_POST_TITLE',
			data:data
		})
	},
	updatePostText:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_POST_TEXT',
			data:data
		})
	}
}

module.exports = AppAction;