//import fetchSizeHistory form fetch.js

window.onload = () => init();

let addCell = function(text){
	let td = document.createElement("td");
	td.innerHTML = text;
	this.appendChild(td);
	return this;
};

let addChart = async function(chartContainer, orgSID){
	let response = await fetchSizeHistory(orgSID);
	let data = await parseResponse(response);
	
	let newChart = drawChartLine(chartContainer, data, orgSID);
	newChart.classList.add("chart");
	return chartContainer;
};

let addResults = async function(){
	let tab = createTab("Default Listing");
	document.getElementById("tab-holder-results").appendChild(tab);
	
	let resultsContainer = createResultsContainer();
	document.getElementById("chart-holder").appendChild(resultsContainer);
	
	let response = await fetchOrgsListing();
	let data = await parseResponse(response);
	
	loadList(resultsContainer, data);
};

let addRow = function(data){
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

let addTabAndChart = async function (orgSID, orgName) {
	let tab = createTab(orgName);
	document.getElementById("tab-holder-charts").appendChild(tab);
	
	let chartContainer = createChartContainer();
	document.getElementById("chart-holder").appendChild(chartContainer);
	
	//the container MUST first be loaded in the DOM for its size to be non-zero
	await addChart(chartContainer, orgSID);
	
	let closeIcon = createCloseIcon(tab, chartContainer);
	tab.appendChild(closeIcon);
};

let createChartContainer = function(){
	let chartContainer = document.createElement("div");
	chartContainer.classList.add("chart-container");
	return chartContainer;
};

let createResultsContainer = function(){
	let resultsContainer = document.createElement("table");
	return resultsContainer;
};

let createCloseIcon = function(keyElement, valueElement){
	let closeIcon = document.createElement("div");
	closeIcon.classList.add("close-icon");
	closeIcon.onclick = onclickFactoryClose(keyElement, valueElement);
	return closeIcon;
}

let createTab = function(orgName){
	let newTab = document.createElement("div");
	newTab.classList.add("tab");
	newTab.innerHTML = orgName;
	return newTab;
};

let init = function () {
	addResults();
	addTabAndChart("LAWBINDERS","LAWBINDERS");
	addTabAndChart("00000000", "ENEMY CONTACT");
	addTabAndChart("HHCORP", "Horizons Hunters");
	addTabAndChart("AOTW", "Angels of the Warp");
	addTabAndChart("POI", "Person Of Interest");
	addTabAndChart("TFTO", "The First Order");
	addTabAndChart("PROT", "Protectors of Verum");
	addTabAndChart("AMFR", "AMFR");
};

let loadList = function(resultsContainer, data){
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

let onclickFactoryClose = function(keyElement, valueElement){
	return function(){
		keyElement.remove();
		valueElement.remove();
	};
	
};

