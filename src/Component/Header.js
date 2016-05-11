import React from 'react';
import { Link } from 'react-router';

import AppStore from '../Store/AppStore';
import credentials from '../../credentials';
var AppAction = require('../Action/AppAction.js');

var AppAPI = require('../API/AppAPI.js');

var CardAPI = require('../API/CardAPI.js');

import OnHeader from './Header/OnHeader';
import OffHeader from './Header/OffHeader';
import Search from './Header/Search';

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
					<Link to={`/`}>
						<div id="logo">De</div>
					</Link>
					<Search />
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
