import React from 'react';
import { Link } from 'react-router';

import AppStore from '../Store/AppStore';
import credentials from '../../credentials';
var AppAction = require('../Action/AppAction.js');

var AppAPI = require('../API/AppAPI.js');

var CardAPI = require('../API/CardAPI.js');

import OnHeader from './Header/OnHeader';
import OffHeader from './Header/OffHeader';

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
			headerBtn = <OnHeader session={session} />
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
