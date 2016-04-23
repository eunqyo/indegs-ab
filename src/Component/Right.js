import React from 'react';

const NoticeItem = React.createClass({
	render:function(){
		return (
			<div className="notice-item">
				<div className="header">
					<span className="version">Beta 1.0</span>
					<span className="version-date">2016-10-13</span>
				</div>
				<div className="contents">
					<div className="title">Beta Launched!</div>
				</div>
				<div className="cb"></div>
			</div>
		)
	}
})

const Notice = React.createClass({
	render:function(){
		return (
			<div id="notice">
				<div id="notice-title">NOTICE</div>
				<NoticeItem />
			</div>
		)
	}
});

const AdsItem = React.createClass({
	goDesktop:function(){
		window.open('http://desktop.indegs.com')
	},
	render:function(){
		return (
			<div className="ads-item" onClick={this.goDesktop}>
				<div className="ads-pic-holder">
					<img src="/images/indegs-pc.png" className="ads-pic"/>
				</div>
				<div className="ads-info">
					<div className="title">Create infinite versions of your design</div>
					<div className="link">Indegs-desktop on Mac and Windows ></div>
				</div>
			</div>
		)
	}
})

const Ads = React.createClass({
	render:function(){
		return (
			<div className="section" id="ads">
				<div id="ads-title">ADVERTISEMENT</div>
				<AdsItem />
			</div>
		)
	}
});

const Right = React.createClass({
	render:function(){
		return (
			<div id="right">
				<Ads />
			</div>
		)
	}
})


module.exports = Right;