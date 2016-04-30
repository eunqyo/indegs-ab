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

import Util from '../Util/Util';


import Right from './Right';
import Servers from '../Util/Servers';
import Colors from '../Util/Colors';

import Cards from './User/Cards';
import UserInfo from './User/UserInfo';

import Activity from './User/Activity';

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
		var a = $('#pic-edit');
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
		// Colors.process(this.tmpPath)
		croppie.bind(this.tmpPath);
		// URL.revokeObjectURL(tmpPath)
	},
	initCroppie:function(){
		var self = this;
		var croppie = require('croppie');
		this.croppie = new Croppie(document.getElementById('pic-edit-view'), {
		    viewport: {
		        width: 200,
		        height: 200
		    },
		    boundary: {
		        width: 300,
		        height: 250
			}
		});
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
			Colors.getColorSchema(img,function (colorSchema){
				data.colorSchema = colorSchema;
				UserAPI.uploadUserPic(data,function(){
					self.setState({
						loading:false
					});
					self.props.toggle(false)
				})
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
			<div id="pic-edit" className="modal">
				<div className="modal-top-arrow"></div>
				<div className="modal-top-cover"></div>
				<div id="pic-edit-view"></div>
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

const UserPic = React.createClass({
	getInitialState:function(){
		return ({
			toggle:false
		})
	},
	toggleBox:function(){
		var toggle = this.state.toggle
		this.setState({
			toggle:!toggle
		})
	},
	render:function(){
		var user = this.props.user;
		var toggle = this.state.toggle;
		var box,back;
		if(toggle){
			box = <PictureEdit user={user} toggle={this.toggleBox} />
			back = <div id="modal-background"></div>
		} else {
			box = null;
			back = null;
		}
		var src;
		if(user.pic == null) src = null;
		else {
			src = Servers.s3 + user.pic;
			// Colors.process(src)

		};
		return (
			<div id="user-pic">
				<div id="user-pic-drop">
					<span onClick={this.toggleBox}>Change</span>
				</div>
				<img src={src} />
				{box}
				{back}
			</div>
		)
	}
});

const Follow = React.createClass({
	render:function(){
		return (
			<div id="user-follow">Follow</div>
		)
	}
});


const BackgroundBlur = React.createClass({
	render:function(){
		var palette = this.props.palette;
		var dominantColor = this.props.dominantColor;

		var style = {
			backgroundColor:'rgb('+ dominantColor.join(',') +')'
		}
		var style1 = {
			backgroundColor:'rgb('+ palette[0].join(',') +')'
		}
		var style2 = {
			backgroundColor:'rgb('+ palette[1].join(',') +')'
		}
		return (
			<div id="user-background-blur">
				<div className="blur" style={style}></div>
				<div className="blur" style={style1}></div>
				<div className="blur" style={style2}></div>
			</div>
		)
	}
})
const UserBackground = React.createClass({
	render:function(){
		var src;
		var user = this.props.user;
		var dominantColor = user.colorSchema.dominantColor;
		var palette = user.colorSchema.palette;
		var blur;
		if(dominantColor.length == 0 || palette.length == 0){
			blur = null;
		} else {
			blur = <BackgroundBlur palette={palette} dominantColor={dominantColor}/>
		}

		return (
			<div id="user-background">
				{blur}
			</div>
		)
	}
})

const UserHeader = React.createClass({
	render:function(){
		var user = this.props.user;
		var isOwner = this.props.owner;
		return (
			<div id="user-header">
				<div className="c1190">
					<UserPic user={user} />
					<UserInfo colorSchema={user.colorSchema} user={user} isOwner={isOwner} />
					<Follow user={user} />
					<div className="cb"></div>
				</div>
				<UserBackground user={user} />
			</div>
		)
	}
});

const User = React.createClass({
	getInitialState:function(){
		return ({
			session:AppStore.getSession(),
			user:AppStore.getUser()
		})
	},
	componentDidMount:function(){
		var _id = this.props.params._id;
		UserAPI.receiveUser(_id);
		AppStore.addChangeListener(this._onSessionChange);
		UserStore.addChangeListener(this._onChange);
		this.checkUser();
	},
	componentWillUnmount:function(){
		AppStore.removeChangeListener(this._onSessionChange);
		UserStore.removeChangeListener(this._onChange);
	},
	_onSessionChange:function(){
		var self = this;
		this.setState({
			session:AppStore.getSession()
		},function(){
			self.checkUser()
		})
	},
	_onChange:function(){
		this.setState({
			user:UserStore.getUser()
		})
	},
	checkUser:function(){
		var self = this;
		var session = this.state.session;
		var user = this.state.user;
		if(session == null || user == null) return null;
		if(session._id == user._id){
			self.setState({
				isOwner:true
			})
		} else {
			self.setState({
				isOwner:false
			})
		}
	},
	render:function(){
		var user = this.state.user;
		var isOwner = this.state.isOwner;
		if(user==null) return null;

		return (
			<div id="user">
				<UserHeader user={user} isOwner={isOwner} />
				<div id="user-body" className="c1190">
					<Activity user={user} />
				</div>
			</div>
		)
	}
})


module.exports = User;