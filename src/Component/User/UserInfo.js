import React from 'react';

const UserInfo = React.createClass({
	render:function(){
		var user = this.props.user;
		var isOwner = this.props.isOwner;
		// var colorSchema = this.props.colorSchema;

		// var nameStyle,emailStyle;
		// if(colorSchema == null || colorSchema.backgroundColor.length == 0 || colorSchema.textColor.length == 0) {
		// 	nameStyle = null;
		// 	emailStyle = null;
		// } else {
		// 	var backgroundColor = colorSchema.backgroundColor;
		// 	var textColor = colorSchema.textColor;
		// 	var nameStyle = {
		// 		color:'rgb(' + textColor[0].join(',') + ')'
		// 	}
		// 	var emailStyle = {
		// 		color:'rgb(' + textColor[1].join(',') + ')'
		// 	}
		// }

		return (
			<div id="user-info">
				<div id="user-info-name">
					<span>{user.name}</span>
				</div>
				<div id="user-info-email">
					<span>{'('+user.email+')'}</span>
				</div>
			</div>
		)
	}
})

module.exports = UserInfo;