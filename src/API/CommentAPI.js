import Servers from '../Util/Servers';
import AppStore from '../Store/AppStore';

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
	deleteComment:function(commentObj){
		$.ajax({
			url: Servers.api + '/comments/delete',
			type: 'POST',
			data: commentObj,
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
	updateCommentLike:function(comment){
		var data = {
			_id:comment._id,
			date:comment.date,
			like:JSON.stringify(comment.like)
		}
		$.ajax({
			url: Servers.api + '/comments/like',
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
	}
}