//import fetchSizeHistory form fetch.js

window.onload = () => init();

let addCell = function(text) {
	let td = document.createElement("td");
	td.innerHTML = text;
	this.appendChild(td);
	return this;
};

let addChart = async function(chartContainer, orgSID) {
	let response = await fetchSizeHistory(orgSID);
	let data = await parseResponse(response);
	
	let newChart = drawChartLine(chartContainer, data, orgSID);
	newChart.classList.add("chart");
	return chartContainer;
};

let addResults = async function() {
	let tab = createTab("Default Listing", "DEFAULT_ID");
	document.getElementById("tab-holder-results").appendChild(tab);
	
	let resultsContainer = createResultsContainer();
	document.getElementById("chart-holder").appendChild(resultsContainer);
	
	let response = await fetchOrgsListing();
	let data = await parseResponse(response);
	
	loadList(resultsContainer, data);
};

let addRow = function(data) {
	let row = document.createElement("tr");
	row.addCell = addCell;
	
	row.addCell(data.Archetype)
		.addCell(data.Commitment)
		.addCell(data.GrowthRate)
		.addCell(data.Language)
		.addCell(data.Main)
		.addCell(data.Name)
		.addCell(data.PrimaryFocus)
		.addCell(data.SID)
		.addCell(data.SecondaryFocus)
		.addCell(data.Size);
	
	this.appendChild(row);
};

let addDetails = async function (orgSID, orgName) {
	let tab = createTab(orgName, orgSID);
	document.getElementById("tab-holder-charts").appendChild(tab);
	
	let chartContainer = createChartContainer(orgSID);
	document.getElementById("chart-holder").appendChild(chartContainer);
	//the container MUST first be loaded in the DOM for its size to be non-zero
	addChart(chartContainer, orgSID);
	
	let onClick = onClickCloseFactory(tab, [chartContainer]);
	
	let iconCloseTab = createCloseIcon(onClick);
	tab.appendChild(iconCloseTab);
	
	let iconCloseChart = createCloseIcon(onClick);
	chartContainer.appendChild(iconCloseChart);
};

let createChartContainer = function(id) {
	let chartContainer = document.createElement("div");
	chartContainer.classList.add("chart-container");
	chartContainer.id = "chart-" + id;
	return chartContainer;
};

let createResultsContainer = function(id) {
	let resultsContainer = document.createElement("table");
	resultsContainer.id = "results-" + id;
	return resultsContainer;
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
	addResults();
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
	
	resultsContainer.addRow({
		Archetype: "Archetype",
		Commitment: "Commitment",
		GrowthRate: "GrowthRate",
		Language: "Language",
		Main: "Main",
		Name: "Name",
		PrimaryFocus: "PrimaryFocus",
		SID: "SID",
		SecondaryFocus: "SecondaryFocus",
		Size: "Size",
	});
	
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

