var credentials = require('../../credentials.js');


import AppAPI from './AppAPI';
import CardAction from '../Action/CardAction';
import AppHistory from '../Util/AppHistory';


module.exports ={
	receiveCards:function(){
		$.ajax({
			url: credentials.api_server + '/cards',
			type: 'GET',
			success: function(result){
				if(result.status){
					var cards = result.body;
					if(cards == null || cards.length ==0 ) return null;
					// 데이터의 끝에 다다르게 된 경우 처리
					if(cards.length <= 4){
						CardAction.endOfData(true)
					}
					CardAction.receiveCards(cards)

				} else {
					console.log(result.body)
				}
			}
		});
	},
	loadNewCards:function(LatestCard){
		$.ajax({
			url:credentials.api_server + '/cards/loadNew/'+LatestCard.date,
			type:'GET',
			success:function(result){
				if(result.status){
					var cards = result.body;
					if(cards == null || cards.length == 0) {
						return null;
					} else {
						CardAction.receiveNewCards(cards)
					}
				} else {
					console.log(result.body)
				}
			}
		})
	},
	loadMoreCards:function(OldestCard){
		$.ajax({
			url:credentials.api_server + '/cards/loadMore/'+ OldestCard.date,
			type:'GET',
			success:function(result){
				if(result.status){
					var cards = result.body;
					if(cards == null || cards.length ==0 ){
						CardAction.endOfData(true)
					} else {
						if(cards.length <= 4){
							CardAction.endOfData(true)
						}
						CardAction.receiveCards(cards)
					}
				} else {
					console.log(result.body)
				}
			}
		})
	},
	receiveCard:function(card_id){
		var self = this;
		$.ajax({
			url:credentials.api_server + '/cards/'+card_id,
			type:'GET',
			success:function(result){
				if(result.status){
					CardAction.updateCard(result.body);
				} else {
					console.log(result.body)
				}
			}
		})
	},
	receiveAB:function(card_id){
		var self = this;
		$.ajax({
			url:credentials.api_server + '/cards/'+card_id,
			type:'GET',
			success:function(result){
				if(result.status){
					CardAction.receiveAB(result.body);
				} else {
					console.log(result.body)
				}
			}
		})
	},
	postImage:function(image,callback){
		var formData = new FormData();
		formData.append('image',image)
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
	},
	postCard:function(postObj){
		var self = this;
		var date = new Date();
		postObj.A.authorId = postObj.session_id;
		postObj.B.authorId = postObj.session_id;
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
							AppAPI.updatePublished(result.body);
							CardAction.updateCard(result.body);
							AppHistory.push('/')
						} else {
							console.log(result.body)
						}
					}
				})
			})
		})
	},
	deleteCard:function(card_id){
		var data = {'card_id':card_id}
		$.ajax({
			url:credentials.api_server + '/cards/delete',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				location.href = '/'
			}
		})
	},
	receiveImage:function(id,callback){
		var data = {'id':id}
		$.ajax({
			url: credentials.api_server + '/cards/image',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				callback(result)
			}
		})
	},
	updateImage:function(image){
		$.ajax({
			url:credentials.api_server + '/images',
			type:'POST',
			data:image,
			dataType:'json',
			success:function(result){
				console.log(result)
			}
		})
	},
	updateImageLike:function(A,B){
		var data = {
			A:JSON.stringify(A),
			B:JSON.stringify(B)
		}
		$.ajax({
			url:credentials.api_server + '/images/like',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					console.log(result.body)
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
					// CardAction.updateImageLike(imageObj)
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
					// CardAction.updateImageLike(imageObj)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	createVote:function(session_id,title,image){
		var data = {
			session_id:session_id,
			title:title,
			image_id:image._id
		}
		$.ajax({
			url:credentials.api_server + '/votes',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					var voteObj = result.body;
					image.vote.push(voteObj)
					CardAction.createVote(image)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	addVoteLike:function(session_id,vote){
		var data = {
			session_id:session_id,
			vote_id:vote._id
		}
		$.ajax({
			url:credentials.api_server + '/votes/like',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					var voteObj = result.body;
					vote.like = voteObj.like;
					CardAction.updateVote(vote);
				} else {
					console.log(result.body)
				}
			}
		})
	},
	removeVoteLike:function(vote){
		var data = {
			vote_id:vote._id,
			likeObj:JSON.stringify(vote.like)
		}
		$.ajax({
			url:credentials.api_server + '/votes/like/remove',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					CardAction.updateVote(result.body);
				} else {
					console.log(result.body)
				}
			}
		})
	},
	deleteVote:function(vote){
		$.ajax({
			url:credentials.api_server + '/votes/delete',
			type:'POST',
			data:vote,
			dataType:'json',
			success:function(result){
				if(result.status){
					CardAction.updateImage(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	updateVote:function(vote){
		var data = vote;
		data.liker = JSON.stringify(vote.liker);
		$.ajax({
			url:credentials.api_server + '/votes/update',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					CardAction.updateImage(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	}
}