import React from 'react';
import { Link,browserHistory } from 'react-router';
import { findDOMNode } from "react-dom";

import AppStore from '../Store/AppStore';
import AppAPI from '../API/AppAPI';

import CardAPI from '../API/CardAPI';
import CardStore from '../Store/CardStore';
import CardAction from '../Action/CardAction';

import credentials from '../../credentials';
import Util from '../Util/Util';
import AppHistory from '../Util/AppHistory';
import Dates from '../Util/Dates';

const CardImage = React.createClass({
	componentDidMount:function(){
		this.counter = 0;
	},
	onImageLoad:function(e){
		var image = $(e.target);
		this.counter ++;
		if(this.counter == 2){
			$(e.target).parent().children('.card-img-loader').css('display','none')
		}
	},
	render:function(){
		var card = this.props.card;
		var imageWidth = this.props.imageWidth;
		var A = card.A;
		var B = card.B;
		var thumbA = credentials.image_server + '/thumbs/' + A.url.slice(7,A.url.length);
		var thumbB = credentials.image_server + '/thumbs/' + B.url.slice(7,B.url.length);
		var styleA = {'width':imageWidth,'height':(imageWidth*A.height/A.width).toFixed(0)}
		var styleB = {'width':imageWidth,'height':(imageWidth*B.height/B.width).toFixed(0)}
		if((imageWidth*A.height/A.width).toFixed(0)>(imageWidth*B.height/B.width).toFixed(0)){
			var holderStyle = {'height':(imageWidth*A.height/A.width).toFixed(0)}
		} else {
			var holderStyle = {'height':(imageWidth*B.height/B.width).toFixed(0)}
		}

		return (
			<div className="card-img-holder" style={holderStyle}>
				<div className="card-img-loader">
					<div style={styleA} className="card-a-loader"></div>
					<div style={styleB} className="card-b-loader"></div>
				</div>
				<img className="card-a-img" style={styleA} src={thumbA} onLoad={this.onImageLoad} />
				<img className="card-b-img" style={styleB} src={thumbB} onLoad={this.onImageLoad} />
				<div className="cb"></div>
			</div>
		)
	}
});


const CardUserPic = React.createClass({
	getInitialState:function(){
		return ({
			author:this.props.author,
			session:this.props.session
		})
	},
	componentDidMount:function(){
		this.checkSession()
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			author:nextProps.author,
			session:nextProps.session
		},function(){
			self.checkSession()
		})
	},
	checkSession:function(){
		var self = this;
		var author = this.state.author;
		var session = this.state.session;
		if(session!=null){
			if(session._id==author._id){
				self.setState({
					author:session
				})
			}
		}
	},
	handleImageLoad:function(e){
		var image = $(e.target);
		image.parent().children('.card-userpic-loader').css('display','none');
	},
	render:function(){
		var author = this.state.author;
		var src;
		if(author.pic!=null){
			src = credentials.image_server + '/' + author.pic;
		} else {
			src = null;
		}

		return (
			<div className="card-userpic-holder">
				<div className="card-userpic-loader"></div>
				<img className="card-userpic" src={src} onLoad={this.handleImageLoad} />
			</div>
		)
	}
})

const CardLike = React.createClass({
	getInitialState:function(){
		return ({
			image:this.props.image,
			other:this.props.other,
			session:this.props.session,
			liked:false
		})
	},
	componentDidMount:function(){
		this.findLiker()
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			image:this.props.image,
			other:this.props.other,
			session:nextProps.session
		},function(){
			self.findLiker();
		})
	},
	findLiker:function(){
		var self = this;
		var session = this.state.session;
		var image = this.state.image;
		if(session!=null&&image.like.length!=0){
			for(var i=0;i<image.like.length;i++){
				if(image.like[i].author == session._id){
					self.setState({
						liked:true
					});
					break;
				}
			}
			if(i == image.like.length){
				self.setState({
					liked:false
				})
			}
		} else {
			self.setState({
				liked:false
			})
		}
	},
	handleLike:function(){
		var self = this;
		var session = this.state.session;
		var image = this.state.image;
		var other = this.state.other;
		var liked = this.state.liked;
		if(session != null){
			if(liked){
				for(var i=0;i<image.like.length;i++){
					if(image.like[i].author == session._id){
						image.like.splice(i,1);
						CardAction.updateImageLike(image);
						CardAPI.removeLike(image);
						AppAPI.removeParticipated(session,image.card_id)
						break;
					}
				}
			} else {
				var likeObj = {
					date:new Date(),
					author:session._id
				}
				image.like.push(likeObj);
				CardAction.updateImageLike(image)
				CardAPI.addLike(session._id,image._id);
				AppAPI.addParticipated(session._id,image.card_id)
				for(var i=0;i<other.like.length; i++){
					if(other.like[i].author == session._id){
						other.like.splice(i,1);
						CardAction.updateImageLike(other)
						CardAPI.removeLike(other);
						break;
					}
				}
			}
		}
	},
	render:function(){
		var image = this.state.image;
		var liked = this.state.liked;
		var session = this.state.session;
		var btnClass;
		if(liked){
			btnClass = "btn liked"
		} else {
			btnClass = "btn"
		}
		return (
			<div className="card-like">
				<div className="count">{image.like.length}</div>
				<div className={btnClass} onClick={this.handleLike}></div>
			</div>
		)
	}
});

const CardTitle = React.createClass({
	render:function(){
		var card = this.props.card;
		return (
			<div className="card-title">
				<span className="title">{card.title}</span>
			</div>
		)
	}
});

const CardAuthor = React.createClass({
	render:function(){
		var card = this.props.card;
		return (
			<div className="card-author">
				<span className="author">{'@' + card.author.name}</span>
			</div>
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
})

const Card = React.createClass({
	getInitialState:function(){
		return ({
			card:this.props.card,
			session:this.props.session
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			card:nextProps.card,
			session:nextProps.session
		})
	},
	handleCardClink:function(e){
		var card = this.state.card;
		var header = $('.card-header');
		if(!header.is(e.target)&&header.has(e.target).length == 0){
			AppHistory.push('/cards/'+card._id)
		}
	},
	render:function(){
		var card = this.state.card;
		var session = this.state.session;
		var date = Util.getParsedDate(card.date);
		var cardText;
		var centerWidth = this.props.centerWidth;
		var rightWidth = this.props.rightWidth;
		var imageWidth = this.props.imageWidth;
		if(session!=null){
			var like = 	<div className="card-like-holder">
							<CardLike session={session} image={card.A} other={card.B} />
							<CardLike session={session} image={card.B} other={card.A} />
							<div className="cb"></div>
						</div>
		} else {
			var like = <div className="session-message">Sign-in first</div>
		}

		if(card.text != null&& card.text.length > 0){
			cardText = <div className="card-text" dangerouslySetInnerHTML={{__html:card.text}}></div>;
		} else {
			cardText = null;
		}

		return (
			<div className="card" onClick={this.handleCardClink}>
				<div className="card-header">
					<div className="card-header-left">
						<Link to={'/users/'+card.author._id}>
							<CardUserPic author={card.author} session={session} />
						</Link>
					</div>
					<div className="card-header-center" style={{'width':centerWidth}}>
						<div className="card-info-holder">
							<CardTitle card={card}/>
							<CardAuthor card={card}/>
							<CardDate card={card} />
							<div className="cb"></div>
						</div>
					</div>
					<div className="card-header-right" style={{'width':rightWidth}}>
						{like}
					</div>
					<div className="cb"></div>
				</div>
				{cardText}
				<CardImage card={card} imageWidth={imageWidth} />
			</div>
		)
	}
})

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
		var cardPadding = 30;
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