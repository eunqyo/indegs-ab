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
	handlePageClick:function(){
		this.props.toggle()
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
				<Link to={'/users/'+session._id} onClick={this.handlePageClick}>
					<div className="item">Your page ></div>
				</Link>
				<div className="bar"></div>
				<div className="item" id="logout" onClick={this.handleSignout}>Sign out ></div>
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
		var toggle = this.state.toggle;
		var self = this;
		if(e){
			var a = $('#user-menu');
			if(a.is(e.target) || a.has(e.target).length > 0) return null;
			self.setState({
				toggle:!toggle
			});
		} else {
			self.setState({
				toggle:!toggle
			})
		}
	},
	render:function(){
		var session = this.props.session;
		var toggle = this.state.toggle;
		var menu,src,body;
		if(session.pic != null){
			src = Servers.s3 + session.pic;
			body = <img src={src} />
		} else {
			src = null;
			body = <div className="default-pic"></div>
		}

		if(toggle) menu = <UserMenu session={session} toggle={this.toggleMenu} />;
		else menu = null;

		return (
			<div id="user-pic" onClick={this.toggleMenu} >
				{body}
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