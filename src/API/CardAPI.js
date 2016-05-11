var Servers = require('../Util/Servers.js');


import AppAPI from './AppAPI';
import CardAction from '../Action/CardAction';
import AppHistory from '../Util/AppHistory';


module.exports ={
	receiveCards:function(limit){
		$.ajax({
			url: Servers.api + '/cards/limit/'+limit,
			type: 'GET',
			success: function(result){
				if(result.status){
					var cards = result.body;
					if(cards == null || cards.length ==0 ) return null;
					// 데이터의 끝에 다다르게 된 경우 처리
					if(cards.length < limit){
						CardAction.endOfData(true)
					}
					CardAction.receiveCards(cards)

				} else {
					console.log(result.body)
				}
			}
		});
	},
	loadNewCards:function(date){
		$.ajax({
			url:Servers.api + '/cards/loadNew/'+date,
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
			url:Servers.api + '/cards/loadMore/'+ OldestCard.date,
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
			url:Servers.api + '/cards/'+card_id,
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
			url:Servers.api + '/cards/'+card_id,
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
			url:Servers.api + '/cards/image',
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
					url:Servers.api + '/cards',
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
	deleteCard:function(card){
		var data = {
			card_id:card._id,
			a_hash:card.A.hash,
			a_id:card.A._id,
			b_hash:card.B.hash,
			b_id:card.B._id
		}

		var getCommentsToDelete = function(image){
			var comments = []
			if(image.comment == null || image.comment.length == 0) return [];
			for(var i=0;i<image.comment.length;i++){
				comments.push({
					_id:image.comment[i]._id
				})
			};
			return comments;
		}

		var Ac = getCommentsToDelete(card.A);
		var Bc = getCommentsToDelete(card.B);
		data.comments = JSON.stringify((Ac).concat(Bc));
		$.ajax({
			url:Servers.api + '/cards/delete',
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
			url: Servers.api + '/cards/image',
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
			url:Servers.api + '/images',
			type:'POST',
			data:image,
			dataType:'json',
			success:function(result){
				console.log(result)
			}
		})
	},
	updateImageLike:function(A,B,section,session){
		var data = {
			A:JSON.stringify(A),
			B:JSON.stringify(B),
			section:section,
			session:JSON.stringify(session)
		}
		$.ajax({
			url:Servers.api + '/images/like',
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
			url:Servers.api + '/images/like',
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
			url:Servers.api + '/images/like/remove',
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
			url:Servers.api + '/votes',
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
			url:Servers.api + '/votes/like',
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
			url:Servers.api + '/votes/like/remove',
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
			url:Servers.api + '/votes/delete',
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
			url:Servers.api + '/votes/update',
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