window.onload = () => init();

const addListing = async function(name, id) {
	const blockListing = createBlock(id, BLOCKS.LISTING);
	document.getElementById("block-holder").appendChild(blockListing);
	
	const tableLoading = queryListingTable();
	
	const iconCloseListing = createCloseIcon(onclickCloseFactory());
	blockListing.appendChild(iconCloseListing);
	
	tableLoading.then(table => blockListing.appendChild(table))
		.catch(warning);
};

const addOrg = async function (orgSID, orgName) {
	const tab = createTab(orgName, orgSID);
	document.getElementById("tab-holder").appendChild(tab);
	
	const blockHolder = document.getElementById("block-holder");
	
	const blockChart = createBlock(orgSID, BLOCKS.CHART);
	blockHolder.appendChild(blockChart);
	//the container MUST first be loaded in the DOM for its size to be non-zero
	addChart(blockChart, orgSID);
	
	const blockDetails = createBlock(orgSID, BLOCKS.DETAILS);
	blockHolder.appendChild(blockDetails);
	
	const onclick = onclickCloseFactory(tab, [blockChart, blockDetails]);
	blockChart.appendChild(createCloseIcon(onclick));
	blockDetails.appendChild(createCloseIcon(onclick));
	tab.appendChild(createCloseIcon(onclick));
};

const createBlock = function(id, type) {
	const block = document.createElement("div");
	block.classList.add("block");
	
	switch(type){
		case BLOCKS.CHART:
			id = "chart-" + id;
			break;
		case BLOCKS.DETAILS:
			id = "details-" + id;
			break;
		case BLOCKS.LISTING:
			id = "listing-" + id;
			block.classList.add("listing");
			redefineGrid();//ensure new block conforms to current col size
			break;
	}
	
	block.id = id;
	return block;
};

const init = async function () {
	window.addEventListener('resize', resizePage);
	resizePage();
	
	const multiselects = addControls();
	multiselects[0].style.width = parseFloat(multiselects[0].clientWidth) + 17 + "px";
	multiselects[3].style.width = parseFloat(multiselects[3].clientWidth) + 17 + "px";
	
	addListing("Default Listing", "DEFAULT_ID");
	addOrg("LAWBINDERS","LAWBINDERS");
	addOrg("00000000", "ENEMY CONTACT");
	addOrg("HHCORP", "Horizons Hunters");
	addOrg("AOTW", "Angels of the Warp");
	addOrg("POI", "Person Of Interest");
	addOrg("TFTO", "The First Order");
	addOrg("PROT", "Protectors of Verum");
	addOrg("AMFR", "AMFR");
};

//strangely, this fires twice on initial load
//more strangely, it actually needs to fire twice on page load, so let it!
const resizePage = function(event){
    window.requestAnimationFrame(redefineGrid);
};

