import React from 'react';
import { Link,browserHistory } from 'react-router';
import { findDOMNode } from "react-dom";

import AppStore from '../Store/AppStore';
import AppAPI from '../API/AppAPI';

import CardAPI from '../API/CardAPI';
import CardStore from '../Store/CardStore';
import CardAction from '../Action/CardAction';

import Servers from '../Util/Servers';
import Util from '../Util/Util';
import AppHistory from '../Util/AppHistory';
import Dates from '../Util/Dates';

const CardLike = React.createClass({
	handleClick:function(){
		var section = this.props.section;
		this.props.onLikeClick(section)
	},
	render:function(){
		var likeCnt = this.props.likeCnt;
		var liked = this.props.liked;
		var section = this.props.section;
		var likeClass;
		if(liked){
			likeClass = "card-like liked"
		} else {
			likeClass = "card-like"
		}
		return (
			<div className={likeClass} onClick={this.handleClick}>
				<div className="btn"></div>
				<span className="count">{likeCnt}</span>
			</div>
		)
	}
});

const CardLikes = React.createClass({
	getInitialState:function(){
		return ({
			ALike:null,
			BLike:null
		})
	},
	componentDidMount:function(){
		this.checkUserLike()
	},
	componentWillReceiveProps:function(nextProps){
		this.checkUserLike()
	},
	checkUserLike:function(session){
		var self = this;
		var card = this.props.card;
		var session = this.props.session;

		if(!session) return null;
		this.checkSectionLike(card.A,function (ALike){
			self.checkSectionLike(card.B,function (BLike){
				self.setState({
					ALike:ALike,
					BLike:BLike
				})
			})
		});	
	},
	checkSectionLike:function(section,callback){
		if(section.like.length == 0) callback(false);

		var session = this.props.session;
		for(var i=0;i<section.like.length;i++){
			if(section.like[i].author == session._id){
				break;
			}
		}
		if(i == section.like.length){
			callback(false);
		} else {
			callback(true);
		}
	},
	handleLike:function(section){
		var session = this.props.session;
		if(session==null) return null;
		var self =this;
		var card = this.props.card;
		var ALike = this.state.ALike;
		var BLike = this.state.BLike;
		if(section=='a'){
			if(ALike){
				self.removeLike(card.A,function (A){
					card.A = A;
					CardAction.updateCard(card);
				});
			} else {
				self.addLike(card.A,function (A){
					if(BLike){
						self.removeLike(card.B,function (B){
							card.A = A;
							card.B = B;
							CardAction.updateCard(card);
						})
					} else {
						card.A = A;
						CardAction.updateCard(card);
					}
				})
			}
		} else {
			if(BLike){
				self.removeLike(card.B,function (B){
					card.B = B;
					CardAction.updateCard(card);
				});
			} else {
				self.addLike(card.B,function (B){
					if(ALike){
						self.removeLike(card.A,function (A){
							card.A = A;
							card.B = B;
							CardAction.updateCard(card);
						})
					} else {
						card.B = B;
						CardAction.updateCard(card);
					}
				})
			}
		}
		CardAPI.updateImageLike(card.A,card.B);
	},
	addLike:function(section,callback){
		var session = this.props.session;
		var likeObj = {
			date:new Date(),
			author:session._id
		}
		section.like.push(likeObj);
		callback(section);
	},
	removeLike:function(section,callback){
		var session = this.props.session;
		for(var i=0;i<section.like.length;i++){
			if(section.like[i].author == session._id){
				section.like.splice(i,1);
				break;
			}
		}
		callback(section);
	},
	render:function(){
		var session = this.props.session;
		var card = this.props.card;
		var ALike = this.state.ALike;
		var BLike = this.state.BLike;
		return (
			<div className="card-likes">
				<CardLike section={'a'} likeCnt={card.A.like.length} liked={ALike} onLikeClick={this.handleLike} />
				<CardLike section={'b'} likeCnt={card.B.like.length} liked={BLike} onLikeClick={this.handleLike} />
				<div className="cb"></div>
			</div>
		)
	}
})

const CardTitle = React.createClass({
	render:function(){
		var card = this.props.card;
		return (
			<Link to={'/cards/'+card._id}>
				<div className="card-title">
					<span className="title">{card.title}</span>
				</div>
			</Link>
		)
	}
});

const CardAuthor = React.createClass({
	render:function(){
		var card = this.props.card;
		return (
			<Link to={'/users/'+card.author._id}>
				<div className="card-author">
					<span className="author">{'@' + card.author.name}</span>
				</div>
			</Link>
		)
	}
});

const CardDate = React.createClass({
	render:function(){
		var card = this.props.card;
		var date = Dates.getDateString(card.date)
		return (
			<div className="card-date">
				<span className="date">{date}</span>
			</div>
		)
	}
});

const CardDescription = React.createClass({
	render:function(){
		var description = this.props.description;
		if(description == null) return null;
		return (
			<div className="card-description" dangerouslySetInnerHTML = {{__html:description}} ></div>
		)
	}
});

const CardAuthorPic = React.createClass({
	render:function(){
		var author = this.props.author;
		var src;
		if(author.pic!=null){
			src = Servers.s3 + author.pic;
		} else {
			src = null;
		}

		return (
			<Link to={'/users/'+author._id} >
				<div className="card-authorpic">
					<img src={src} />
				</div>
			</Link>
		)
	}
})

const CardLeft = React.createClass({
	render:function(){
		var author = this.props.author;
		return (
			<div className="card-left">
				<CardAuthorPic author={author} />
			</div>
		)
	}
});

const CardImage = React.createClass({
	render:function(){
		var src = this.props.src;
		return (
			<div className="card-image">
				<img src={src} />
			</div>
		)
	}
})

const CardImages = React.createClass({
	render:function(){
		var card = this.props.card;
		var A = card.A;
		var B = card.B;
		var thumbA = Servers.s3Thumb + A.hash;
		var thumbB = Servers.s3Thumb + B.hash;

		return (
			<div className="card-images">
				<CardImage src={thumbA} />
				<CardImage src={thumbB} />
				<div className="cb"></div>
			</div>
		)
	}
});

const CardBody = React.createClass({
	render:function(){
		var card = this.props.card;
		var session = this.props.session;
		return (
			<div className="card-body">
				<div className="card-header">
					<div className="card-info">
						<CardAuthor card={card}/>
						<div className="card-dot"></div>
						<CardDate card={card} />
						<div className="cb"></div>
						<CardTitle card={card}/>
					</div>
					<CardLikes card={card} session={session} />
					<div className="cb"></div>
				</div>
				<CardDescription description={card.description}/>
				<CardImages card={card} />
			</div>
		)
	}
})

const Card = React.createClass({
	render:function(){
		var card = this.props.card;
		var session = this.props.session;
		return (
			<div className="card">
				<CardLeft author={card.author} />
				<CardBody card={card} session={session} />
			</div>
		)
	}
});

const NewCard = React.createClass({
	handleClick:function(){
		var data = this.props.data;
		CardAction.receiveCards(data);
		CardAction.emptyNewCards();
	},
	render:function(){
		var data = this.props.data;
		if(data==null) return null;
		return (
			<div id="new-cards" onClick={this.handleClick}>
				<div id="title">{'View (' + data.length + ') new tests'}</div>
			</div>
		)
	}
});

const Cards = React.createClass({
	getInitialState:function(){
		return ({
			cards:CardStore.getCard(),
			newCards:CardStore.getNew(),
			endOfData:CardStore.getEndOfData(),
			session:this.props.session
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			session:nextProps.session
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this.handleResize);
		window.addEventListener('scroll',this._onScroll);
		CardStore.addChangeListener(this._onChange);
		this.layout();
		this.checkCards();
	},
	checkCards:function(){
		var cards = this.state.cards;
		if(cards == null) CardAPI.receiveCards();
		else {
			CardAPI.loadNewCards(cards[0]);
		}
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.handleResize);
		window.removeEventListener('scroll',this._onScroll);
		CardStore.removeChangeListener(this._onChange);
	},
	handleResize:function(){
		this.layout()
	},
	_onScroll:function(){
		var cards = this.state.cards;
		var endOfData = this.state.endOfData;
		if(endOfData) return null;
		var lastCard = cards[cards.length-1];
		var cHeight = $('#cards').outerHeight();
		var yOffset = window.pageYOffset;
		var y = yOffset + window.innerHeight;
		if( y >= cHeight){
			CardAPI.loadMoreCards(lastCard);
		}
	},
	layout:function(){
		var self = this;
		var cardWidth = $('.card').innerWidth();
		var cardPadding = 5*2;
		var leftWidth = 50;
		var rightWidth = 140;
		var rightPadding = 20;
		this.setState({
			centerWidth:cardWidth-cardPadding-leftWidth-rightWidth,
			rightWidth:rightWidth,
			imageWidth:(cardWidth-cardPadding-0.5)*0.5,
		});
	},
	_onChange:function(){
		var self = this;
		this.setState({
			cards:CardStore.getCard(),
			newCards:CardStore.getNew(),
			endOfData:CardStore.getEndOfData()
		},function(){
			self.layout()
		})
	},
	render:function(){
		var cards = this.state.cards;
		var newCards = this.state.newCards;
		var session = this.state.session;
		var card;
		var rightWidth = this.state.rightWidth;
		var centerWidth = this.state.centerWidth;
		var imageWidth = this.state.imageWidth;
		var endOfData = this.state.endOfData;
		if(cards == null) return null;
		card = cards.map(function(c,i){
			return <Card key={c._id} card={c} session={session} rightWidth={rightWidth} centerWidth={centerWidth} imageWidth={imageWidth} />
		});		

		return (
			<div id="cards">
				<NewCard data={newCards} />
				{card}
				<div className="cb"></div>
			</div>
		)
	}
})

module.exports = Cards;