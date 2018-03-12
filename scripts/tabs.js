//import fetchSizeHistory form fetch.js

window.onload = () => init();

let DATA_TYPES = Object.freeze({
	CHART: 1,
	DETAILS: 2,
	LISTING: 3
});

let COLUMNS = Object.freeze({
	COMMITMENT: 4,
	GROWTH: 8,
	NAME: 5,
	SID: 1,
	SIZE: 6,
});

let addCell = function(col, line1, line2) {
	let cell = document.createElement("div");
	cell.classList.add("cell");
	
	if(line2 !== undefined) {
		line1 += "<br>" + "<span style='color: var(--colour-table-secondary)'>" + line2 + "</span>";
	}
	cell.innerHTML = line1;
	
	switch(col) {
		case COLUMNS.COMMITMENT:
			cell.classList.add("cell-commitment");
			break;
		case COLUMNS.GROWTH:
		case COLUMNS.SIZE:
			cell.classList.add("cell-size");
			break;
		case COLUMNS.SID:
			cell.classList.add("cell-sid");
			break;
	}
	
	this.appendChild(cell);
	return this;
};

let addCellImage = function(activity) {
	let cell = document.createElement("div");
	cell.classList.add(activity.toLowerCase().replace(' ', '-'));
	cell.classList.add("cell", "cell-image");
	cell.title = activity;
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
	row.addCellImage = addCellImage;
	
	row
		.addCell(COLUMNS.SID, data.SID, data.Archetype)
		.addCellImage(data.PrimaryFocus)
		.addCellImage(data.SecondaryFocus)
		.addCell(COLUMNS.COMMITMENT, data.Commitment, data.Language)
		.addCell(COLUMNS.NAME, data.Name)
		.addCell(COLUMNS.SIZE,data.Size, data.Main)
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
	
	headers = {
		Archetype: "Archetype",
		Commitment: "Commitment",
		GrowthRate: "Growth",
		Language: "Language",
		Main: "Main",
		Name: "Name",
		SID: "SID",
		Size: "Size",
	};
	
	let row = document.createElement("div");
	row.classList.add("row");
	row.addCell = addCell;
	
	row.addCell(COLUMNS.SID, headers.SID, headers.Archetype);
	
	let focuses = document.createElement("cell");
	focuses.innerHTML = "Focuses";
	focuses.classList.add("focuses-header", "cell");
	row.appendChild(focuses);
	
	row
		.addCell(COLUMNS.COMMITMENT, headers.Commitment, headers.Language)
		.addCell(COLUMNS.NAME, headers.Name)
		.addCell(COLUMNS.SIZE, headers.Size, headers.Main)
		.addCell(COLUMNS.GROWTH, headers.GrowthRate);
	
	resultsContainer.appendChild(row);
	data.forEach(dataRow => resultsContainer.addRow(dataRow));
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

