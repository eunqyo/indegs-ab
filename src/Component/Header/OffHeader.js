import React from 'react';
import { Link } from 'react-router';

import UserAction from '../../Action/UserAction';
import UserStore from '../../Store/UserStore';
import UserAPI from '../../API/UserAPI';

import AppAPI from '../../API/AppAPI';

import SigninModal from '../Common/SigninModal';



const SigninBtn = React.createClass({
	getInitialState:function(){
		return({
			toggle:false
		})
	},
	toggleModal:function(e){
		var toggle = this.state.toggle;
		var a = $('#signin-modal');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			this.setState({
				toggle:!toggle
			})
		}
	},
	render:function(){
		var self = this;
		var toggle = this.state.toggle;
		if(toggle){
			var signinModal = <SigninModal toggle={this.toggleModal}/>;
		} else {
			var signinModal = null;
		}
		return (
			<div className="btn" id="signin-btn" onClick={this.toggleModal}>
				<span>Signin</span>
				<div id="signin-modal-container">
					{signinModal}
				</div>
			</div>
		)
	}
})

const OffHeader = React.createClass({
	render:function(){
		return (
			<div id="signin-off-btn">
				<Link to={`/join`}>
					<div className="btn" id="signup-btn">
						<span>Signup</span>
					</div>
				</Link>
				<SigninBtn />
			</div>
		)
	}
});

module.exports = OffHeader;



