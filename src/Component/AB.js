import React from 'react';
import { Link } from 'react-router';

import AppAPI from '../API/AppAPI';
import AppAction from '../Action/AppAction';
import AppStore from '../Store/AppStore';

import CardAction from '../Action/CardAction';
import CardStore from '../Store/CardStore';
import CardAPI from '../API/CardAPI';

import CommentAPI from '../API/CommentAPI';

import Servers from '../Util/Servers';
import Dates from '../Util/Dates';

import Util from '../Util/Util';

import Data from './AB/Data';
import Likes from './AB/Likes';
import ImageBox from './Common/ImageBox';

const TextVoteAuthorPic = React.createClass({
	render:function(){
		var author = this.props.author;
		var src;
		if(author.pic!=null){
			src = Servers.s3 + author.pic;
		} else {
			src = null;
		}
		return (
			<Link to={'/users/'+author._id}>
				<div className="textvote-author-pic">
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
});

const CommentInputUserPic = React.createClass({
	render:function(){
		var session = this.props.session;
		var src = Servers.s3 + session.pic;
		return (
			<div className="comment-input-user-pic">
				<img src={src} />
			</div>
		)
	}
})

const CommentInput = React.createClass({
	getInitialState:function(){
		return ({
			value:'',
			able:false,
			toggle:false
		})
	},
	handleChange:function(e){
		var self = this;
		var value = e.target.value;
		if(value==null){
			self.setState({
				value:value,
				able:false
			})
		} else {
			self.setState({
				value:value,
				able:true
			})
		}
	},
	replaceBR:function(value){
		function replaceAll(str, target, replacement) {
		    return str.split(target).join(replacement);
		};
		var replacement = replaceAll(value, '\n', '<br/>');
		return replacement;
	},
	submitText:function(e){
		var able = this.state.able;
		if(!able) return null;

		var image = this.props.image;
		var value = this.state.value;
		var session = this.props.session;

		var comment = this.replaceBR(value);
		var commentObj = {
	        image_id:image._id,
	        comment:comment,
	        author:session,
	        date:new Date(),
	        like:[]
		}
		image.comment.push(commentObj);
		CardAction.updateImageComment(image);
		CommentAPI.createComment(commentObj);
		this.setState({
			value:'',
			toggle:false,
			able:false
		});
		$(e.target).prev().css('min-height','33px');
		$(e.target).prev().css('height','33px');
	},
	handleKeyUp:function(e){
		var obj = $(e.target).context;
		obj.style.height = "1px";
		obj.style.height = (20+obj.scrollHeight)+"px";
	},
	handleFocus:function(e){
		$(e.target).css('min-height','80px');
		$(e.target).css('height','98px')
		this.setState({
			toggle:true
		})
	},
	handleBlur:function(e){
		var self = this;
		var value = this.state.value;
		if(value == null || value.length == 0){
			$(e.target).css('height','33px');
			$(e.target).css('min-height','33px');
			self.setState({
				toggle:false
			});
		}
	},
	render:function(){
		var value = this.state.value;
		var session = this.props.session;
		var image = this.props.image;
		var able = this.state.able;
		var toggle = this.state.toggle;

		var submit,textareaStyle,submitClass
		if(able){
			submitClass = "submit"
		} else {
			submitClass = "submit submit-disabled"
		}
		if(toggle){
			submit = <div className={submitClass} onClick={this.submitText} >Submit ></div>;
		} else {
			submit = null;
		}

		return (
			<div className="comment-input">
				<CommentInputUserPic session={session} />
				<textarea type="text" onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyUp={this.handleKeyUp} value={value} />
				{submit}
			</div>
		)
	}
})

const CommentInputGuide = React.createClass({
	render:function(){
		return (
			<div className="comment-input-guide">Sign in to leave a commment</div>
		)
	}
})
const CommentSubmit = React.createClass({
	render:function(){
		var image = this.props.image;
		var session = this.props.session;
		var body;
		if(session == null) body = <CommentInputGuide />;
		else body = <CommentInput session={session} image={image} />;
		return (
			<div className="comment-submit">
				<div className="title">Why did you choose #A?</div>
				{body}
				<div className="cb"></div>
			</div>
		)
	}
});

const CommentAuthor = React.createClass({
	render:function(){
		var author = this.props.author;
		return (
			<div className="comment-author">
				<span>{'@'+ author.name}</span>
			</div>
		)
	}
});

const CommentDate = React.createClass({
	render:function(){
		var date = Dates.getDateString(this.props.date)
		return (
			<div className="comment-date">
				<span>{date}</span>
			</div>
		)
	}
});

const CommentAuthorPic = React.createClass({
	render:function(){
		var author = this.props.author;
		var src = Servers.s3 + author.pic;
		return (
			<div className="comment-author-pic">
				<img src={src} />
			</div>
		)
	}
});

const CommentLike = React.createClass({
	handleLike:function(){
		this.props.onLikeClick()
	},
	render:function(){
		var liked = this.props.liked;
		var likeLength = this.props.likeLength;

		var likeClass;
		if(liked){
			likeClass = "comment-like liked"
		} else {
			likeClass = "comment-like"
		}
		return (
			<div className={likeClass} onClick={this.handleLike} >
				<div className="comment-like-dot"></div>
				<div className="comment-like-btn"></div>
				<span className="comment-like-cnt">{likeLength}</span>
			</div>
		)
	}
})

const CommentItem = React.createClass({
	getInitialState:function(){
		return ({
			liked:false,
			session:this.props.session
		})
	},
	componentDidMount:function(){
		this.appearAnimation();
		this.checkLiked()
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		if(this.props.session != nextProps.session){
			self.setState({
				session:nextProps.session
			},function(){
				self.checkLiked()
			})
		}
	},
	appearAnimation:function(){

	},
	checkLiked:function(){
		var session = this.state.session;
		var comment = this.props.comment;
		var self = this;
		if(session == null) return null;
		if(comment.like == null || comment.like.length == 0) return null;
		for(var i=0;i<comment.like.length;i++){
			if(comment.like[i].author == session._id){
				break;
			}
		}
		if(i == comment.like.length){
			self.setState({
				liked:false
			})
		} else {
			self.setState({
				liked:true
			})
		}
	},
	handleLike:function(){
		var comment = this.props.comment;
		var session = this.state.session;
		var image = this.props.image;
		var liked = this.state.liked;
		if(liked){
			for(var i=0;i<comment.like.length;i++){
				if(comment.like[i].author == session._id){
					comment.like.splice(i,1);
					break;
				}
			}
		}
		CardAction.updateImageCommentLike()

	},
	render:function(){
		var comment = this.props.comment;
		var likeLength = comment.like.length;
		var liked = this.state.liked;

		return (
			<div className="comment-item">
				<div className="comment-item-left">
					<CommentAuthorPic author={comment.author}/>
				</div>
				<div className="comment-item-center">
					<div className="comment-item-info">
						<CommentAuthor author={comment.author} />
						<div className="card-dot"></div>
						<CommentDate date={comment.date} />
						<CommentLike likeLength={likeLength} liked={liked} onLikeClick={this.handleLike} />
						<div className="cb"></div>
					</div>
					<div>
						<span className="comment" dangerouslySetInnerHTML = {{__html:comment.comment}}></span>
					</div>
				</div>
				<div className="cb"></div>
			</div>			
		)
	}
});

const Comments = React.createClass({
	render:function(){
		var comments = this.props.comments;
		var session = this.props.session;
		var image = this.props.image;
		var commentItem = comments.map(function(c){
			if(c._id == null){
				return <CommentItem key={c.date} comment={c} session={session} image={image}/> 
			} else {
				return <CommentItem key={c._id} comment={c} session={session} image={image}/>
			}
		})
		return (
			<div className="comments">
				<div className="title">Why people chose #A</div>
				{commentItem}
			</div>
		)
	}
});


const ABSectionImage = React.createClass({
	getInitialState:function(){
		return ({
			style:{},
			toggle:false
		})
	},
	componentDidMount:function(){
		this.layout()
	},
	layout:function(){
		var self = this;
		var image = this.props.image;
		var body = {
			width:445
		}
		var style = {
			width:'445px',
			height:(body.width*image.height/image.width).toFixed(2)+'px'
		}
		this.setState({
			style:style
		})
	},
	toggleImageBox:function(){
		var toggle = this.state.toggle;
		this.setState({
			toggle:!toggle
		})
	},
	render:function(){
		var image = this.props.image;
		var style = this.state.style;
		var src = Servers.s3Image + image.hash;
		var toggle = this.state.toggle;
		var imageBox;
		if(toggle) imageBox = <ImageBox toggle={this.toggleImageBox} image={image} />;
		else imageBox = null;

		return (
			<div className="section-image" style={style}>
				<div className="hover" style={style} onClick={this.toggleImageBox}></div>
				<img src={src} style={style}/>
				{imageBox}
			</div>
		)
	}
});

const ABSection = React.createClass({
	render:function(){
		var self = this;
		var image = this.props.image;
		var session = this.props.session;
		var comments;
		if(image.comment == null || image.comment.length == 0){
			comments = null;
		} else {
			comments = <Comments image={image} session={session} comments={image.comment} />
		}
		return (
			<div className="ab-section">
				<ABSectionImage session={session} image={image}/>
				{comments}
				<CommentSubmit session={session} image={image}/>
			</div>
		)
	}
});

const ABSections = React.createClass({
	render:function(){
		var AB = this.props.AB;
		var session = this.props.session;
		return (
			<div id="ab-sections">
				<ABSection session={session} image={AB.A} />
				<ABSection session={session} image={AB.B} />
				<div className="cb"></div>
			</div>
		)
	}
})





const Delete = React.createClass({
	getInitialState:function(){
		return ({
			session:this.props.session,
			isAuthor:false
		})
	},
	componentDidMount:function(){
		this.checkAuthor()
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		if(this.props.session!=nextProps.session){
			self.setState({
				session:nextProps.session
			},function(){
				self.checkAuthor()
			})
		}
	},
	checkAuthor:function(){
		var self = this;
		var card = this.props.card;
		var session = this.state.session;
		if(session._id == card.author._id){
			self.setState({
				isAuthor:true
			})
		} else {
			self.setState({
				isAuthor:false
			})
		}
	},
	handleDelete:function(){
		var self = this;
		var card = this.props.card;
		var confirm = window.confirm("Do you really want to delete this card?");
		if(confirm){
			CardAPI.deleteCard(card)
		}
	},
	render:function(){
		var self = this;
		var isAuthor = this.state.isAuthor;
		if(!isAuthor) return null;
		return (
			<div id="ab-delete" onClick={this.handleDelete}>
				<span>Delete</span>
			</div>
		)
	}
});

const ABDate = React.createClass({
	render:function(){
		var date = Dates.getDateString(this.props.date);
		return (
			<div id="ab-date">
				<span className="date">{date}</span>
			</div>
		)
	}
});

const ABAuthor = React.createClass({
	render:function(){
		var author = this.props.author;
		return (
			<Link to={'/users/' + author._id}>
				<div id="ab-author">
					<span className="author">{'@'+author.name}</span>
				</div>
			</Link>			
		)
	}
});

const ABTitle = React.createClass({
	render:function(){
		var title = this.props.title;
		return (
			<div id="ab-title">
				<span>{title}</span>
			</div>
		)
	}
});

const ABDescription = React.createClass({
	render:function(){
		var description = this.props.description;
		if(description==null) return null;
		return (
			<div id="ab-description">
				<span dangerouslySetInnerHTML={{__html:description}}></span>
			</div>		
		)
	}
})

const Header = React.createClass({
	getInitialState:function(){
		return ({
			isAuthor:false
		})
	},
	componentDidMount:function(){
		this.checkAuthor()
	},
	componentWillReceiveProps:function(nextProps){
		this.checkAuthor()
	},
	checkAuthor:function(){
		var self = this;
		var author = this.props.AB.author;
		var session = this.props.session;
		if(session == null) return null;
		if(session._id == author._id){
			self.setState({
				isAuthor:true
			})
		} else {
			self.setState({
				isAuthor:false
			})
		}
	},
	render:function(){
		var self = this;
		var AB = this.props.AB;
		var session = this.props.session;
		var isAuthor = this.state.isAuthor;

		if(isAuthor){
			var editBtn = <div id="ab-edit">Edit</div>;
			var deleteBtn = <div id="ab-delete">Delete</div>;
		} else {
			var editBtn = null;
			var deleteBtn = null;
		}

		return (
			<div id="ab-header">
				<div className="ab-top-header">
					<ABAuthor author={AB.author} />
					<div className="card-dot"></div>
					<ABDate date={AB.date} />
					<Delete session={session} card={AB} />
					<div className="cb"></div>
				</div>
				<ABTitle title={AB.title} />
				<ABDescription description={AB.description} />
				<div className="cb"></div>
			</div>
		)
	}
});

const Body = React.createClass({
	render:function(){
		var AB = this.props.AB;
		var session = this.props.session;

		return (
			<div id="ab-body">
				<Header AB={AB} session={session} />
				<ABSections AB={AB} session={session} />
			</div>
		)
	}
});


const Right = React.createClass({
	render:function(){
		var card = this.props.card;
		var session = this.props.session;

		return (
			<div id="ab-right">
				<Likes card={card} session={session} />
				<Data card={card} session={session} />
			</div>
		)
	}
})

const AB = React.createClass({
	getInitialState:function(){
		return ({
			session:AppStore.getSession()
		})
	},
	componentWillMount:function(){
		AppStore.addChangeListener(this._onSessionChange);
		CardStore.addChangeListener(this._onChange);
		
		var self = this;
		var card_id = this.props.params.card_id;
		var AB = CardStore.getCardById(card_id);
		if(AB == null){
			CardAPI.receiveCard(card_id)
		} else {
			self.setState({
				AB:AB
			})
		}
	},
	componentWillUnmount:function(){
		AppStore.removeChangeListener(this._onSessionChange)
		CardStore.removeChangeListener(this._onChange);
		CardAction.emptyAB(null);
	},
	_onChange:function(){
		var self = this;
		var card_id = this.props.params.card_id;
		this.setState({
			AB:CardStore.getCardById(card_id)
		})
	},
	_onSessionChange:function(){
		this.setState({
			session:AppStore.getSession()
		})
	},
	render:function(){
		var self = this;
		var AB = this.state.AB;
		var session = this.state.session;

		if(AB == null) return null;

		return (
			<div id="ab" className="c1190">
				<Body AB={AB} session={session}/>
				<Right card={AB} session={session} />
				<div className="cb"></div>
			</div>
		)
	}
});


module.exports = AB;