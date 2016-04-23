import d3 from 'd3';
import React from "react";
import { findDOMNode } from "react-dom";

import Util from '../../Util/Util'
const Chart = React.createClass({
	create:function(data,scale){
		var el = this.el;
		d3.select(el).selectAll("div.cell")
			.data(data)
			.enter()
			.append("div").classed("cell",true);
		d3.select(el).selectAll("div.cell")
			.data(data)
			.exit().remove();
		d3.select(el).selectAll("div.cell")
			.data(data)
			.style("margin-left", function(d){
	            return scale(new Date(d.date)) + "px";
	        })
			.html(function(d){
				return Util.getParsedDate(d.date) + ' ' + d.section;
			})
	},
	componentDidMount:function(){
		this.el = findDOMNode(this);
		var data = this.props.data;
		var start = new Date(2016, 3, 25),
			end = new Date(),
			range = [0, 200],
			time = d3.time.scale().domain([start, end])
			.rangeRound(range)
		this.create(data,time)
	},
	componentWillUnmount:function(){
		this.el.remove()
	},
	render:function(){
		return (
			<div id="general-like-graph"></div>
		)
	}
})

// export default class GeneralLikePieGraph extends React.Component {
// 	constructor(props){
// 		super(props);
// 		this.chartToClassMappings = {
// 			BarChart:BarChart,
// 			GeneralLikePieGraph:GeneralLikePieGraph
// 		};
// 	}

// 	componentDidMount(){
// 		if( Object.keys(this.props.data).length === 0 ){
// 			return;
// 		}
// 		const el = findDOMNode(this);
// 		this.chart = new this.chartToClassMappings[this.props.name](el);
// 		this.chart.create(this.props.data);
// 	}

// 	componentDidUpdate(){
// 		this.chart.update(this.props.data);
// 	}
// 	componentWillUnmount(){
// 		this.chart.unmount();
// 	}
// 	render(){
// 		return(
// 			<div className="chart"></div>
// 		)
// 	}
// }

module.exports = Chart;







