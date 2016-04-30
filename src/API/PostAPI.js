import Servers from '../Util/Servers';
import UserAction from '../Action/UserAction';
import AppHistory from '../Util/AppHistory';

module.exports = {
	post:function(_post,_session){
		var self = this;
		var date = new Date();

		_post.A.author_id = _session._id;
		_post.B.author_id = _session._id;

		var card = {
			title:_post.title,
			description:_post.description,
			author_id:_session._id,
			A:{
				width:_post.A.image.width,
				height:_post.A.image.height
			},
			B:{
				width:_post.B.image.width,
				height:_post.B.image.height
			}
		}
		self.getSectionFormData(_post.A,function (A){
			self.getSectionFormData(_post.B,function (B){
				var formData = new FormData();
				formData.append('A',A,A.name);
				formData.append('B',B,B.name);
				formData.append('card',JSON.stringify(card));
				self.postCard(formData);
			})
		})
	},
	postCard:function(formData){
		$.ajax({
			xhr: function(){
				var xhr = new window.XMLHttpRequest();
				//Upload progress
				xhr.upload.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						//Do something with upload progress
						console.log(percentComplete);
					}
				}, false);
				//Download progress
				xhr.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						//Do something with download progress
						console.log(percentComplete);
					}
				}, false);
				return xhr;
			},
			url:Servers.api + '/cards',
			type:'POST',
			contentType:false,
			processData:false,
			data:formData,
			success:function(result){
				if(result.status){
					location.href = 'http://localhost:3030';
				} else {
					console.log(result.body);
				}
			}		
		})
	},
	createFileObject:function(path,name,callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            var blob = xhr.response;
            blob.name = name;
            blob.lastModifiedDate = new Date();
            callback(blob)
        });
        xhr.send();
	},
	getSectionFormData:function(section,callback){
		var self = this;
		var file = section.file;
		var image = section.image;

		// 브라우저에서 전송된 경우
		if(file == null){
			var formData = new FormData();

			var origin = {
				type:'web',
				url:image.url
			}

			var salt = (Math.round((new Date().valueOf() * Math.random())) + "").slice(0,6);
			var image = self.createFileObject(image.url,salt,function(data){
				data.origin = origin;
				callback(data);
			})
		} else {
			var formData = new FormData();
			var data = file;
			var origin = {
				type:'local',
				url:file.path
			}
			data.width = image.width;
			data.height = image.height;
			data.origin = origin;
			callback(data);
		}


		// var split = obj.image.split('/');
		// var name = split[split.length-1];
		// this.createFileObject(obj.image,name, function(image){
		// 	var formData = new FormData();
		// 	formData.append('image',image,image.name);
		// 	$.ajax({
		// 		url:credentials.api_server + '/cards/image',
		// 		type:'POST',
		// 		contentType:false,
		// 		processData:false,
		// 		data:formData,
		// 		success:function(result){
		// 			if(result.status){
		// 				callback(result.body);
		// 			} else {
		// 				console.log(result.body);
		// 			}
		// 		}
		// 	})	
		// })
	},
	postImage:function(obj,callback){
		var split = obj.image.split('/');
		var name = split[split.length-1];
		this.createFileObject(obj.image,name, function(image){
			var formData = new FormData();
			formData.append('image',image,image.name);
			$.ajax({
				url:credentials.api_server + '/cards/image',
				type:'POST',
				contentType:false,
				processData:false,
				data:formData,
				success:function(result){
					if(result.status){
						callback(result.body);
					} else {
						console.log(result.body);
					}
				}
			})	
		})
	},
	postCompare:function(postObj,callback){
		var self = this;
		var date = new Date();
		postObj.A.authorId = postObj.session._id;
		postObj.B.authorId = postObj.session._id;
		postObj.A.date = date;
		postObj.B.date = date;

		var data = {
			title:postObj.title,
			text:postObj.text,
			authorId:postObj.session._id,
			date:date
		}
		self.postImage(postObj.A, function(A){
			data.A = A._id;
			self.postImage(postObj.B, function(B){
				data.B = B._id;
				$.ajax({
					url:credentials.api_server + '/cards',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						if(result.status){
							callback(result.body)
							// AppAPI.updatePublished(result.body);
							// CardAction.updateCard(result.body);
							// AppHistory.push('/')
						} else {
							console.log(result.body)
						}
					}
				})
			})
		})
	}
}