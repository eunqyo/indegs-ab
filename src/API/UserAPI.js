import Servers from '../Util/Servers';

import UserAction from '../Action/UserAction';
import AppAction from '../Action/AppAction';
import AppAPI from './AppAPI';

module.exports = {
	receiveUser:function(user_id){
		$.ajax({
			url:Servers.api + '/users/'+user_id,
			type:'GET',
			success:function(result){
				if(result.status){
					UserAction.updateUser(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	receiveUserActivities:function(user_id){
		$.ajax({
			url:Servers.api + '/users/activities/'+user_id,
			type:'GET',
			success:function(result){
				if(result.status){
					console.log(result.body)
					// UserAction.updateUserActivities(result.body)
				} else {
					console.log(result.body)
				}
			}

		})
	},
	updatePublished:function(){

	},
	uploadUserPic:function(data,callback){
		var self = this;
		var formData = new FormData();
		formData.append('user_id',data.session._id);
		formData.append('image',data.image);
		formData.append('colorSchema',JSON.stringify(data.colorSchema));
		$.ajax({
			url:Servers.api + '/users/pic',
			type:'POST',
			contentType:false,
			processData:false,
			data:formData,
			success:function(result){
				if(result.status){
					AppAPI.updateSession(result.body)
					UserAction.updateUserPic(result.body);
					callback()
				} else {
					console.log(result.body);
					callback()
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