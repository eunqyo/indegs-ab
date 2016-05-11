import Servers from '../Util/Servers';

import SearchAction from '../Action/SearchAction';
import { browserHistory } from 'react-router';

module.exports = {
	search:function(text){
		$.ajax({
			url: Servers.api + '/search/'+text,
			type: 'GET',
			success:function(result){
				if(result.status){
					SearchAction.updateSearchResult(result.body)
					// DataAction.updateCard(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	}
}