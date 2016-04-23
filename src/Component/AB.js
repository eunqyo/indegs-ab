import React from 'react';

import AppAPI from '../API/AppAPI';
import AppAction from '../Action/AppAction';
import AppStore from '../Store/AppStore';

import CardAction from '../Action/CardAction';
import CardStore from '../Store/CardStore';
import CardAPI from '../API/CardAPI';

import credentials from '../../credentials';
import { Link } from 'react-router';

import Util from '../Util/Util';
import LikeGraph from './Chart/LikeGraph';

const TextVoteAuthorPic = React.createClass({
	getInitialState:function(){
		return ({
			author:this.props.author
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			author:nextProps.author
		})
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
			<Link to={'/users/'+author._id}>
				<div className="textvote-author-pic-holder">
					<img className="textvote-author-pic" src={src} />
				</div>
			</Link>
		)
	}
})


const TextVote = React.createClass({
	getInitialState:function(){
		return ({
			session:this.props.session,
			vote:this.props.vote,
			agree:false,
			author:false
		})
	},
	componentDidMount:function(){
		this.findAgree();
		this.findAuthor();
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			session:nextProps.session,
			vote:nextProps.vote
		},function(){
			self.findAuthor()
			self.findAgree()
		})
	},
	findAuthor:function(){
		var self = this;
		var session = this.state.session;
		var vote = this.state.vote;
		if(session!=null&&vote.author._id == session._id){
			self.setState({
				author:true
			})
		} else {
			self.setState({
				author:false
			})
		}
	},
	findAgree:function(){
		var self = this;
		var session = this.state.session;
		var vote = this.state.vote;
		if(session!=null){
			for(var i =0;i<vote.like.length;i++){
				if(vote.like[i].author == session._id){
					self.setState({
						agree:true
					});
					break;
				}
			}
			if(i==vote.like.length){
				self.setState({
					agree:false
				})
			}
		} else {
			self.setState({
				agree:false
			})
		}
	},
	up:function(){
		var vote = this.state.vote;
		var session = this.state.session;
		CardAPI.addVoteLike(session._id,vote)
	},
	down:function(){
		var vote = this.state.vote;
		var session = this.state.session;
		for(var i=0;i<vote.like.length;i++){
			if(vote.like[i].author == session._id){
				vote.like.splice(i,1);
				CardAPI.removeVoteLike(vote);
				break;
			}
		};
	},
	handleDelete:function(){
		var vote = this.state.vote;
		CardAPI.deleteVote(vote)
	},
	
	render:function(){
		var self = this;
		var vote = this.state.vote;
		var agree = this.state.agree;
		var author = this.state.author;
		var deleteBtn,agreeBtn,likeStyle;
		if(author){
			deleteBtn = <div className="delete option-btn" onClick={self.handleDelete} > Delete </div>
		} else {
			if(agree){
				likeStyle = {'color':'#4193ff'}
				agreeBtn = <div className="down option-btn" onClick={self.down} > Liked </div>
			} else {
				likeStyle = null
				agreeBtn = <div className="up option-btn" onClick={self.up}> Like </div>
			}
		}
		var date = Util.getParsedDate(vote.date);
		return (
			<div className="textvote">
				<div className="left">
					<TextVoteAuthorPic author={vote.author} />
				</div>
				<div className="center">
					<div className="textvote-header">
						<div className="textvote-author-name">{'@' + vote.author.name}</div>
						<div className="textvote-date">{date}</div>
						<div className="cb"></div>
					</div>
					<div className="textvote-title">{vote.title}</div>
				</div>
				<div className="right">
					<div className="cnt" style={likeStyle} >{vote.like.length}</div>
					{deleteBtn}
					{agreeBtn}
				</div>
				<div className="cb"></div>
			</div>
		)
	}
})

const SectionVote = React.createClass({
	getInitialState:function(){
		return ({
			value:null,
			session:this.props.session,
			image:this.props.image
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			session:nextProps.session,
			image:nextProps.image
		})
	},
	submitInput:function(e){
		var value = this.state.value;
		var image = this.props.image;
		$(e.target).attr('placeholder','ex) Better Typography');
	},
	handleEnter:function(e){
		var self = this;
		if(e.which == 13){
			$(e.target).blur();
			self.submitText()
		}
	},
	handleChange:function(e){
		this.setState({
			value:e.target.value
		});
	},
	changePlaceholder:function(e){
		$(e.target).attr('placeholder','Press Enter to submit your comment');
	},
	submitText:function(){
		var image = this.state.image;
		var value = this.state.value;
		var session = this.state.session;
		CardAPI.createVote(session._id,value,image);
		this.setState({
			value:null
		});
	},
	render:function(){
		var image = this.props.image;
		return (
			<div className="section-vote">
				<div className="title">Add a comment</div>
				<input maxLength="140" className="section-vote-input" type="text" placeholder="A great comment for this work" onClick={this.changePlaceholder} onBlur={this.submitInput} onKeyPress={this.handleEnter} onChange={this.handleChange} value={this.state.value}  />
				<div className="submit" onClick={this.submitText} >Submit ></div>
				<div className="cb"></div>
			</div>
		)
	}
})

const Section = React.createClass({
	getInitialState:function(){
		return ({
			session:this.props.session,
			image:this.props.image,
			other:this.props.other,
			imgClass:'w'
		})
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			session:nextProps.session,
			image:nextProps.image,
			other:nextProps.other
		})
	},
	clearBlur:function(e){
		$(e.target).css('-webkit-filter','blur(0px)')
	},
	render:function(){
		var self = this;
		var image = this.state.image;
		var other = this.state.other;
		var session = this.state.session;
		var sectionVote,textvote;
		if(image.vote.length == 0){
			textvote = null;
		} else {
			textvote = image.vote.map(function(vote,idx){
				return <TextVote key={idx} vote={vote} session={session} image={image} />
			})
		}

		if(session!=null){
			sectionVote = <SectionVote session={session} image={image} />;
		} else {
			sectionVote = null;
		}

		return (
			<div className="ab-section">
				<div className="section-image-holder">
					<img className="section-image" onLoad={this.clearBlur} src={credentials.image_server + '/' + image.url} />
				</div>
				<div className="textvote-holder">{textvote}</div>
				{sectionVote}
			</div>
		)
	}
});

const SectionLoader = React.createClass({
	render:function(){
		return (
			<div id="ab-section-loader">
				<div className="c1190">
					<div className="section-loader">
						<div className="section-like-loader"></div>
						<div className="section-img-loader"></div>

					</div>
					<div className="section-loader">
						<div className="section-like-loader"></div>
						<div className="section-img-loader"></div>
					</div>
					<div className="cb"></div>
				</div>
			</div>
		)
	}
});

const DeleteBtn = React.createClass({
	handleDelete:function(){
		var self = this;
		var confirm = window.confirm("Do you really want to delete this card?");
		if(confirm){
			var card_id = self.props.card_id;
			CardAPI.deleteCard(card_id)
		} else {
			
		}
	},
	render:function(){
		return (
			<div id="ab-header-delete" onClick={this.handleDelete}>
				<div id="ab-header-delete-text">Delete</div>
				<div id="ab-header-delete-btn"></div>
			</div>
		)
	}
});

const HeaderPic = React.createClass({
	handleImageLoad:function(e){
		var image = $(e.target);
		image.parent().children('#ab-userpic-loader').css('display','none');
	},
	render:function(){
		var author = this.props.author;
		var src;

		if(author.pic!=null){
			src = credentials.image_server + '/' + author.pic;
		} else {
			src = null;
		}

		return (
			<Link to={'/users/'+author._id}>
				<div id="ab-userpic-holder">
					<div id="ab-userpic-loader"></div>
					<img id="ab-userpic" src={src} onLoad={this.handleImageLoad} />
				</div>
			</Link>
		)
	}
});

const ABLike = React.createClass({
	getInitialState:function(){
		return({
			session:this.props.session,
			image:this.props.image,
			other:this.props.other,
			liked:false,
			message:null
		})
	},
	componentDidMount:function(){
		this.findLiker()
		this.checkSession()
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			session:nextProps.session,
			image:nextProps.image,
			other:nextProps.other
		},function(){
			self.findLiker();
			self.checkSession();
		})
	},
	checkSession:function(){
		var self = this;
		var session = this.state.session;
		if(session == null){
			self.setState({
				message:'Sign-in to like this'
			})
		} else {
			self.setState({
				message:null
			})
		}
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
						CardAction.updateABImage(image);
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
				CardAction.updateABImage(image)
				CardAPI.addLike(session._id,image._id);
				AppAPI.addParticipated(session._id,image.card_id)
				for(var i=0;i<other.like.length; i++){
					if(other.like[i].author == session._id){
						other.like.splice(i,1);
						CardAction.updateABImage(other)
						CardAPI.removeLike(other);
						break;
					}
				}
			}
		}
	},
	render:function(){
		var image= this.state.image;
		var btnClass,cntClass;
		if(this.state.liked){
			btnClass = "btn liked";
			cntClass = "cnt cnt-liked"; 
		} else {
			btnClass = "btn";
			cntClass = "cnt";
		}
		return (
			<div className="ab-like">
				<div className="btn-holder">
					<div className={btnClass} onClick={this.handleLike}></div>
					<div className="cb"></div>
				</div>
				<div className="cnt-holder">
					<span className={cntClass} >{image.like.length}</span>
				</div>
			</div>
		)
	}
})

const Like = React.createClass({
	render:function(){
		var AB = this.props.AB;
		return (
			<div id="ab-like">
				<div id="ab-like-header">
					<div id="action">
						<ABLike session={this.props.session} image={AB.A} other={AB.B} />
						<ABLike session={this.props.session} image={AB.B} other={AB.A} />
						<div className="cb"></div>
					</div>
					<div className="cb"></div>
				</div>
				
			</div>
		)
	}
})

const Header = React.createClass({
	getInitialState:function(){
		return ({
			AB:this.props.AB,
			session:this.props.session,
			isAuthor:false
		})
	},
	componentDidMount:function(){
		this.checkAuthor()
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			AB:nextProps.AB,
			session:nextProps.session
		},function(){
			self.checkAuthor()
		})
	},
	checkAuthor:function(){
		var self = this;
		var author = this.state.AB.author;
		var session = this.state.session;
		if(session!=null && session._id == author._id){
			self.setState({
				isAuthor:true
			})
		} else {
			self.setState({
				isAuthor:false
			})
		}
	},
	goResult:function(){
		var AB = this.state.AB;
	},
	render:function(){
		var self = this;
		var AB = this.state.AB;
		var session = this.state.session;
		var isAuthor = this.state.isAuthor;
		var date = Util.getParsedDate(AB.date);

		if(isAuthor){
			var editBtn = <div id="ab-edit">Edit</div>;
			var deleteBtn = <div id="ab-delete">Delete</div>;
		} else {
			var editBtn = null;
			var deleteBtn = null;
		}

		return (
			<div id="ab-header">
				<div className="c1190">
					<div id="left">
						<div id="user-date">
							<Link to={'/users/'+AB.author._id}>
								<div id="ab-author">{'@'+AB.author.name}</div>
							</Link>
							<div id="ab-date">{date}</div>
							{editBtn}
							{deleteBtn}
							<div className="cb"></div>
						</div>
						<div id="ab-title">{AB.title}</div>
						<div id="ab-text" dangerouslySetInnerHTML={{__html:AB.text}}></div>
						<div style={{"clear":"both"}}></div>
					</div>
					<div id="right">
						<Like AB={AB} session={session}/>
					</div>
					<div className="cb"></div>
				</div>
			</div>
		)
	}
});

// <div id="go-result">
// 	<Link to={'/analysis/'+AB._id}>
// 		<div id="btn">Analysis ></div>
// 	</Link >
// </div>

const AB = React.createClass({
	getInitialState:function(){
		return ({
			session:AppStore.getSession(),
			AB:CardStore.getAB(),
			imageALoaded:false,
			imageBLoaded:false
		})
	},
	componentDidMount:function(){
		AppStore.addChangeListener(this._onSessionChange);
		CardStore.addChangeListener(this._onChange);
		var card_id = this.props.params.card_id;
		if(CardStore.getCard() == null){
			CardAPI.receiveAB(card_id)
		} else {
			CardAction.updateAB(card_id);
		}
	},
	componentWillUnmount:function(){
		AppStore.removeChangeListener(this._onSessionChange)
		CardStore.removeChangeListener(this._onChange);
		CardAction.emptyAB(null)
		this.setState({
			AB:null
		})
	},
	_onChange:function(){
		var self = this;
		this.setState({
			AB:CardStore.getAB()
		},function(){
			self.handleImgLoad();
		})
	},
	_onSessionChange:function(){
		this.setState({
			session:AppStore.getSession()
		})
	},
	handleImgLoad:function(){
		var self = this;
		var counter = 0;
		var AB = this.state.AB;
		if(AB!=null){
			var A = AB.A;
			var B = AB.B;
			var imgA = new Image()
			var imgB = new Image()
			imgA.onload = function(){
				counter ++;
				if(counter == 2){
					$('#ab-section-loader').css('display','none')
					$('#ab-section-holder').css('-webkit-filter','blur(0px)')
					$('#ab-section-holder').css('opacity','1')
				}
			}
			imgB.onload = function(){
				counter ++;
				if(counter == 2){
					$('#ab-section-loader').css('display','none')
					$('#ab-section-holder').css('-webkit-filter','blur(0px)')
					$('#ab-section-holder').css('opacity','1')
				}
			}
			imgA.src = credentials.image_server + '/'+ A.url;
			imgB.src = credentials.image_server + '/'+ B.url;
			
		}
	},
	render:function(){
		var self = this;
		var AB = this.state.AB;
		var session = this.state.session;
		var section;
		var loader;

		if(AB == null){
			return null;
		} else {
			loader = <SectionLoader />
			section = 
			<div id="ab-section-holder" className="c1190">
				<Section session={session} other={AB.B} image={AB.A} />
				<Section session={session} other={AB.A} image={AB.B} />
				<div className="cb"></div>
			</div>;
		}
		return (
			<div id="ab">
				<Header AB={AB} session={session} />
				{section}
				{loader}
			</div>
		)
	}
})


module.exports = AB;