import React from 'react';

import AppAPI from '../API/AppAPI';
import AppAction from '../Action/AppAction';
import AppStore from '../Store/AppStore';

import CardAction from '../Action/CardAction';
import CardStore from '../Store/CardStore';
import CardAPI from '../API/CardAPI';

import UserAction from '../Action/UserAction';
import UserStore from '../Store/UserStore';
import UserAPI from '../API/UserAPI';

import Right from './Right';
import credentials from '../../credentials';

import Cards from './User/Cards';

const PictureEdit = React.createClass({
	getInitialState:function(){
		return({
			user:this.props.user,
			loading:false
		})
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			user:nextProps.user
		})
	},
	componentDidMount:function(){
		document.body.addEventListener('click',this.handleBodyClick)
		this.initCroppie()
	},
	componentWillUnmount:function(){
		document.body.removeEventListener('click',this.handleBodyClick);
		URL.revokeObjectURL(this.tmpPath)
	},
	handleBodyClick:function(e){
		var self = this;
		var a = $('#pic-edit-holder');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			self.props.toggle(false)
		}
	},
	handleClick:function(){
		$('#user-pic-input').click()
	},
	handleChange:function(e){
		var file = e.target.files[0];
		this.checkExtension(file)
		e.target.value = null;
	},
	checkExtension:function(file){
		var self = this;
		var extObj = file.name.split('.');
		var ext = extObj[extObj.length-1];
		if(ext == 'png' || ext == 'jpg' || ext == 'jpeg'){
			self.updatePic(file)
		} else {
			self.setState({
				message:'[!] Upload a image file'
			})
		}
	},
	updatePic:function(file){
		var self = this;
		var croppie = this.croppie;
		this.tmpPath = URL.createObjectURL(file);
		croppie.bind(this.tmpPath);
		// URL.revokeObjectURL(tmpPath)
	},
	initCroppie:function(){
		var self = this;
		var croppie = require('croppie');
		this.croppie = new Croppie(document.getElementById('pic-edit-box'), {
		    viewport: {
		        width: 200,
		        height: 200
		    },
		    boundary: {
		        width: 300,
		        height: 250
			}
		});
		// if(session.pic!=null){
		// 	self.croppie.bind(credentials.image_server + '/'+ user.pic)
		// }
	},
	handleConfirm:function(){
		var self = this;
		var croppie = this.croppie;
		var user = this.state.user;
		this.setState({
			loading:true
		})
		var result = croppie.result('canvas').then(function (img){
			var data = {};
			data.session = user;
			data.image = img;

			AppAPI.uploadUserPic(data,function(){
				self.setState({
					loading:false
				});
				self.props.toggle(false)
			})
		});
	},
	render:function(){
		var self = this;
		var loading = this.state.loading;
		var confirm;
		if(loading){
			confirm = <div id="pic-edit-loading"></div>
		} else {
			confirm = <div id="pic-edit-submit" onClick={self.handleConfirm} >Save Changes ></div>
		}
		return (
			<div id="pic-edit-holder">
				<div id="pic-edit-box"></div>
				<div id="pic-edit-action">
					{confirm}
					<div id="pic-edit-upload" onClick={this.handleClick}>Upload</div>
					<div className="cb"></div>
					<input type="file" id="user-pic-input" onChange={this.handleChange} />
				</div>
			</div>
		)
	}
})

const UserPicture = React.createClass({
	getInitialState:function(){
		return ({
			user:this.props.user,
			owner:this.props.owner,
			toggle:false
		})
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			user:nextProps.user,
			owner:nextProps.owner
		})
	},
	toggleEdit:function(e){
		this.setState({
			toggle:true
		})
	},
	handleToggle:function(bool){
		this.setState({
			toggle:false
		})
	},
	handleImageLoad:function(e){
		var image = $(e.target);
		image.parent().children('#loader').css('display','none');
	},
	render:function(){
		var self = this;
		var owner = this.state.owner;
		var user = this.state.user;
		var toggle = this.state.toggle;
		var src,btn,edit;
		if(owner) btn = <div id="user-pic-btn" onClick={self.toggleEdit}>Change Picture ></div>;
		else btn = null;
		if(toggle) edit = <PictureEdit user={user} toggle={self.handleToggle} />;
		else edit = null;
		if(user.pic!=null) src = credentials.image_server + '/' + user.pic;
		else src = null;


		return (
			<div id="user-pic-section">
				<div id="holder">
					<div id="loader"></div>
					<img src={src} id="pic" onLoad={this.handleImageLoad}/>
				</div>
				{btn}
				{edit}
			</div>
		)
	}
});

const Center = React.createClass({
	getInitialState:function(){
		return ({
			user:this.props.user,
			owner:this.props.owner,
			session:this.props.session,
			published:this.props.published,
			participated:this.props.participated
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			user:nextProps.user,
			owner:nextProps.owner,
			session:nextProps.session,
			published:nextProps.published,
			participated:nextProps.participated
		})
	},
	goParticipated:function(){
		UserAction.changeMode("par");
	},
	goPublished:function(){
		UserAction.changeMode("pub");
	},
	render:function(){
		var owner = this.state.owner;
		var user = this.state.user;
		var session = this.state.session;
		var published = this.state.published;
		var participated = this.state.participated;
		var mode = this.props.mode;
		if(mode==null || mode == "pub"){
			var par = null;
			var pub = <Cards cards={published} session={session} />;
			var pubStyle = {borderBottom:"2px solid black"};
			var parStyle = null;
		} else {
			var pub = null;
			var par = <Cards cards={participated} session={session} />
			var parStyle = {borderBottom:"2px solid black"};
			var pubStyle = null;
		}
		return (
			<div id="center">
				<div id="user-category">
					<div className="category" style={pubStyle} onClick={this.goPublished} >
						<div className="title">Published</div>
						<div className="cnt">{user.published.length}</div>
						<div className="cb"></div>
					</div>
					<div className="category" style={parStyle} onClick={this.goParticipated} >
						<div className="title">Participated</div>
						<div className="cnt">{user.participated.length}</div>
						<div className="cb"></div>
					</div>
					<div className="cb"></div>
				</div>
				{pub}
				{par}
			</div>
		)
	}
})


const Header = React.createClass({
	getInitialState:function(){
		return ({
			session:this.props.session,
			user:this.props.user,
			owner:this.props.owner
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			user:nextProps.user,
			session:nextProps.session,
			owner:nextProps.owner
		})
	},
	render:function(){
		var owner = this.state.owner;
		var session = this.state.session;
		var user = this.state.user;
		var userInfo,userPic;
		if(user!=null){
			userInfo = <div id="userinfo-holder">
							<div id="user-email">{user.email}</div>
							<div id="user-name">{'@' +user.name}</div>
						</div>
			userPic = <UserPicture owner={owner} user={user} session={session}/>
		} else {
			userInfo = null
		}
		return (
			<div id="user-header">
				<div id="left-header">
					{userPic}
					{userInfo}
					<div className="cb"></div>
				</div>
				<Center owner={owner} user={user} />
				<div className="cb"></div>
			</div>
		)
	}
});

const Left = React.createClass({
	getInitialState:function(){
		return ({
			user:this.props.user,
			owner:this.props.owner
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			user:nextProps.user,
			owner:nextProps.owner
		})
	},
	render:function(){
		var user = this.state.user;
		var owner = this.state.owner;
		return (
			<div id="left">
				<UserPicture owner={owner} user={user} />
				<div id="userinfo-holder">
					<div id="user-email">{user.email}</div>
					<div id="user-name">{'@'+user.name}</div>
				</div>
			</div>
		)
	}
})

const User = React.createClass({
	getInitialState:function(){
		return ({
			session:AppStore.getSession(),
			user:AppStore.getUser(),
			cards:UserStore.getUserCards(),
			mode:UserStore.getMode()
		})
	},
	componentDidMount:function(){
		var _id = this.props.params._id;
		AppAPI.receiveUser(_id);
		UserAPI.receiveUserCards(_id);
		AppStore.addChangeListener(this._onChange);
		UserStore.addChangeListener(this._onUserChange);
		this.checkUser()
	},
	componentWillReceiveProps:function(nextProps){
		var _id = this.props.params._id;
		if(_id != nextProps.params._id){
			AppAction.updateUser(null);
			UserAction.updateUserCards(null)
			AppAPI.receiveUser(nextProps.params._id);
			UserAPI.receiveUserCards(nextProps.params._id);
		}
	},
	componentWillUnmount:function(){
		AppStore.removeChangeListener(this._onChange);
		UserStore.removeChangeListener(this._onUserChange);
		AppAction.updateUser(null);
		UserAction.updateUserCards(null)
	},
	_onChange:function(){
		var self = this;
		this.setState({
			session:AppStore.getSession(),
			user:AppStore.getUser(),
		},function(){
			self.checkUser()
		})
	},
	_onUserChange:function(){
		this.setState({
			cards:UserStore.getUserCards(),
			mode:UserStore.getMode()
		})
	},
	checkUser:function(){
		var self = this;
		var session = this.state.session;
		var user = this.state.user;

		if(session == null || user == null){
			self.setState({
				owner:false,
			})
		} else {
			if(session._id == user._id){
				self.setState({
					owner:true,
					user:session
				})
			} else {
				self.setState({
					owner:false
				})
			}
		}
	},
	render:function(){
		var owner = this.state.owner;
		var user = this.state.user;
		var session = this.state.session;
		var cards = this.state.cards;
		var mode = this.state.mode;
		var left,center,header;
		if(user!=null && owner != null){
			left = <Left owner={owner} user={user} />;
			header = <Header owner={owner} user={user} session={session} />
			if(cards!=null){
				center = <Center owner={owner} session={session} user={user} published={cards.published} participated={cards.participated} mode={mode}/>
			} else {
				center = null;
			}
		} else {
			left = null;
			header = null;
			center = null;
		}
		return (
			<div id="user" className="c1190">
				{left}
				{center}
			</div>
		)
	}
})


module.exports = User;