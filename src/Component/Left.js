import React from 'react';

import AppAPI from '../API/AppAPI';
import UserAPI from '../API/UserAPI';
import UserStore from '../Store/UserStore';
import UserAction from '../Action/UserAction';
import credentials from '../../credentials';
import { Link, browserHistory } from 'react-router';
import Post from './Post';



const UserStatus = React.createClass({
	getInitialState:function(){
		return ({
			session:this.props.session
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			session:nextProps.session
		})
	},
	goPublished:function(){
		var session = this.state.session;
		UserAction.changeMode("pub")
		browserHistory.push('/users/'+session._id)
	},
	goParticipated:function(){
		var session = this.state.session;
		UserAction.changeMode("par")
		browserHistory.push('/users/'+session._id);
	},
	render:function(){
		var session = this.state.session;
		return (
			<div id="user-card-info">
				<div id="user-card-name">{'@'+session.name}</div>
				<div id="user-card-status">
					<div className="col2" onClick={this.goPublished} >
						<div className="status-title">Published</div>
						<div className="status-cnt">{session.published.length}</div>
					</div>
					<div className="col2" onClick={this.goParticipated}>
						<div className="status-title">Participated</div>
						<div className="status-cnt">{session.participated.length}</div>
					</div>
					<div className="cb"></div>
				</div>
			</div>
		)
	}
})

const UserCardPic = React.createClass({
	handleImageLoad:function(e){
		var image = $(e.target);
		image.parent().children('#user-card-pic-loader').css('display','none');
	},
	render:function(){
		var session = this.props.session;
		var src;
		if(session.pic!=null){
			src = credentials.image_server + '/' + session.pic;
		} else {
			src = null;
		}

		return (
			<Link to={'/users/'+session._id}>
				<div id="user-card-pic-holder">
					<div id="user-card-pic-loader"></div>
					<img src={src} id="user-card-pic" onLoad={this.handleImageLoad} />
				</div>
			</Link>
		)
	}
});

const UserABGuide = React.createClass({
	render:function(){
		var titleString = "Create your ABs using your design or any other images"
		return (
			<div id="user-ab-guide">
				<div id="title">{titleString}</div>
			</div>
		)
	}
})

const UserABHeader = React.createClass({
	render:function(){
		return (
			<div id="user-ab-header">
				<div id="title">Your ABs</div>
				<Link to={'/post'}>
					<div id="create"> New AB </div>
				</Link>
				<div className="cb"></div>
			</div>
		)
	}
});

const Published = React.createClass({
	render:function(){
		var published = this.props.published;
		var card = published.card;
		return (
			<Link to={'/cards/'+published.card_id}>
				<div className="publish-item">
					<span>{published.card_title + ' >'}</span>
				</div>
			</Link>
		)
	}
})

const UserAB = React.createClass({
	render:function(){
		var _published = this.props._published;
		var body;
		if(_published==null||_published.length == 0){
			body = <UserABGuide />
		} else {
			body = _published.map(function(published){
				return <Published key={published._id} published={published} />
			})
		}

		return (
			<div id="user-ab">
				<UserABHeader />
				{body}
			</div>
		)
	}
})

const UserCard = React.createClass({
	getInitialState:function(){
		return ({
			_published:UserStore.getPublished(),
			_participated:UserStore.getParticipated()
		})
	},
	componentDidMount:function(){
		// 사용자가 생성한 테스트가 있는지 확인한다
		var session = this.props.session;
		UserStore.addChangeListener(this._onChange);
		UserAPI.receiveUserActivities(session._id);
	},
	componentWillUnmount:function(){
		UserStore.removeChangeListener(this._onChange);
	},
	_onChange:function(){
		this.setState({
			_published:UserStore.getPublished(),
			_participated:UserStore.getParticipated()
		})
	},
	render:function(){
		var session = this.props.session;
		var _published = this.state._published;
		var _participated = this.state._participated;
		return (
			<div id="user-card">
				<UserCardPic session={session} />
				<UserAB session={session} _published={_published} />
				<div className="cb"></div>
			</div>
		)
	}
});



const DefaultCard = React.createClass({
	render:function(){
		return (
			<div id="default-card">
				<div id="logo-card">De</div>
				<div id="philo">
					<div id="title">Data-powered design</div>
					<div id="exp">Decide colors, fonts or any other components of your design with data. Present your design with charts and graphs.</div>
				</div>
			</div>
		)
	}
})

const Left = React.createClass({
	render:function(){
		var session = this.props.session;
		var box;
		if(session == false){
			box = null;
		} else if (session != null){
			box = <UserCard session={session} />
		} else {
			box = <DefaultCard />
		}
		return (
			<div id="left">
				{box}
			</div>
		)
	}
})


module.exports = Left;