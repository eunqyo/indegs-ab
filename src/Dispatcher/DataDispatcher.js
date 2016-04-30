var Dispatcher = require('flux').Dispatcher;

var DataDispatcher = new Dispatcher();

DataDispatcher.handleAction = function(action){
	this.dispatch({
		source:'VIEW_ACTION',
		action:action
	});
}


module.exports = DataDispatcher;