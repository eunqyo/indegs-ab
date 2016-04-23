import credentials from '../../credentials';

import UserAction from '../Action/UserAction';

module.exports = {
	receiveUserCards:function(user_id){
		$.ajax({
			url:credentials.api_server + '/users/cards/'+ user_id,
			type:'GET',
			success:function(result){
				if(result.status){
					var participated = result.body.participated;
					var published = result.body.published;
					UserAction.updateUserCards(result.body);
				} else {
					console.log(result.body)
				}
			}

		})
	},
	addLike:function(session_id,image_id){
		var data = {
			session_id:session_id,
			image_id:image_id
		}
		$.ajax({
			url:credentials.api_server + '/images/like',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					var imageObj = result.body;
					UserAction.updateUserImageLike(imageObj)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	removeLike:function(image){
		var data = {
			image_id:image._id,
			likeObj:JSON.stringify(image.like)
		}
		$.ajax({
			url:credentials.api_server + '/images/like/remove',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					var imageObj = result.body;
					UserAction.updateUserImageLike(imageObj)
				} else {
					console.log(result.body)
				}
			}
		})
	},
}