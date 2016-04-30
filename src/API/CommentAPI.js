import Servers from '../Util/Servers';

import { browserHistory } from 'react-router';

module.exports = {
	createComment:function(commentObj){
		var data = {};
		data.image_id = commentObj.image_id,
		data.comment = commentObj.comment,
		data.author = commentObj.author._id,
		data.date = commentObj.date,
		data.like = commentObj.like
		$.ajax({
			url: Servers.api + '/comments/',
			type: 'POST',
			data: data,
			dataType: 'json',
			success:function(result){
				if(result.status){
					console.log(result.body)
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