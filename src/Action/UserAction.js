var UserDispatcher = require('../Dispatcher/UserDispatcher.js');

var UserAction = {
	updateUser:function(data){
		UserDispatcher.handleAction({
			actionType:'UPDATE_USER',
			data:data
		})
	},
	updateUserPic:function(data){
		UserDispatcher.handleAction({
			actionType:'UPDATE_USER_PIC',
			data:data
		})
	},
	updateUserActivities:function(data){
		UserDispatcher.handleAction({
			actionType:'UPDATE_USER_ACTIVITIES',
			data:data
		})
	},
	updateParticipated:function(data){
		UserDispatcher.handleAction({
			actionType:'UPDATE_PARTICIPATED',
			data:data
		})
	},
	changeMode:function(data){
		UserDispatcher.handleAction({
			actionType:'CHANGE_MODE',
			data:data
		})
	},
	updateUserImageLike:function(data){
		UserDispatcher.handleAction({
			actionType:'UPDATE_USER_IMAGE_LIKE',
			data:data
		})
	}
}

module.exports = UserAction;