import React from "react";
import { findDOMNode } from "react-dom";

import BarChart from './BarChart';
import GeneralLikePieGraph from './GeneralLikePieGraph';

export default class Chart extends React.Component {
	constructor(props){
		super(props);
		this.chartToClassMappings = {
			BarChart:BarChart,
			GeneralLikePieGraph:GeneralLikePieGraph
		};
	}

	componentDidMount(){
		if( Object.keys(this.props.data).length === 0 ){
			return;
		}
		const el = findDOMNode(this);
		this.chart = new this.chartToClassMappings[this.props.name](el);
		this.chart.create(this.props.data);
	}

	componentDidUpdate(){
		this.chart.update(this.props.data);
	}
	componentWillUnmount(){
		this.chart.unmount();
	}
	render(){
		return(
			<div className="chart"></div>
		)
	}
}