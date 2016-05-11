var Dispatcher = require('flux').Dispatcher;

var SearchDispatcher = new Dispatcher();

SearchDispatcher.handleAction = function(action){
	this.dispatch({
		source:'VIEW_ACTION',
		action:action
	});
}


module.exports = SearchDispatcher;