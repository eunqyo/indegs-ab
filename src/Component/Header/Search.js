import React from 'react';
import { Link } from 'react-router';
import SearchAPI from '../../API/SearchAPI';
import SearchStore from '../../Store/SearchStore';


const ResultItem = React.createClass({
	handleClick:function(){
		this.props.toggle()
	},
	render:function(){
		var card = this.props.card;
		return (
			<Link to={'/cards/'+card._id} onClick={this.handleClick}>
				<div className="item">
					{card.title}
				</div>
			</Link>
		)
	}
})

const SearchResult = React.createClass({
	render:function(){
		var _card = this.props._card;
		var item = _card.map(function(card){
			return <ResultItem key={card._id} card={card}/>
		})
		return (
			<div id="search-result" className="modal">
				{item}
			</div>
		)
	}
})

const SearchInput = React.createClass({
	handleChange:function(e){
		var value = e.target.value;
		if(value == null || value == '') return null;
		SearchAPI.search(value)
	},
	handleEnter:function(e){
		if(e.which == 13){
			// $(e.target).blur()
		}
	},
	render:function(){
		return (
			<input type="text" placeholder="Search indegs" onBlur={this.goSearch} onChange={this.handleChange} onKeyPress={this.handleEnter}/>
		)
	}
})

const Search = React.createClass({
	getInitialState:function(){
		return ({
			_card:SearchStore.getSearchResult(),
			toggle:true
		})
	},
	componentDidMount:function(){
		SearchStore.addChangeListener(this._onChange);
	},
	componentWillUnmount:function(){
		SearchStore.removeChangeListener(this._onChange);
	},
	_onChange:function(){
		this.setState({
			_card:SearchStore.getSearchResult()
		})
	},
	toggleResult:function(){
		var toggle = this.state.toggle;
		this.setState({
			toggle:!toggle
		})
	},
	render:function(){
		var _card = this.state._card;
		var toggle = this.state.toggle;
		var result;
		if(_card.length == 0 || !toggle) result = null;
		else result = <SearchResult _card={_card} toggle={this.toggleResult}/>
		return (
			<div id="search">
				<SearchInput />
				{result}
			</div>
		)
	}
});

module.exports = Search;