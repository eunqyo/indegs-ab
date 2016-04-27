import React from 'react';
import { Link } from 'react-router';
import Servers from '../../Util/Servers';

import AppAPI from '../../API/AppAPI';
import UserAPI from '../../API/UserAPI';

const UserMenuTitle = React.createClass({
	render:function(){
		var session = this.props.session;
		return (
			<div id="user-menu-title">
				<span id="welcome">Welcome, </span>
				<span id="name">{'@'+session.name}</span>
			</div>
		)
	}
})

const UserMenu = React.createClass({
	componentDidMount:function(){
		var self = this;
		document.body.addEventListener('click',this.handleBodyClick)
	},
	componentWillUnmount:function(){
		document.body.removeEventListener('click',this.handleBodyClick)
	},
	handleBodyClick:function(e){
		this.props.toggle(e)
	},
	handleSignout:function(){
		AppAPI.handleSignout();
	},
	render:function(){
		var session = this.props.session;

		return (
			<div id="user-menu" className="modal">
				<div className="modal-top-arrow"></div>
				<div className="modal-top-cover"></div>
				<UserMenuTitle session={session} />

				<div className="item" onClick={this.goMypage}>Your page</div>
				<div className="item" onClick={this.goMyLike}>Your likes</div>
				<div className="bar"></div>
				<div className="item" id="logout" onClick={this.handleSignout}>Sign out</div>
			</div>
		)
	}
})


const UserPic = React.createClass({
	getInitialState:function(){
		return ({
			toggle:false
		})
	},
	toggleMenu:function(e){
		var a = $('#user-menu');
		if(a.is(e.target) || a.has(e.target).length > 0) return null;
		var toggle = this.state.toggle;
		this.setState({
			toggle:!toggle
		});
	},
	render:function(){
		var session = this.props.session;
		var toggle = this.state.toggle;
		var menu,src;
		if(session.pic != null) src = Servers.s3 + session.pic;
		else src = null;

		if(toggle) menu = <UserMenu session={session} toggle={this.toggleMenu} />;
		else menu = null;

		return (
			<div id="user-pic" onClick={this.toggleMenu} >
				<img src={src} />
				{menu}
			</div>
		)
	}
});

const NewAB = React.createClass({
	render:function(){
		return (
			<Link to={'/post'}>
				<div id="new-ab" className="button">How about 'Helvetica' vs 'Open Sans'</div>
			</Link>
		)
	}
});


const OnHeader = React.createClass({
	getInitialState:function(){
		return ({
			toggle:false
		})
	},
	toggleProfile:function(){
		this.setState({
			toggle:true
		})
	},
	onToggle:function(bool){
		this.setState({
			toggle:false
		})
	},
	render:function(){
		var self = this;
		var session = this.props.session;
		var toggle = this.state.toggle;
		var userPicStyle;

		return (
			<div id="login-on-header">
				<NewAB />
				<UserPic session={session} />
			</div>
		)
	}
});

module.exports = OnHeader;