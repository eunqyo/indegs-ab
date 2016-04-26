var PostDispatcher = require('../Dispatcher/PostDispatcher.js');

var PostAction = {
	updatePostSection:function(data){
		PostDispatcher.handleAction({
			actionType:'UPDATE_POST_SECTION',
			data:data
		})
	},
	updatePostTitle:function(data){
		PostDispatcher.handleAction({
			actionType:'UPDATE_POST_TITLE',
			data:data
		})
	},
	updatePostDescription:function(data){
		PostDispatcher.handleAction({
			actionType:'UPDATE_POST_DESCRIPTION',
			data:data
		})
	},
	emptyPost:function(){
		PostDispatcher.handleAction({
			actionType:'EMPTY_POST'
		})
	}
}

module.exports = PostAction;