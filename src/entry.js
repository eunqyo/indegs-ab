// 'use strict';

window.$ = window.jQuery = require('jquery');
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

import AppHistory from './Util/AppHistory';

import AppStore from './Store/AppStore';
import AppAction from './Action/AppAction';
import AppAPI from './API/AppAPI';

var Header = require('./Component/Header.js');
var Banner = require('./Component/Banner.js');
var Cards = require('./Component/Cards.js');
var AB = require('./Component/AB.js');
var Join = require('./Component/Join.js');
var Post = require('./Component/Post.js');
var User = require('./Component/User.js');
var Analysis = require('./Component/Analysis.js');


import Main from './Component/Main';
import CardAPI from './API/CardAPI';

import UserAPI from './API/UserAPI';

AppAPI.getSession();

const App = React.createClass({
	getInitialState:function(){
		return ({
			session:AppStore.getSession()
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize)
		AppStore.addChangeListener(this._onChange);
		this.layout();
		this.preventDrop();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize)
	},
	_onResize:function(){
		this.layout()
	},
	layout:function(){
		var windowHeight = $(window).outerHeight();
		$('#app-body').css('min-height',windowHeight);
	},
	_onChange:function(){
		this.setState({
			session:AppStore.getSession()
		})
	},
	preventDrop:function(){
		var holder = document.getElementById('app');
		holder.ondragover = function () {
			return false;
		};
		holder.ondragleave = function() {
			return false;
		};

		holder.ondragend = function () {
			return false;
		};
		holder.ondrop = function (e) {
			e.preventDefault();
			return false;
		};
	},
	render:function(){
		var session = this.state.session;
		if(this.props.children == null){
			var main = <Main session={session} />
		} else {
			var main = null
		}
		return (
			<div id="app-body">
				<Header session={session} location={this.props.location.pathname} />
				{this.props.children}
				{main}
			</div>
		)
	}
})


render((
  <Router history={AppHistory}>
    <Route path="/" component={App}>
		<Route path="/join" component={Join}></Route>
		<Route path="/users/:_id" component={User}></Route>
		<Route path="/post" component={Post}></Route>
		<Route path="/cards/:card_id" component={AB}></Route>
		<Route path="/analysis/:card_id" component={Analysis}></Route>
    </Route>
  </Router>
), document.getElementById('app'))