import React from 'react';
import { Link } from 'react-router';
import UserStore from '../../Store/UserStore';
import UserAction from '../../Action/UserAction';
import Util from '../../Util/Util';
import Dates from '../../Util/Dates';



const CommentBox = React.createClass({
	render:function(){
		var comment = this.props.comment;
		return (
			<div className="comment-box">
				<span className="comment" dangerouslySetInnerHTML = {{__html:comment}}></span>
			</div>
		)
	}
})
const Comment = React.createClass({
	getInitialState:function(){
		return ({
			date:null
		})
	},
	componentDidMount:function(){
		var item = this.props.item;
		var date = Dates.getDateString(item.date);
		this.setState({
			date:date
		})
	},
	render:function(){
		var item = this.props.item;
		var user = this.props.user;
		var date = this.state.date;
		return (
			<div className="activity-item">
				<div className="activity-item-body">
					<span className="a-username">{'@'+user.name}</span>
					<span>{item.category}</span>
					<span>on</span>
					<span className="a-section">{'#'+item.card_section}</span>
					<span>of</span>
					<Link to={'/cards/'+item.card_id}>
						<span className="a-card">{item.card_title}</span>
					</Link>
					<div className="a-dot"></div>
					<span className="a-date">{date}</span>
				</div>
				<CommentBox comment={item.comment}/>
				<div className="cb"></div>
			</div>
		)
	}
});

const Publish = React.createClass({
	getInitialState:function(){
		return ({
			date:null
		})
	},
	componentDidMount:function(){
		var item = this.props.item;
		var date = Dates.getDateString(item.date);
		this.setState({
			date:date
		})
	},
	render:function(){
		var item = this.props.item;
		var user = this.props.user;
		var date = this.state.date;
		return (
			<div className="activity-item">
				<div className="activity-item-body">
					<span className="a-username">{'@'+user.name}</span>
					<span>{item.category}</span>
					<Link to={'/cards/'+item.card_id}>
						<span className="a-card">{item.card_title}</span>
					</Link>
					<div className="a-dot"></div>
					<span className="a-date">{date}</span>
				</div>
			</div>
		)
	}
});

const Participate = React.createClass({
	getInitialState:function(){
		return ({
			date:null
		})
	},
	componentDidMount:function(){
		var item = this.props.item;
		var date = Dates.getDateString(item.date);
		this.setState({
			date:date
		})
	},
	render:function(){
		var item = this.props.item;
		var user = this.props.user;
		var date = this.state.date;
		return (
			<div className="activity-item">
				<div className="activity-item-body">
					<span className="a-username">{'@'+user.name}</span>
					<span>liked</span>
					<span className="a-section">{'#'+item.card_section}</span>
					<span>of</span>
					<Link to={'/cards/'+item.card_id}>
						<span className="a-card">{item.card_title}</span>
					</Link>
					<div className="a-dot"></div>
					<span className="a-date">{date}</span>
				</div>
			</div>
		)
	}
})

const Activity = React.createClass({
	getInitialState:function(){
		return({
			activity:UserStore.getActivity()
		})
	},
	componentDidMount:function(){
		this.getActivityList()
		UserStore.addChangeListener(this._onChange);
	},
	componentWillUnmount:function(){
		UserStore.removeChangeListener(this._onChange);
	},
	_onChange:function(){
		var self = this;
		this.setState({
			activity:UserStore.getActivity()
		},function(){
			self.getActivityList()
		})
	},
	getActivityList:function(){
		var activity = this.state.activity;
		if(activity==null) return null;
		var comment = activity.commented;
		var participated = activity.participated;
		var published = activity.published;
		var data = [];
		if(comment != null){
			for(var i=0;i<comment.length;i++){
				comment[i].category = 'commented'
				data.push(comment[i])
			}
		}
		if(participated != null){
			for(var i=0;i<participated.length;i++){
				participated[i].category = 'participated'
				data.push(participated[i])
			}
		}
		if(published != null){
			for(var i=0;i<published.length;i++){
				published[i].category = 'published'
				data.push(published[i])
			}
		}
		var _activity = data.sort(Util.sortByDate);
		this.setState({
			_activity:_activity
		})
	},
	pushDatatoArray:function(section,section_name){
		var data = [];
		if(section == null) return null;
		for(var i=0;i<section.length;i++){
			data.push({
				category:section_name,
				data:section[i]
			})
		}
		return data;
	},
	render:function(){
		var user = this.props.user;
		var activity = this.state.activity;
		var _activity = this.state._activity;
		if(_activity == null) return null;
		var body = _activity.map(function(item){
			if(item.category == 'participated'){
				return <Participate item={item} key={item._id} user={user} />
			} else if(item.category == 'published'){
				return <Publish item={item} key={item._id} user={user} />
			} else {
				return <Comment item={item} key={item._id} user={user} />
			}
		})

		return (
			<div id="user-activity">
				<div id="title">ACTIVITIES</div>
				{body}
			</div>
		)
	}
});



module.exports = Activity;