import React from 'react';

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
			email   : $('#signin-email > input').val(),
			pw      : $('#signin-pw > input').val()
		}
		AppAPI.handleLogin(json,function (onErrorMessage){
			self.shakeForm();
			self.props.onErrorMessage(onErrorMessage)
		})
	},
	shakeForm:function(){
		var l = 10;  
		for( var i = 0; i < 8; i++ ){  
			$( "#signin-modal" ).animate( { 
				'left': "+=" + ( l = -l ) + 'px',
				'right': "-=" + l + 'px'
			}, 50);  
		}
	},
	render:function(){
		return (
			<div id="signin-submit">
				<input type="submit" onClick={this.handleSignin} value={'Signin'}></input>
			</div>
		)
	}
})

const SigninModal = React.createClass({
	getInitialState:function(){
		return({
			title:this.props.title
		})
	},
	componentDidMount:function(){
		document.getElementById('signin-modal-container').addEventListener('click',this.handleBodyClick);
	},
	componentWillUnmount:function(){
		document.getElementById('signin-modal-container').removeEventListener('click',this.handleBodyClick);
	},
	handleBodyClick:function(e){
		this.props.toggle(e)
	},
	handleSubmitError:function(title){
		this.setState({
			title:title
		})
	},
	render:function(){
		var title = this.state.title;
		var title,titleStyle;
		if(title != null){
			title = title
			titleStyle = {'color':'#ff4242'}
		} else {
			title = 'Welcome Back !';
			titleStyle = null;
		}

		return (
			<div>
				<div id="signin-modal" className="modal">
					<div className="modal-top-arrow"></div>
					<div className="modal-top-cover"></div>
					<div id="title" style={titleStyle}>{title}</div>
					<div id="signin-email">
						<input type="email" autoCorrect="off" spellCheck="false" name="email" placeholder="Email address" autoComplete="off"></input>
					</div>
					<div id="signin-pw">
						<input type="password" name="pw" placeholder="Password"></input>
					</div>
					<SigninSubmit onErrorMessage={this.handleSubmitError} />
				</div>
				<div className="modal-background"></div>
			</div>
		)
	}
})


module.exports = SigninModal;