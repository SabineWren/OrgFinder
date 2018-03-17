window.onload = () => init();

let addListing = async function(name, id) {
	let tab = createTab(name, id);
	document.getElementById("tab-holder-results").appendChild(tab);
	
	let listingContainer = createBlock(id, BLOCKS.LISTING);
	document.getElementById("data-holder").appendChild(listingContainer);
	
	let tableLoading = queryListingTable();
	
	let onclick = onclickCloseFactory(tab, [listingContainer]);
	let iconCloseListing = createCloseIcon(onclick);
	let iconCloseTab = createCloseIcon(onclick);
	
	listingContainer.appendChild(iconCloseListing);
	tab.appendChild(iconCloseTab);
	
	await tableLoading;
	tableLoading.then(table => listingContainer.appendChild(table));
};

let addOrg = async function (orgSID, orgName) {
	let tab = createTab(orgName, orgSID);
	document.getElementById("tab-holder-data").appendChild(tab);
	
	let dataHolder = document.getElementById("data-holder");
	
	let blockChart = createBlock(orgSID, BLOCKS.CHART);
	dataHolder.appendChild(blockChart);
	//the container MUST first be loaded in the DOM for its size to be non-zero
	addChart(blockChart, orgSID);
	
	let blockDetails = createBlock(orgSID, BLOCKS.DETAILS);
	dataHolder.appendChild(blockDetails);
	
	let onclick = onclickCloseFactory(tab, [blockChart, blockDetails]);
	
	let iconCloseChart = createCloseIcon(onclick);
	let iconCloseDetails = createCloseIcon(onclick);
	let iconCloseTab = createCloseIcon(onclick);
	
	blockChart.appendChild(iconCloseChart);
	blockDetails.appendChild(iconCloseDetails);
	tab.appendChild(iconCloseTab);
};

let createBlock = function(id, type) {
	switch(type){
		case BLOCKS.CHART:
			id = "chart-" + id;
			break;
		case BLOCKS.DETAILS:
			id = "details-" + id;
			break;
		case BLOCKS.LISTING:
			id = "listing-" + id;
			break;
	}
	
	let block = document.createElement("div");
	block.classList.add("data-container");
	block.id = id;
	return block;
};

let init = async function () {
	var success = addListing("Default Listing", "DEFAULT_ID");
	addOrg("LAWBINDERS","LAWBINDERS");
	addOrg("00000000", "ENEMY CONTACT");
	await success;//required to prevent r.json() aborting
	addOrg("HHCORP", "Horizons Hunters");
	addOrg("AOTW", "Angels of the Warp");
	addOrg("POI", "Person Of Interest");
	addOrg("TFTO", "The First Order");
	addOrg("PROT", "Protectors of Verum");
	addOrg("AMFR", "AMFR");
};

