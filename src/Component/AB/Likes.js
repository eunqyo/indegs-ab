import React from 'react';
import ReactDOM from 'react-dom';
import CardAPI from '../../API/CardAPI';
import CardAction from '../../Action/CardAction';
import SigninModal from '../Common/SigninModal';

const Like = React.createClass({
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
			likeClass = "ab-like liked"
		} else {
			likeClass = "ab-like"
		}
		return (
			<div className={likeClass} onClick={this.handleClick}>
				<div className="btn"></div>
				<span className="count">{likeCnt}</span>
			</div>
		)
	}
});

const Likes = React.createClass({
	getInitialState:function(){
		return ({
			ALike:null,
			BLike:null,
			session:this.props.session
		})
	},
	componentDidMount:function(){
		this.checkUserLike()
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		if(this.props.session != nextProps.session){
			self.setState({
				session:nextProps.session
			},function(){
				self.checkUserLike()
			})
		}
	},
	checkUserLike:function(session){
		var self = this;
		var card = this.props.card;
		var session = this.state.session;

		if(!session){
			self.setState({
				ALike:false,
				BLike:false
			})
		} else {
			self.checkSectionLike(card.A,function (ALike){
				self.checkSectionLike(card.B,function (BLike){
					self.setState({
						ALike:ALike,
						BLike:BLike
					})
				})
			});	
		}
	},
	checkSectionLike:function(section,callback){
		if(section.like.length == 0) callback(false);

		var session = this.state.session;
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
	renderSigninModal:function(){
		var title = 'Signin first'
		ReactDOM.render(<SigninModal toggle={this.toggleSigninModal} title={title} />,document.getElementById('signin-modal-container'))
	},
	toggleSigninModal:function(e){
		var a = $('#signin-modal');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			ReactDOM.unmountComponentAtNode(document.getElementById('signin-modal-container'),<SigninModal />)
		}
	},
	handleLike:function(section){
		var self =this;
		var session = this.state.session;
		if(session==null) {
			self.renderSigninModal();
			return null;
		};
		var card = this.props.card;
		var ALike = this.state.ALike;
		var BLike = this.state.BLike;
		if(section=='a'){
			if(ALike){
				return null;
			} else {
				self.setState({
					ALike:true,
					BLike:false
				});
				self.addLike(card.A,function (A){
					if(BLike){
						self.removeLike(card.B,function (B){
							card.A = A;
							card.B = B;
							CardAction.updateCard(card);
						});
					} else {
						card.A = A;
						CardAction.updateCard(card);
					}
				});
			}
		} else {
			if(BLike){
				return null;
			} else {
				self.setState({
					ALike:false,
					BLike:true
				});
				self.addLike(card.B,function (B){
					if(ALike){
						self.removeLike(card.A,function (A){
							card.A = A;
							card.B = B;
							CardAction.updateCard(card);
						});
					} else {
						card.B = B;
						CardAction.updateCard(card);
					}
				})
			}
		}
		CardAPI.updateImageLike(card.A,card.B,section,session);
	},
	addLike:function(section,callback){
		var session = this.state.session;
		var likeObj = {
			date:new Date(),
			author:session._id
		}
		section.like.push(likeObj);
		callback(section);
	},
	removeLike:function(section,callback){
		var session = this.state.session;
		for(var i=0;i<section.like.length;i++){
			if(section.like[i].author == session._id){
				section.like.splice(i,1);
				break;
			}
		}
		callback(section);
	},
	render:function(){
		var card = this.props.card;
		var ALike = this.state.ALike;
		var BLike = this.state.BLike;
		return (
			<div className="ab-likes">
				<div className="title">LIKES</div>
				<Like section={'a'} likeCnt={card.A.like.length} liked={ALike} onLikeClick={this.handleLike} />
				<Like section={'b'} likeCnt={card.B.like.length} liked={BLike} onLikeClick={this.handleLike} />
				<div className="cb"></div>
			</div>
		)
	}
});

module.exports = Likes;