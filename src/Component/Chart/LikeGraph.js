import d3 from 'd3';
import React from "react";
import { findDOMNode } from "react-dom";

import Util from '../../Util/Util'
const Chart = React.createClass({
	getInitialState:function(){
		return ({
			data:this.props.data,
			width:460,
			height:120
			
		})
	},
	componentDidMount:function(){
		var self = this;
		var width = this.state.width;
		var height = this.state.height;
		var data = this.state.data;
		var el = this.el = findDOMNode(this);
		var highestScore = d3.max(data, function(d) { 
			return d.score+1; 
		})
		var sorted = data.sort(self.sortByDate);
		// var start = new Date(sorted[0].date);
		var start = new Date();
		start.setDate(start.getDate()-1);
		var end = new Date();
		end.setDate(end.getDate()+1);

		this.scaleX = d3.time.scale()
			.domain([start,end])
			.range([0,width]);
		this.scaleY = d3.scale.linear()
			.domain([0,highestScore])
			.rangeRound([height,0]);

		this.svg = d3.select(el)
			.append("svg")
				.attr("width",width)
				.attr("height",height);
		this.renderAxes(this.svg)
		this.renderLine(this.svg)
		this.renderDots(this.svg)
	},
	componentWillUnmount:function(){
		this.el.remove()
	},
	renderDots:function(svg){
		var scaleX = this.scaleX;
		var scaleY = this.scaleY;
		var data = this.state.data;
		svg.append("g").selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","dot")
			.attr("cx",function(d){
				return scaleX(new Date(d.date))
			})
			.attr("cy",function(d){
				return scaleY(d.score)
			})
			.attr("r","3")


	},
	renderAxes:function(svg){
		var self = this;
		var width = this.state.width;
		var height = this.state.height;
		var xAxis = d3.svg.axis().scale(self.scaleX)
			.orient("bottom").ticks(5);
		var yAxis = d3.svg.axis().scale(self.scaleY)
			.orient("left").ticks(5);
		// svg.append("g")
		// 	.attr("class", "x axis")
		// 	.attr("transform","translate(0," + height + ")")
		// .call(xAxis);
		// svg.append("g")
		// 	.attr("class", "y axis")
		// .call(yAxis);
	},
	renderLine:function(svg){
		var data = this.state.data;
		var scaleX = this.scaleX;
		var scaleY = this.scaleY;
		var drawline = d3.svg.line()
			.interpolate("basis")
			.x(function(d){return scaleX(new Date(d.date));})
			.y(function(d){return scaleY(d.score);});

		svg.selectAll("path.line")
			.data(data)
			.enter()
			.append("path")
			.attr("class","line");
		svg.selectAll("path.line")
			.data(data)
			.attr("d",drawline(data));
	},
	sortByDate:function(a,b){
		if(a.date < b.date){return -1;}
		if(a.date > b.date){return 1;}
		return 0;
	},
	render:function(){
		return (
			<div id="like-graph"></div>
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







