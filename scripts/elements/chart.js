/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { CreateChart, ResizeHeight };
import * as _fetch from "../fetch.js";

const blockHolder = document.getElementById("block-holder");
const chartHolder = d3.select("#data-holder").node();
const ROW_HEIGHT = parseInt(getComputedStyle(document.body).getPropertyValue("--grid-row-height"));

const CreateChart = async function(orgSID) {
	const data = await fetchSizeHistory(orgSID).catch(_fetch.Warning);
	
	const newChart = drawChartLine(data, orgSID);
	newChart.classList.add("chart-content");
	return newChart;
};

const drawChartLine = function (data, orgSID) {
	const colWidth = window.innerWidth / blockHolder.style.getPropertyValue("--num-cols");
	
	const margin = Object.freeze({ top: 25, right: 160, bottom: 50, left: 50 });
	const width = colWidth - margin.left - margin.right;
	const svgHeightPixels = blockHolder.style.getPropertyValue("--size-height-chart") * ROW_HEIGHT;
	const height = svgHeightPixels - margin.top - margin.bottom;
	const labelOffset = 70;

	//define accessor functions for retrieving line data
	const lineSize = d3.line()
		.x(d => x(d.DaysAgo))
		.y(d => y(d.Size));
	const lineMain = d3.line()
		.x(d => x(d.DaysAgo))
		.y(d => y(d.Main));
	const lineAffil = d3.line()
		.x(d => x(d.DaysAgo))
		.y(d => y(d.Affiliate));
	const lineHidden = d3.line()
		.x(d => x(d.DaysAgo))
		.y(d => y(d.Hidden));

	//build canvas
	//how does this append even work? TODO figure it out
	const svg = d3.select(blockHolder).append("svg")
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
	
	//add labels
    const squareSize = 20;
    const whitespace = 5;
    const heightOffset = function(d, i) {
            const spacing = squareSize + whitespace;
            const offset = (spacing * 4 - whitespace)/2;
            return height/2 + i*spacing - offset;
    };
	
	const labelsClass = Object.freeze(["line-size", "line-main", "line-affil", "line-hidden"]);
	const getClass = (d, i) => "chart-label " + labelsClass[i];
	
	svg.selectAll("rect")
		.data(labelsClass)
		.enter()
		.append("rect")
		.attr("x", width + labelOffset)
		.attr("y", heightOffset)
		.attr("width", squareSize)
		.attr("height", squareSize)
		.attr("class", getClass);
	
	const labelsText = Object.freeze(["Size", "Main", "Affiliate", "Hidden"]);
	//fontsize will go here if needed (select from css variable)
	svg.selectAll("text")
		.data(labelsText)
		.enter()
		.append("text")
		.attr("x", width + labelOffset + squareSize + whitespace)
		.attr("y", heightOffset)
		.attr("dy", 18)
		.text(d => d);
	
	//append group element to canvas and place at top left margin
	const g = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);
	
	//make x-axis daysAgo
	const x = d3.scaleLinear().range([width, 0]);
	x.domain(d3.extent(data, d => d.DaysAgo));
	//append x-axis daysAgo
	g.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(x));
	
	//make x-axis date
	const daysToDate = function(node) {
		const date = Object.freeze(new Date());
		return date.setDate(date.getDate() - node.DaysAgo);
	};
	const xScaleDate = d3.scaleTime()
		.domain(d3.extent(data, daysToDate))
		.range([0, width]);
	const xAxisDate = d3.axisBottom(xScaleDate)
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
	const y = d3.scaleLinear().range([height, 0]);
	const minPointY = d3.min(data, d => Math.min(d.Main, d.Affiliate, d.Hidden));
	const maxPointY = d3.max(data, d => d.Size);
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

const fetchSizeHistory = function(sid) {
	const err = new Error();
	return _fetch.Fetch(err, "/OrgFinder/backEnd/org_history.php?SID=" + sid);
};

const ResizeHeight = function() {
	const blockStyle = getComputedStyle(blockHolder);
	const colWidth = window.innerWidth / parseInt(blockStyle.getPropertyValue("--num-cols"));
	const svgHeightPixels = colWidth / 2.0;
	blockHolder.style.setProperty(
		"--size-height-chart",
		Math.floor(svgHeightPixels / ROW_HEIGHT)
	);
};

