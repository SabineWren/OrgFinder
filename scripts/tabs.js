//import fetchSizeHistory form fetch.js

window.onload = () => init();

let createTab = function(orgName){
	let newTab = document.createElement("div");
	newTab.classList.add("tab");
	newTab.innerHTML = orgName;
	return newTab;
};

let createChart = async function(chartContainer, orgSID){
	let response = await fetchSizeHistory(orgSID);
	let data = await response.data;
	if(!response.success) {
		data = [];
		console.log("request failed: " + response.error);
	}
	
	let newChart = drawChartLine(chartContainer, data, orgSID);
	newChart.classList.add("chart");
	return chartContainer;
};

let createChartContainer = function(){
	let chartContainer = document.createElement("div");
	chartContainer.classList.add("chart-container");
	return chartContainer;
};

let createCloseIcon = function(keyElement, valueElement){
	let closeIcon = document.createElement("div");
	closeIcon.classList.add("close-icon");
	closeIcon.onclick = onclickFactoryClose(keyElement, valueElement);
	return closeIcon;
}

let onclickFactoryClose = function(keyElement, valueElement){
	return function(){
		keyElement.remove();
		valueElement.remove();
	};
	
};

let addTabAndChart = async function (orgSID, orgName) {
	let tab = createTab(orgName);
	document.getElementById("tab-holder").appendChild(tab);
	
	let chartContainer = createChartContainer();
	document.getElementById("chart-holder").appendChild(chartContainer);
	
	//the container MUST first be loaded in the DOM for its size to be non-zero
	await createChart(chartContainer, orgSID);
	
	let closeIcon = createCloseIcon(tab, chartContainer);
	tab.appendChild(closeIcon);
};

let init = function () {
	addTabAndChart("LAWBINDERS","LAWBINDERS");
	addTabAndChart("00000000", "ENEMY CONTACT");
	addTabAndChart("HHCORP", "Horizons Hunters");
	addTabAndChart("AOTW", "Angels of the Warp");
	addTabAndChart("POI", "Person Of Interest");
	addTabAndChart("TFTO", "The First Order");
	addTabAndChart("PROT", "Protectors of Verum");
	addTabAndChart("AMFR", "AMFR");
};

