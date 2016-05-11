import React from 'react';

import DataStore from '../../Store/DataStore';
import DataAPI from '../../API/DataAPI';
import DataAction from '../../Action/DataAction';

const LikesData = React.createClass({
	render:function(){
		var section = this.props.section;
		var data = this.props.data;

		return (
			<div className="data-likes">
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
				<div className="title">DATA</div>
				<LikesData section="A" data={_data.A}/>
				<LikesData section="B" data={_data.B}/>
			</div>
		)
	}
});

module.exports = Data;