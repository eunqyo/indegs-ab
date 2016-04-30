import React from 'react';

import DataStore from '../../Store/DataStore';
import DataAPI from '../../API/DataAPI';
import DataAction from '../../Action/DataAction';

const LikesData = React.createClass({
	render:function(){
		var section = this.props.section;
		var likes = this.props.likes;

		if(likes.menLikes + likes.womenLikes == 0){
			var menPer = 0;
			var womenPer = 0;
		} else {
			var menPer = (likes.menLikes/(likes.menLikes + likes.womenLikes)*100).toFixed(0);
			var womenPer = 100 - menPer;
		}

		return (
			<div className="data-likes">
				<div className="title">{section}</div>
				<div className="data-like">
					<span className="data-label">M</span>
					<span className="data-value">{menPer + '%' + ' ('+ likes.menLikes +')'}</span>
				</div>
				<div className="data-like">
					<span className="data-label">F</span>
					<span className="data-value">{womenPer + '%' + ' ('+ likes.womenLikes +')'}</span>
				</div>
				<div className="cb"></div>
			</div>
		)
	}
});

const Data = React.createClass({
	getInitialState:function(){
		return ({
			session:this.props.session,
			_data:DataStore.getData()
		})
	},
	componentWillReceiveProps:function(nextProps){
		var card = nextProps.card;
		DataAPI.getCardData(card._id);
	},
	componentWillMount:function(){
		var card = this.props.card;
		DataStore.addChangeListener(this._onChange)
		DataAPI.getCardData(card._id);
	},
	componentWillUnmount:function(){
		DataStore.removeChangeListener(this._onChange)
	},
	_onChange:function(){
		this.setState({
			_data:DataStore.getData()
		})
	},
	render:function(){
		var _data = this.state._data;
		if(_data == null) return null;
		return (
			<div className="ab-data">
				<LikesData section="A" likes={_data.ALikes}/>
				<LikesData section="B" likes={_data.BLikes}/>
			</div>
		)
	}
});

module.exports = Data;