var credentials = require('../../credentials.js');

import AnAction from '../Action/AnAction';
import { browserHistory } from 'react-router';

module.exports = {
	getAnalysis:function(card_id){
		$.ajax({
			url: credentials.api_server + '/analysis/'+card_id,
			type: 'GET',
			success:function(result){
				if(result.status){
					AnAction.updateAnalysis(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	receiveAB:function(id){
		var data = {'card_id':id}
		$.ajax({
			url:credentials.api_server + '/cards/'+id,
			type:'GET',
			data:data,
			dataType:'json',
			success:function(result){
				var AB = result.data;
				AB.imageA = JSON.parse(result.data.imageA)
				AB.imageB = JSON.parse(result.data.imageB)
				AppAction.sendAB(AB)
			}
		})
	}
}