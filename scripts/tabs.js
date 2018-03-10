//import fetchSizeHistory form fetch.js

window.onload = () => init();

let addTab = function(orgName){
	let newTab = document.createElement("div");
	newTab.classList.add("tab");
	newTab.innerHTML = orgName;
	return newTab;
};

let createChart = async function(chartHolder, orgSID){
	let data = await fetchSizeHistory(orgSID);
	
	//we set the size of the svg using the size of its container
	//the container MUST first be loaded in the DOM for its size to be non-zero
	let chartContainer = document.createElement("div");
	chartContainer.classList.add("chart-container");
	chartHolder.appendChild(chartContainer);
	let newChart = drawChartLine(chartContainer, data, orgSID);
	newChart.classList.add("chart");
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
	let tabHolder = document.getElementById("tab-holder");
	let chartHolder = document.getElementById("chart-holder");
	
	let tab = addTab(orgName);
	let chartContainer = await createChart(chartHolder, orgSID);
	let closeIcon = createCloseIcon(tab, chartContainer);
	
	tab.appendChild(closeIcon);
	tabHolder.appendChild(tab);
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

