/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import * as _chart       from "./elements/chart.js";
import * as _close       from "./elements/closeIcon.js";
import * as _details     from "./elements/details.js";
import * as _enums       from "./enums.js";
import * as _fetch       from "./fetch.js";
import * as _ls          from "./elements/ls.js";
import * as _multiselect from "./elements/multiselect.js";
import * as _tab         from "./elements/tab.js";

window.onload = () => init();

const addControls = function() {
	const holder = document.getElementById("controls-holder");
	[
		_multiselect.Create("Activities", _enums.Activities),
		_multiselect.Create("Archetype",  _enums.Archetype),
		_multiselect.Create("Commitment", _enums.Commitment),
		_multiselect.Create("Languages",  _enums.Language),
		_multiselect.Create("Roleplay",   _enums.Roleplay),
		_multiselect.Create("Recruiting", _enums.Recruiting)
	].forEach(e => holder.appendChild(e) );
	
	const runButton = document.createElement("DIV");
	runButton.id = "run";
	runButton.innerHTML = "Go";
	holder.appendChild(runButton);
};

const addListing = async function(name, id) {
	const blockListing = createBlock(id, _enums.BLOCKS.LISTING);
	document.getElementById("block-holder").appendChild(blockListing);
	
	const iconCloseListing = _close.Create(_close.OnclickFactory());
	blockListing.appendChild(iconCloseListing);
	
	_ls.QueryListingTable()
		.then(table => blockListing.appendChild(table))
		.then(() => _ls.ResizeHeight())
		.catch(_fetch.Warning);
};

const addOrg = async function (orgSID, orgName) {
	const tab = _tab.Create(orgName, orgSID);
	document.getElementById("tab-holder").appendChild(tab);
	
	const blockHolder = document.getElementById("block-holder");
	
	const blockChart = createBlock(orgSID, _enums.BLOCKS.CHART);
	blockHolder.appendChild(blockChart);
	_chart.CreateChart(orgSID)
		.then(chart => blockChart.appendChild(chart))
		.catch(_fetch.Warning);
	
	//the container MUST first be loaded in the DOM for its size to be non-zero
	const blockDetails = createBlock(orgSID, _enums.BLOCKS.DETAILS);
	blockHolder.appendChild(blockDetails);
	_details.AddDetails(blockDetails, orgSID)
	
	
	const onclick = _close.OnclickFactory(tab, [blockChart, blockDetails]);
	blockChart.appendChild(_close.Create(onclick));
	blockDetails.appendChild(_close.Create(onclick));
	tab.appendChild(_close.Create(onclick));
};

const createBlock = function(id, type) {
	const block = document.createElement("div");
	block.classList.add("block");
	
	switch(type){
		case _enums.BLOCKS.CHART:
			id = "chart-" + id;
			block.classList.add("chart");
			break;
		case _enums.BLOCKS.DETAILS:
			id = "details-" + id;
			block.classList.add("details");
			break;
		case _enums.BLOCKS.LISTING:
			id = "listing-" + id;
			block.classList.add("listing");
			_ls.RedefineGrid();//ensure new block conforms to current col size
			break;
	}
	
	block.id = id;
	return block;
};

const init = async function () {
	window.addEventListener('resize', resizePage);
	
	addControls();
	
	addListing("Default Listing", "DEFAULT_ID");
	addOrg("LAWBINDERS","LAWBINDERS");
	addOrg("00000000", "ENEMY CONTACT");
	addOrg("HHCORP", "Horizons Hunters");
	addOrg("AOTW", "Angels of the Warp");
	addOrg("POI", "Person Of Interest");
	addOrg("TFTO", "The First Order");
	addOrg("PROT", "Protectors of Verum");
	addOrg("AMFR", "AMFR");
	
	resizePage();
};

const resizeCallbacks = function() {
	_ls.RedefineGrid();
	_chart.ResizeHeight();
	Array.prototype.forEach.call(
		document.getElementsByClassName("details-content"),
		_details.Resize
	);
};

//strangely, this fires twice on initial load
//more strangely, it actually needs to fire twice on page load, so let it!
const resizePage = function(event){
    window.requestAnimationFrame(resizeCallbacks);
};

