var AppDispatcher = require('../Dispatcher/AppDispatcher.js');

var AnAction = {
	updateAnalysis:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_ANALYSIS',
			data:data
		})
	}
}

module.exports = AnAction;