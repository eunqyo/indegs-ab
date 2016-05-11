var SearchDispatcher = require('../Dispatcher/SearchDispatcher.js');



var SearchAction = {
	updateSearchResult:function(data){
		SearchDispatcher.handleAction({
			actionType:'UPDATE_SEARCH_RESULT',
			data:data
		})
	}
}

module.exports = SearchAction;