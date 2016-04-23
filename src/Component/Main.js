import React from 'react';

import Cards from './Cards';
import Left from './Left';
import Right from './Right';

import AppStore from '../Store/AppStore';
import AppAPI from '../API/AppAPI';
import AppAction from '../Action/AppAction';

const Main = React.createClass({
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
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize)
		this.layout()
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	_onResize:function(){
		this.layout()
	},
	layout:function(){
		var windowHeight = $(window).outerHeight();
		$('#main').css('min-height',windowHeight)
	},
	render:function(){
		var session = this.state.session;
		return (
			<div id="main">
				<div className="c1190">
					<Left session={session} />
					<Cards session={session} />
					<Right session={session} />
					<div className="cb"></div>
				</div>
			</div>
		)
	}
})


module.exports = Main;