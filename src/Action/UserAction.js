var AppDispatcher = require('../Dispatcher/AppDispatcher.js');

var UserAction = {
	updateUserCards:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_USER_CARDS',
			data:data
		})
	},
	updateParticipated:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_PARTICIPATED',
			data:data
		})
	},
	changeMode:function(data){
		AppDispatcher.handleAction({
			actionType:'CHANGE_MODE',
			data:data
		})
	},
	updateUserImageLike:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_USER_IMAGE_LIKE',
			data:data
		})
	}
}

module.exports = UserAction;