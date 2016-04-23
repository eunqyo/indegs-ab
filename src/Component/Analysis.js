import React from 'react';
import d3 from 'd3';

import AnAPI from '../API/AnAPI';
import AnStore from '../Store/AnStore';
import AnAction from '../Action/AnAction';

// import Chart from './Chart/Chart';
import GeneralLikeGraph from './Chart/GeneralLikeGraph';

// class General extends React.Component {

// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			data: [3,5,11,5]
// 		};
// 	}

// 	componentDidMount(){
// 		setTimeout(()=>{
// 			this.setState({
// 				data: [3,10,31,13]
// 			})
// 		},2000)
// 	}
// 	render(){
// 		return (
// 			<div>
// 				<div></div>
// 				<Chart
// 					name={"BarChart"}
// 					data={this.state.data} />
// 			</div>
// 		);
// 	}
// }


const LikeGraph = React.createClass({
	render:function(){
		<div id="like-graph"></div>
	}
});

const LikeInfo = React.createClass({
	render:function(){
		var year = (new Date()).getFullYear();
		var age = 0;
		var male = 0;
		var female = 0;
		var count = 0;
		var like = this.props.like;
		for(var i=0;i<like.length;i++){
			var author = like[i].author;
			if(author.sex==0){
				male ++;
			} else {
				female ++;
			}
			count ++;
			age += year-author.age;
		}

		return (
			<div className="like-an">
				<div className="title">Version A Information</div>
				<div className="ave-age">{(age/count).toFixed(1) + 'years old'}</div>
				<div className="ave-sex">{(female/(female+male)).toFixed(1)*100 + '%'}</div>
			</div>
		)
	}
})

const GeneralInfo = React.createClass({
	render:function(){
		var analysis = this.props.analysis;
		var ACount = analysis.A.like.length;
		var BCount = analysis.B.like.length;
		var totalCount = ACount + BCount;
		var APer = (ACount/totalCount * 100).toFixed(1);
		var BPer = 100 - APer;
		var chartData = {
			ACount:ACount,
			BCount:BCount,
			totalCount:totalCount
		}
		return (
			<div className="section">
				<div className="section-title">General</div>
				<div className="data-holder">
					<div className="data">
						<div className="data-count">{totalCount}</div>
						<div className="data-title">Likes total</div>
					</div>
					<div className="data">
						<div className="data-count">{ACount}</div>
						<div className="data-title">A likes</div>
					</div>
					<div className="data">
						<div className="data-count">{BCount}</div>
						<div className="data-title">B likes</div>
					</div>
					<div className="cb"></div>
				</div>
				<GeneralLikeGraph data={this.props.generalLike}/>
			</div>
		)
	}
})


const Analysis = React.createClass({
	getInitialState:function(){
		return ({
			analysis:AnStore.getAnalysis(),
			generalLike:AnStore.getGeneralLike()
		})
	},
	componentDidMount:function(){
		AnStore.addChangeListener(this._onChange);
		var card_id = this.props.params.card_id;
		AnAPI.getAnalysis(card_id);
	},
	componentWillUnmount:function(){
		AnStore.removeChangeListener(this._onChange);
		AnAction.updateAnalysis(null)
	},
	_onChange:function(){
		this.setState({
			analysis:AnStore.getAnalysis(),
			generalLike:AnStore.getGeneralLike()
		})
	},
	render:function(){
		var analysis = this.state.analysis;
		var generalLike = this.state.generalLike;
		if(analysis==null) return null;
		if(generalLike==null) return null;

		return (
			<div id="an">
				<div className="c1190">
					<GeneralInfo analysis={analysis} generalLike={generalLike} />
					<LikeInfo like={analysis.A.like} />
					<LikeInfo like={analysis.B.like} />
				</div>
			</div>
		)
	}
})



module.exports = Analysis;