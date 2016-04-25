import React from 'react';
import { Link } from 'react-router';

import UserAction from '../../Action/UserAction';
import UserStore from '../../Store/UserStore';
import UserAPI from '../../API/UserAPI';

import AppAPI from '../../API/AppAPI';

const SigninSubmit = React.createClass({
	componentDidMount:function(){
		document.body.addEventListener('keypress',this.handleEnter);
		var self = this;
	},
	componentWillUnmount:function(){
		document.body.removeEventListener('keypress',this.handleEnter);
	},
	handleEnter:function(e){
		var self = this;
		if(e.which == 13){
			self.handleSignin()
		}
	},
	handleSignin:function(){
		var self = this;
		var json = {
			email   : $('#login-email input').val(),
			pw      : $('#login-pw input').val()
		}
		AppAPI.handleLogin(json,function (onErrorMessage){
			self.shakeForm();
			self.props.onErrorMessage(onErrorMessage)
		})
	},
	shakeForm:function(){
		var l = 10;  
		for( var i = 0; i < 8; i++ ){  
			$( "#login-holder" ).animate( { 
				'left': "+=" + ( l = -l ) + 'px',
				'right': "-=" + l + 'px'
			}, 50);  
		}
	},
	render:function(){
		return (
			<div id="login-submit">
				<input type="submit" onClick={this.handleSignin} value={'Signin'}></input>
			</div>
		)
	}
})

const LoginBox = React.createClass({
	getInitialState:function(){
		return({
			message:null
		})
	},
	componentDidMount:function(){
		document.body.addEventListener('click',this.handleBodyClick);
	},
	componentWillUnmount:function(){
		document.body.removeEventListener('click',this.handleBodyClick);
	},
	handleBodyClick:function(e){
		var self = this;
		var a = $('#login-holder');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			self.props.toggle(false)
		}
	},
	handleSubmitError:function(onErrorMessage){
		this.setState({
			message:onErrorMessage
		})
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
					<input type="email" autoCorrect="off" spellCheck="false" name="email" className="user" placeholder="Email address" autoComplete="off"></input>
				</div>
				<div id="login-pw">
					<input type="password" name="pw" className="user" placeholder="Password"></input>
				</div>
				<SigninSubmit onErrorMessage={this.handleSubmitError} />
			</div>
		)
	}
})

const OffHeader = React.createClass({
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

module.exports = OffHeader;



