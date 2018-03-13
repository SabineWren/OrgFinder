//import fetchSizeHistory form fetch.js

window.onload = () => init();

let addActivityImage = function(cell, activity){
	cell.classList.add(activity.toLowerCase().replace(' ', '-'));
	cell.innerHTML = "";
	cell.title = activity;
};

let addCell = function(cellType, text) {
	let cell = document.createElement("div");
	cell.innerHTML = text;
	
	switch(cellType) {
		case COLUMNS.ARCHETYPE:
			cell.classList.add("archetype");
			break;
		case COLUMNS.COMMITMENT:
			cell.classList.add("commitment");
			break;
		case COLUMNS.FOCUSES:
			cell.classList.add("focuses-header");
			break;
		case COLUMNS.FOCUS_PRIMARY:
			cell.classList.add("focus-primary");
			addActivityImage(cell, text);
			break;
		case COLUMNS.FOCUS_SECONDARY:
			cell.classList.add("focus-secondary");
			addActivityImage(cell, text);
			break;
		case COLUMNS.GROWTH:
			cell.classList.add("growth");
			break;
		case COLUMNS.LANGUAGE:
			cell.classList.add("language");
			break;
		case COLUMNS.MAIN:
			cell.classList.add("main");
			break;
		case COLUMNS.NAME:
			cell.classList.add("name");
			break;
		case COLUMNS.SIZE:
			cell.classList.add("size");
			break;
		case COLUMNS.SID:
			cell.classList.add("sid");
			break;
	}
	
	this.appendChild(cell);
	return this;
};

let addChart = async function(chartContainer, orgSID) {
	let response = await fetchSizeHistory(orgSID);
	let data = await parseResponse(response);
	
	let newChart = drawChartLine(chartContainer, data, orgSID);
	newChart.classList.add("chart");
	return chartContainer;
};

let addListing = async function(name, id) {
	let tab = createTab(name, id);
	document.getElementById("tab-holder-results").appendChild(tab);
	
	let listingContainer = createDataContainer(id, DATA_TYPES.LISTING);
	document.getElementById("data-holder").appendChild(listingContainer);
	
	let response = await fetchOrgsListing();
	let data = await parseResponse(response);
	
	let table = document.createElement("div");
	table.classList.add("table");
	loadList(table, data);
	listingContainer.appendChild(table);
};

let addRow = function(data) {
	let row = document.createElement("div");
	row.classList.add("row");
	row.addCell = addCell;
	
	row
		.addCell(COLUMNS.SID, data.SID)
		.addCell(COLUMNS.ARCHETYPE, data.Archetype)
		.addCell(COLUMNS.FOCUS_PRIMARY, data.PrimaryFocus)
		.addCell(COLUMNS.FOCUS_SECONDARY, data.SecondaryFocus)
		.addCell(COLUMNS.COMMITMENT, data.Commitment)
		.addCell(COLUMNS.LANGUAGE, data.Language)
		.addCell(COLUMNS.NAME, data.Name)
		.addCell(COLUMNS.SIZE, data.Size)
		.addCell(COLUMNS.MAIN, data.Main)
		.addCell(COLUMNS.GROWTH, data.GrowthRate);
	
	this.appendChild(row);
};

let addDetails = async function (orgSID, orgName) {
	let tab = createTab(orgName, orgSID);
	document.getElementById("tab-holder-data").appendChild(tab);
	
	let dataHolder = document.getElementById("data-holder");
	
	let chartContainer = createDataContainer(orgSID, DATA_TYPES.CHART);
	dataHolder.appendChild(chartContainer);
	//the container MUST first be loaded in the DOM for its size to be non-zero
	addChart(chartContainer, orgSID);
	
	let detailsContainer = createDataContainer(orgSID, DATA_TYPES.DETAILS);
	dataHolder.appendChild(detailsContainer);
	
	let onClick = onClickCloseFactory(tab, [chartContainer, detailsContainer]);
	
	let iconCloseChart = createCloseIcon(onClick);
	let iconCloseDetails = createCloseIcon(onClick);
	let iconCloseTab = createCloseIcon(onClick);
	
	chartContainer.appendChild(iconCloseChart);
	detailsContainer.appendChild(iconCloseDetails);
	tab.appendChild(iconCloseTab);
};

let createDataContainer = function(id, type) {
	switch(type){
		case DATA_TYPES.CHART:
			id = "chart-" + id;
			break;
		case DATA_TYPES.DETAILS:
			id = "details-" + id;
			break;
		case DATA_TYPES.LISTING:
			id = "listing-" + id;
			break;
	}
	
	let dataContainer = document.createElement("div");
	dataContainer.classList.add("data-container");
	dataContainer.id = id;
	return dataContainer;
};

let createCloseIcon = function(onClick) {
	let closeIcon = document.createElement("div");
	closeIcon.classList.add("close-icon");
	closeIcon.onclick = onClick;
	closeIcon.innerHTML = "X";
	return closeIcon;
}

let createTab = function(name, id) {
	let newTab = document.createElement("div");
	newTab.classList.add("tab");
	newTab.id = "tab-" + id;
	newTab.innerHTML = name;
	return newTab;
};

let init = function () {
	addListing("Default Listing", "DEFAULT_ID");
	addDetails("LAWBINDERS","LAWBINDERS");
	addDetails("00000000", "ENEMY CONTACT");
	addDetails("HHCORP", "Horizons Hunters");
	addDetails("AOTW", "Angels of the Warp");
	addDetails("POI", "Person Of Interest");
	addDetails("TFTO", "The First Order");
	addDetails("PROT", "Protectors of Verum");
	addDetails("AMFR", "AMFR");
};

let loadList = function(resultsContainer, data) {
	resultsContainer.addRow = addRow;
	resultsContainer.appendChild(makeTitleRow());
	data.forEach(dataRow => resultsContainer.addRow(dataRow));
};

let makeTitleRow = function (){
	let row = document.createElement("div");
	row.classList.add("row");
	row.addCell = addCell;
	
	row
		.addCell(COLUMNS.SID, "SID")
		.addCell(COLUMNS.ARCHETYPE, "Archetype")
		.addCell(COLUMNS.FOCUSES, "Focuses")
		.addCell(COLUMNS.COMMITMENT, "Commitment")
		.addCell(COLUMNS.LANGUAGE, "Language")
		.addCell(COLUMNS.NAME, "Name")
		.addCell(COLUMNS.SIZE, "Size")
		.addCell(COLUMNS.MAIN, "Main")
		.addCell(COLUMNS.GROWTH, "Weekly Growth");
	
	return row;
};

let onClickCloseFactory = function(tab, elements) {
	let aliveIds = elements.map(e => e.id);
	
	let getNewAliveIds = function(kill) {
		if(kill.id === tab.id) { return []; }
		
		return aliveIds.filter(alive => alive !== kill.id);
	};
	
	return function(event) {
		aliveIds = getNewAliveIds(event.target.parentElement);
		
		elements
			.filter(e => !aliveIds.includes(e.id))
			.forEach(e => e.remove());
		
		if(aliveIds.length === 0) { tab.remove(); }
	};
};

