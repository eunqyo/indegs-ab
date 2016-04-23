var AppDispatcher = require('../Dispatcher/AppDispatcher.js');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var _card;
var _AB;
var _endOfData;
var _new;

var updatePostImage = function(file,section){
	if(section == 'a'){
		_post.imageA = file
	} else {
		_post.imageB = file
	}
	// if(obj.section == 'a') _post.imageA = obj;
	// else _post.imageB = obj;
}

var updatePostTitle = function(title){
	if(title.length == 0 || title == null){
		_post.title = null
	} else {
		_post.title = title;
	}
}

var compare = function(a,b){
	if(a.date < b.date){return 1;}
	if(a.date > b.date){return -1;}
	return 0;
}

var sortByLike = function(a,b){
	if(a.like < b.like){return 1}
	if(a.like > b.like){return -1}
	return 0;
}
var byVoteLike = function(a,b){
	if(a.like.length < b.like.length){return 1}
	if(a.like.length > b.like.length){return -1}
	return 0;
}

var updateCard = function(card){
	if(_card != undefined){
		function find(card, _card){
			for(var i=0;i<_card.length;i++){
				if(_card[i]._id == card._id){
					_card[i] = card;
					_card.sort(compare)
					break;
				}
			}
			if(i == _card.length){
				_card.unshift(card);
				_card.sort(compare);
			}
		}
		find(card, _card);
	} else {
		_card = [];
		_card.push(card);
	}
};

var receiveCards = function(cards){
	if(_card != null){
		for(var i=0;i<cards.length;i++){
			for(var k=0;k<_card.length;k++){
				if(cards[i]._id == _card[k]._id){
					_card[k] == cards[i];
					break;
				}
			}
			if(k==_card.length){
				_card.unshift(cards[i])
			}
		}
	} else {
		_card = [];
		_card = cards;
	}
	_card.sort(compare);
}

var updateAB = function(_id){
	function find(_id,_card){
		for(var i=0;i<_card.length;i++){
			if(_card[i]._id == _id){
				_AB = _card[i]
			}
		}
	}
	find(_id,_card);
	_AB.A.vote.sort(byVoteLike);
	_AB.B.vote.sort(byVoteLike);
}

var receiveAB = function(AB){
	_AB = AB;
	_AB.A.vote.sort(byVoteLike);
	_AB.B.vote.sort(byVoteLike);
}

var emptyAB = function(){
	_AB = null;
}

var updateABImage = function(image){
	if(_AB.A._id == image._id){
		_AB.A = image;
	} else {
		_AB.B = image;
	}
}


var updateImage = function(image){
	for(var i=0;i<_card.length;i++){
		if(_card[i]._id == image.card_id){
			if(_card[i].A._id == image._id){
				_card[i].A == image;
				_card[i].A.liker = image.liker;
				_card[i].A.vote = image.vote;
				_card[i].A.vote.sort(sortByLike)
			} else {
				_card[i].B == image;
				_card[i].B.liker = image.liker;
				_card[i].B.vote = image.vote;
				_card[i].B.vote.sort(sortByLike)
			}
			if(_AB!=null&&_AB._id==_card[i]._id){
				_AB == _card[i];
			}
			break;
		}
	}

}

var updateLike = function(image){
	function find(image,_card){
		for(var i=0;i<_card.length;i++){
			if(_card[i].imageA._id == image._id){
				_card[i].imageA == image;
			}
			if(_card[i].imageB._id == image._id){
				_card[i].imageB == image;
			}
		}
	}
	find(image,_card);
};

var updateImageLike = function(imageObj){
	for(var i = 0; i < _card.length; i++){
		if(_card[i].A._id == imageObj._id){
			_card[i].A.like = imageObj.like;
			break;
		}
		if(_card[i].B._id == imageObj._id){
			_card[i].B.like = imageObj.like;
			break;
		}
	}
};

var createVote = function(imageObj){
	for(var i=0;i<_card.length;i++){
		if(_card[i].A._id == imageObj._id){
			_card[i].A.vote = imageObj.vote;
			break;
		}
		if(_card[i].B._id == imageObj._id){
			_card[i].B.vote = imageObj.vote;
			break;
		}
	}
}

var updateVote = function(voteObj){
	for(var i=0;i<_card.length;i++){
		if(_card[i].A._id == voteObj.image_id){
			var _vote = _card[i].A.vote;
			break;
		}
		if(_card[i].B._id == voteObj.image_id){
			var _vote = _card[i].B.vote;
			break;
		}
	}
	for(var i=0;i<_vote.length;i++){
		if(_vote[i]._id == voteObj._id){
			_vote[i].like = voteObj.like;
			console.log(_vote[i])
			break;
		}
	}
	_vote.sort(byVoteLike)
}

var endOfData = function(bool){
	_endOfData = bool;
}

var receiveNewCards = function(cards){
	if(_new != null){
		for(var i=0;i<cards.length;i++){
			for(var k=0;k<_new.length;k++){
				if(cards[i]._id == _new[k]._id){
					_new[k] == cards[i];
					break;
				}
			}
			if(k==_new.length){
				_new.unshift(cards[i])
			}
		}
	} else {
		_new = [];
		_new = cards;
	}
	_new.sort(compare);
};

var emptyNewCards = function(){
	_new = null;
}

var CardStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getCard:function(){
		return _card;
	},
	getNew:function(){
		return _new;
	},
	getAB:function(){
		return _AB;
	},
	getEndOfData:function(){
		return _endOfData;
	},
	getCardByImage:function(id){
		for(var i=0;i<_card.length;i++){
			if(_card[i].imageA._id == id || _card[i].imageB._id == id){
				return _card[i]._id
			}
		}
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'RECEIVE_CARDS':
			receiveCards(action.data);
			CardStore.emit('change');
			break;
		case 'RECEIVE_NEW_CARDS':
			receiveNewCards(action.data);
			CardStore.emit('change');
			break;
		case 'EMPTY_NEW_CARDS':
			emptyNewCards();
			CardStore.emit('change');
			break;

		case 'UPDATE_CARD':
			updateCard(action.data);
			CardStore.emit('change');
			break;
		case 'UPDATE_LIKE':
			updateLike(action.data);
			CardStore.emit('change');
			break;
		case 'UPDATE_IMAGE':
			updateImage(action.data);
			CardStore.emit('change');
			break;
		case 'UPDATE_IMAGE_LIKE':
			updateImageLike(action.data);
			CardStore.emit('change');
			break;
		case 'CREATE_VOTE':
			createVote(action.data);
			CardStore.emit('change');
			break;
		case 'UPDATE_VOTE':
			updateVote(action.data);
			CardStore.emit('change');
			break;
		case 'UPDATE_AB':
			updateAB(action.data);
			CardStore.emit('change');
			break;
		case 'RECEIVE_AB':
			receiveAB(action.data);
			CardStore.emit('change');
			break;
		case 'EMPTY_AB':
			emptyAB();
			CardStore.emit('change');
			break;
		case 'UPDATE_AB_IMAGE':
			updateABImage(action.data);
			CardStore.emit('change');
			break;
		case 'END_OF_DATA':
			endOfData(action.data);
			CardStore.emit('change');
			break;
		default:
			return true;
	}
});

module.exports = CardStore;