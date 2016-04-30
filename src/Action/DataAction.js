var DataDispatcher = require('../Dispatcher/DataDispatcher.js');

var DataAction = {
	updateCard:function(data){
		DataDispatcher.handleAction({
			actionType:'UPDATE_CARD',
			data:data
		})
	}
}

module.exports = DataAction;