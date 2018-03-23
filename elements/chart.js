let addChart = async function(blockChart, orgSID) {
	let data = await fetchSizeHistory(orgSID);
	
	let newChart = drawChartLine(blockChart, data, orgSID);
	newChart.classList.add("chart");
	return blockChart;
};

let chartHolder = d3.select("#data-holder").node();

let drawChartLine = function (parent, data, orgSID) {
	//must set canvas size before building svg
	let margin = { top: 25, right: 160, bottom: 50, left: 50 };
	let width = parent.offsetWidth - margin.left - margin.right;
	let height = parent.offsetWidth/2.0 - margin.top - margin.bottom;
	let labelOffset = 70;

	//define accessor functions for retrieving line data
	let lineSize = d3.line()
		.x(d => x(d.DaysAgo))
		.y(d => y(d.Size));
	let lineMain = d3.line()
		.x(d => x(d.DaysAgo))
		.y(d => y(d.Main));
	let lineAffil = d3.line()
		.x(d => x(d.DaysAgo))
		.y(d => y(d.Affiliate));
	let lineHidden = d3.line()
		.x(d => x(d.DaysAgo))
		.y(d => y(d.Hidden));

	//build canvas
	let svg = d3.select(parent).append("svg")
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
	
	//add labels
    let squareSize = 20;
    let whitespace = 5;
    let heightOffset = function(d, i) {
            let spacing = squareSize + whitespace;
            let offset = (spacing * 4 - whitespace)/2;
            return height/2 + i*spacing - offset;
    };
	
	let labelsClass = ["line-size", "line-main", "line-affil", "line-hidden"];
	let getClass = (d, i) => "chart-label " + labelsClass[i];
	
	svg.selectAll("rect")
		.data(labelsClass)
		.enter()
		.append("rect")
		.attr("x", width + labelOffset)
		.attr("y", heightOffset)
		.attr("width", squareSize)
		.attr("height", squareSize)
		.attr("class", getClass);
	
	let labelsText = ["Size", "Main", "Affiliate", "Hidden"];
	//let fontSize = 
	svg.selectAll("text")
		.data(labelsText)
		.enter()
		.append("text")
		.attr("x", width + labelOffset + squareSize + whitespace)
		.attr("y", heightOffset)
		.attr("dy", 18)
		.text(d => d);
	
	//append group element to canvas and place at top left margin
	let g = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);
	
	//make x-axis daysAgo
	let x = d3.scaleLinear().range([width, 0]);
	x.domain(d3.extent(data, d => d.DaysAgo));
	//append x-axis daysAgo
	g.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(x));
	
	//make x-axis date
	let daysToDate = function(node) {
		let date = new Date();
		return date.setDate(date.getDate() - node.DaysAgo);
	};
	let xScaleDate = d3.scaleTime()
		.domain(d3.extent(data, daysToDate))
		.range([0, width]);
	let xAxisDate = d3.axisBottom(xScaleDate)
	.tickFormat(function(date) {
		if (d3.timeYear(date) < date) {
			return d3.timeFormat('%b')(date);
		} else {
			return d3.timeFormat('%Y')(date);
		}
	});
	//append x-axis date
	g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${height+20})`)
	.call(xAxisDate);
	
	//make y-axis size
	let y = d3.scaleLinear().range([height, 0]);
	let minPointY = d3.min(data, d => Math.min(d.Main, d.Affiliate, d.Hidden));
	let maxPointY = d3.max(data, d => d.Size);
	y.domain([minPointY, maxPointY]);
	//append y-axis size
	g.append("g")
		.call(d3.axisLeft(y))
		.attr("class", "y-axis")
	
	//label axes
	svg.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "1em")
		.text("Members");

	//append data line
	//SVG layers latest element on top of previous elements
	g.append("path")
		.attr("class", "line line-size")
		.attr("d", lineSize(data));
	g.append("path")
		.attr("class", "line line-main")
		.attr("d", lineMain(data));
	g.append("path")
		.attr("class", "line line-affil")
		.attr("d", lineAffil(data));
	g.append("path")
		.attr("class", "line line-hidden")
		.attr("d", lineHidden(data));
	
	//add title
	svg.append("text")
		.attr("x", width/2)
		.attr("y", 0)
		.attr("dy", "1em")
		.text("SID: " + orgSID);
	
	return svg.node();
};

let fetchSizeHistory = function(sid) {
	const err = new Error();
	return fetchGlobal(err, "/backEnd/org_history.php?SID=" + sid);
};


