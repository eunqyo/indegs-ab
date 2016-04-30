import Servers from '../Util/Servers';

import DataAction from '../Action/DataAction';
import { browserHistory } from 'react-router';

module.exports = {
	getCardData:function(card_id){
		$.ajax({
			url: Servers.api + '/data/'+card_id,
			type: 'GET',
			success:function(result){
				if(result.status){
					DataAction.updateCard(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	}
}