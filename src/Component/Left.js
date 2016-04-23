import React from 'react';

import AppAPI from '../API/AppAPI';
import UserAction from '../Action/UserAction';
import credentials from '../../credentials';
import { Link, browserHistory } from 'react-router';



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
})

const UserCard = React.createClass({
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
	render:function(){
		var session = this.state.session;
		return (
			<div id="user-card">
				<UserCardPic session={session} />
				<UserStatus session={session} />
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
	render:function(){
		var a;
		var session = this.state.session;
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