var Dispatcher = require('flux').Dispatcher;

var PostDispatcher = new Dispatcher();

PostDispatcher.handleAction = function(action){
	this.dispatch({
		source:'VIEW_ACTION',
		action:action
	});
}


module.exports = PostDispatcher;