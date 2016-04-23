import d3 from 'd3';

export default class BarChart {
	constructor(el){
		this.el = el;
	}
	create(data) {
		var el = this.el;
		var height = 500,
			width = 500,
			margin = 25,
			xAxis,yAxis
		var xAxisLength = width - 2 * margin;
					var scale = d3.scale.linear()
				.domain([0,100])
				.range([0,xAxisLength]);
			var xAxis = d3.svg.axis()
				.scale(scale)
				.tickSubdivide(1)
				.orient("bottom");

		var svg = d3.select(el).append("svg")
			.attr("class","axis")
			.attr("width",width)
			.attr("height",height);

		function renderXAxis(){
			svg.append("g")
				.attr("class","x-axis")
				.attr("transform",function(){
					return "translate("+margin+","+(height-margin)+")"
				})
				.call(xAxis);
		}

		function rescale(){
			var max = Math.round(Math.random()*100);
			xAxis.scale().domain([0,max]);
			svg.select("g.x-axis")
				.transition()
				.call(xAxis);
			renderXGridlines();
		}

		function renderXGridlines(){
			var lines = d3.selectAll("g.x-axis g.tick")
				.select("line.grid-line")
				.remove();
			lines = d3.selectAll("g.x-axis g.tick")
				.append("line")
				.classed("grid-line",true);
			lines.attr("x1",0)
				.attr("y1",0)
				.attr("x1",0)
				.attr("y2",-xAxisLength)
		}
		renderXAxis()
		renderXGridlines()
		setInterval(function(){
			rescale()
		},1000)
	}
	update(){

	}
	unmount(){
		this.el.remove()
	}
}




// var width = 960,
//     height = 500,
//     radius = Math.min(width, height) / 2;

// var color = d3.scale.ordinal()
//     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// var arc = d3.svg.arc()
//     .outerRadius(radius - 10)
//     .innerRadius(0);

// var labelArc = d3.svg.arc()
//     .outerRadius(radius - 40)
//     .innerRadius(radius - 40);

// var pie = d3.layout.pie()
//     .sort(null)
//     .value(function(d) { return d.population; });

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//   .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// d3.csv("data.csv", type, function(error, data) {
//   if (error) throw error;

//   var g = svg.selectAll(".arc")
//       .data(pie(data))
//     .enter().append("g")
//       .attr("class", "arc");

//   g.append("path")
//       .attr("d", arc)
//       .style("fill", function(d) { return color(d.data.age); });

//   g.append("text")
//       .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
//       .attr("dy", ".35em")
//       .text(function(d) { return d.data.age; });
// });

// function type(d) {
//   d.population = +d.population;
//   return d;
// }






