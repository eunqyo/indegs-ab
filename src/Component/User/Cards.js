import React from 'react';
import { Link,browserHistory } from 'react-router';

import AppStore from '../../Store/AppStore';
import AppAPI from '../../API/AppAPI';

import CardAPI from '../../API/CardAPI';
import CardStore from '../../Store/CardStore';

import UserAPI from '../../API/UserAPI';

import credentials from '../../../credentials';
import Util from '../../Util/Util';

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
			<Link to={'/users/'+ author._id}>
				<div className="card-userpic-holder">
					<div className="card-userpic-loader"></div>
					<img className="card-userpic" src={src} onLoad={this.handleImageLoad} />
				</div>
			</Link>
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
				// for(var i=0;i<image.like.length;i++){
				// 	if(image.like[i].author == session._id){
				// 		image.like.splice(i,1);
				// 		CardAPI.removeLike(image);
				// 		AppAPI.removeParticipated(session,image.card_id)
				// 		break;
				// 	}
				// }
			} else {
				UserAPI.addLike(session._id,image._id);
				AppAPI.addParticipated(session._id,image.card_id)
				for(var i=0;i<other.like.length; i++){
					if(other.like[i].author == session._id){
						other.like.splice(i,1);
						UserAPI.removeLike(other);
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
			btnClass = "card-liked-btn"
		} else {
			btnClass = "card-like-btn"
		}
		return (
			<div className="card-like">
				<div className={btnClass} onClick={this.handleLike}></div>
			</div>
		)
	}
});

const Card = React.createClass({
	getInitialState:function(){
		return ({
			card:this.props.card,
			session:this.props.session,
			likeWidth:this.props.likeWidth,
			titleWidth:this.props.titleWidth,
			imageWidth:this.props.imageWidth
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			card:nextProps.card,
			session:nextProps.session,
			likeWidth:nextProps.likeWidth,
			titleWidth:nextProps.titleWidth,
			imageWidth:nextProps.imageWidth
		})
	},
	render:function(){
		var card = this.state.card;
		if(card == null) return null;
		var date = Util.getParsedDate(card.date);
		var session = this.state.session;
		var titleWidth = this.state.titleWidth;
		var likeWidth = this.state.likeWidth;
		var imageWidth = this.state.imageWidth;
		if(session!=null){
			var like = 	<div className="card-like-holder">
							<CardLike session={session} image={card.A} other={card.B} />
							<CardLike session={session} image={card.B} other={card.A} />
							<div className="cb"></div>
						</div>
		} else {
			var like = <div className="session-message">Sign-in first</div>
		}

		return (
				<div className="card" >
					<div className="card-header">
						<div className="card-header-left">
							<CardUserPic author={card.author} session={session} />
						</div>
						<div className="card-header-center">
							<div className="card-info-holder" style={{'width':titleWidth}}>
								<Link to={'/users/'+card.author._id}>
									<span className="card-author" >{'@' + card.author.name}</span>
								</Link>
								<span className="card-date">{date}</span>
								<Link to={'/cards/'+card._id}>
									<div className="card-title">{card.title}</div>
								</Link>
							</div>
						</div>
						<div className="card-header-right" style={{'width':likeWidth}}>
							{like}
						</div>
						<div className="cb"></div>
					</div>
					<div className="card-text" dangerouslySetInnerHTML={{__html:card.text}}></div>
					<CardImage card={card} imageWidth={imageWidth} />
				</div>
		)
	}
})

const Cards = React.createClass({
	getInitialState:function(){
		return ({
			cards:this.props.cards,
			session:this.props.session,
			likeWidth:null,
			titleWidth:null,
			imageWidth:null
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this.handleResize);
		this.layout()
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.handleResize);
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			cards:nextProps.cards,
			session:nextProps.session
		})
	},
	handleResize:function(){
		this.layout()
	},
	layout:function(){
		var self = this;
		var cardWidth = $('.card').innerWidth();
		var cardPadding = 40;
		var headerPadding = 60;
		var picWidth = 50;
		var likeWidth = 90;
		this.setState({
			titleWidth:cardWidth-cardPadding-picWidth-likeWidth,
			likeWidth:likeWidth,
			imageWidth:(cardWidth-cardPadding-1)*0.5,
		});
	},
	render:function(){
		var cards = this.state.cards;
		var session = this.state.session;
		var card;
		var likeWidth = this.state.likeWidth;
		var titleWidth = this.state.titleWidth;
		var imageWidth = this.state.imageWidth;
		if(cards!=null){
			card = cards.map(function(c,i){
				return <Card key={i} card={c.card} session={session} likeWidth={likeWidth} titleWidth={titleWidth} imageWidth={imageWidth} />
			})
		} else {
			card = null
		}
		return (
			<div id="cards">
				{card}
				<div className="cb"></div>
			</div>
		)
	}
})

module.exports = Cards;