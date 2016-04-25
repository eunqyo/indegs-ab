import React from 'react';
import { Link } from 'react-router';

import AppStore from '../Store/AppStore';
import credentials from '../../credentials';
var AppAction = require('../Action/AppAction.js');

var AppAPI = require('../API/AppAPI.js');

var CardAPI = require('../API/CardAPI.js');

import OnHeader from './Header/OnHeader';
import OffHeader from './Header/OffHeader';


const LoginBox = React.createClass({
	getInitialState:function(){
		return({
			message:null
		})
	},
	componentDidMount:function(){
		var self = this;
		document.body.addEventListener('click',this.handleBodyClick);
		document.body.addEventListener('keypress',this.handleEnter);

	},
	componentWillUnmount:function(){
		document.body.removeEventListener('click',this.handleBodyClick);
		document.body.removeEventListener('keypress',this.handleEnter);
	},
	handleBodyClick:function(e){
		var self = this;
		var a = $('#login-holder');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			self.props.toggle(false)
		}
	},
	handleEnter:function(e){
		// e.preventDefault()
		var self = this;
		if(e.which == 13){
			self.submit()
		}
	},
	submit:function(){
		var self = this;
		var json = {
			email:$('#login-email input').val(),
			pw:$('#login-pw input').val()
		};
		AppAPI.handleLogin(json,function (message){
			self.shakeForm()
			self.setState({
				message:message
			})
		})
	},
	shakeForm:function(e){
		var l = 10;  
		for( var i = 0; i < 8; i++ ){  
			$( "#login-holder" ).animate( { 
				'left': "+=" + ( l = -l ) + 'px',
				'right': "-=" + l + 'px'
			}, 50);  
		}
	},
	handleEmail:function(e){
		var value = $(e.target).val()
		this.setState({
			value:value
		})
	},
	handleFBLogin:function(){
		FB.login(function(response){
			console.log(response)
		});
	},
	render:function(){
		var message = this.state.message;
		var title,titleStyle;
		if(message != null){
			title = message
			titleStyle = {'color':'#ff4242'}
		} else {
			title = 'Welcome Back !';
			titleStyle = null;
		}

		return (
			<div id="login-holder">
				<div id="login-tri"></div>
				<div id="login-cover"></div>
				<div id="login-title" style={titleStyle}>{title}</div>
				<div id="login-email">
					<input type="email" autoCorrect="off" spellCheck="false" name="email" className="user" placeholder="Email address" onChange={this.handleEmail} value={this.state.value} autoComplete="off"></input>
				</div>
				<div id="login-pw">
					<input type="password" name="pw" className="user" placeholder="Password"></input>
				</div>
				<input type="submit" id="login-submit" onClick={this.submit} value={'Signin'}></input>
				<div id="fb-login" onClick={this.handleFBLogin}>Signin with facebook</div>
			</div>
		)
	}
})

const OffBtn = React.createClass({
	getInitialState:function(){
		return({
			loginToggle:false
		})
	},
	login:function(){
		this.setState({
			loginToggle:true
		})
	},
	onToggle:function(bool){
		this.setState({
			loginToggle:bool
		})
	},
	render:function(){
		var self = this;
		var loginToggle = this.state.loginToggle;
		if(loginToggle){
			var loginBox = <LoginBox toggle={self.onToggle}/>;
		} else {
			var loginBox = null;
		}
		var string = "Don't have an Indegs ID? Create one now. >"
		return (
			<div id="login-off-btn">
				<Link to={`/join`}>
					<div className="btn" id="signup-btn">Signup</div>
				</Link>
				<div className="btn" id="login-btn" onClick={this.login}>
					Signin
				</div>
				{loginBox}
			</div>
		)
	}
});

const ProfileBox = React.createClass({
	componentDidMount:function(){
		var self = this;
		document.body.addEventListener('click',this.handleBodyClick)
	},
	componentWillUnmount:function(){
		document.body.removeEventListener('click',this.handleBodyClick)
	},
	handleBodyClick:function(e){
		var self = this;
		var a = $('#profile-box');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			self.props.toggle(false)
		}
	},
	handleLogout:function(){
		AppAPI.handleLogout()
	},
	toggleBox:function(){
		this.props.toggle(false)
	},
	render:function(){
		var session = this.props.session;

		return (
			<div id="profile-box">
				<div id="tri"></div>
				<div id="cover"></div>
				<Link to={'/users/'+session._id}>
					<div className="item" id="mypage" onClick={this.toggleBox} >
						{'@' + session.name}
					</div>
				</Link>
				<div className="item" id="logout" onClick={this.handleLogout} >Log out</div>
			</div>
		)
	}
})


const UserPic = React.createClass({
	handleImageLoad:function(e){
		var image = $(e.target);
		image.parent().children('#loader').css('display','none');
	},
	render:function(){
		var session = this.props.session;
		var src;
		if(session.pic != null){
			src = credentials.image_server + '/' + session.pic;
		} else {
			src = null;
		}
		return (
			<div id="image-holder">
				<div id="loader"></div>
				<img src={src} id="image" onLoad={this.handleImageLoad} />
			</div>
		)
	}
})
const OnBtn = React.createClass({
	getInitialState:function(){
		return({
			session:this.props.session,
			toggle:false
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			session:nextProps.session
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
		var session = this.state.session;
		var toggle = this.state.toggle;
		var userPicStyle;

		if(toggle){
			var profileBox = <ProfileBox session={session} toggle={self.onToggle}/>;
		} else {
			var profileBox = null;
		}

		return (
			<div id="login-on-btn">
				<Link to={'/post'}>
					<div id="create">
						<div id="icon"></div>
						<div id="btn">Create</div>
						<div id="bar"></div>
					</div>
				</Link>
				<div id="go-mypage" onClick={this.toggleProfile}>
					<UserPic session={session} />
				</div>
				{profileBox}
			</div>
		)
	}
});

const PostBtn = React.createClass({
	getInitialState:function(){
		return ({
			message:null,
			session:this.props.session,
			loading:false
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			session:nextProps.session
		})
	},
	componentDidMount:function(){
		AppStore.addChangeListener(this._onChange)
	},
	componentWillUnmount:function(){
		AppStore.removeChangeListener(this._onChange)
	},
	_onChange:function(){
		this.setState({
			upload:AppStore.getUpload()
		})
	},
	publish:function(){
		var self = this;
		var postObj = AppStore.getPost();
		var session = this.state.session;
		postObj.session = session;
		if(postObj.title == null){
			self.setState({
				message:'Title is empty'
			});
		} else if(postObj.A == null){
			self.setState({
				message:'Version A is empty'
			})
		} else if(postObj.B == null){
			self.setState({
				message:'Version B is empty'
			})
		} else {
			self.setState({
				message:null,
				loading:true
			});
			CardAPI.postCard(postObj)
		}
	},
	render:function(){
		var publish;
		if(this.state.message==null){
			var message = null
		} else {
			var message = <div id="header-publish-message">{this.state.message}</div>
		}

		if(this.state.loading){
			publish = <div id="header-publish-loading"></div>
		} else {
			publish = <div className="header-btn" id="header-publish" onClick={this.publish} >Publish ></div>

		}

		return (
			<div id="post-on-btn">
				{message}
				{publish}
				<div className="cb"></div>
			</div>
		)
	}
})

const Header = React.createClass({
	render:function(){
		var session = this.props.session;
		var location = this.props.location;
		var headerBtn;

		if(session == false){
			headerBtn = null;
		} else if (session == null) {
			headerBtn = <OffHeader />
		} else {
			if(location == '/post'){
				headerBtn = <PostBtn session={session} />
			} else {
				headerBtn = <OnBtn session={session} />
			}
		}


		return (
			<div id="header">
				<div className="c1190" id="header-wrapper">
					<Link to={`/`}><div id="logo">indegs home</div></Link>
					<div id="header-right">
						{headerBtn}
					</div>
					<div className="cb"></div>
				</div>
			</div>
		)
	}
});

module.exports = Header;
