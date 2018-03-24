const addActivityImage = function(cell, activity) {
	cell.classList.add(activity.toLowerCase().replace(' ', '-'));
	cell.innerHTML = "";
	cell.title = activity;
};


const addCell = function(classCSS, text) {
	const cell = document.createElement("div");
	cell.innerHTML = text;
	cell.classList.add(classCSS);
	const isImage = classCSS === "focus-primary" || classCSS === "focus-secondary";
	if(isImage) { addActivityImage(cell, text); }
	this.appendChild(cell);
	return this;
};

const addRow = function(data) {
	const row = document.createElement("div");
	row.classList.add("row");
	row.addCell = addCell;
	
	row
		.addCell("sid", data.SID)
		.addCell("archetype", data.Archetype)
		.addCell("focus-primary", data.PrimaryFocus)
		.addCell("focus-secondary", data.SecondaryFocus)
		.addCell("commitment", data.Commitment)
		.addCell("language", data.Language)
		.addCell("name", data.Name)
		.addCell("size", data.Size)
		.addCell("main", data.Main)
		.addCell("growth", data.GrowthRate);
	
	this.appendChild(row);
};

const fetchOrgsListing = function() {
	const err = new Error();
	return fetchGlobal(err, "/OrgFinder/backEnd/selects.php?Activity=&Archetype=&Cog=0&Commitment=&Growth=down&Lang=Any&Manifesto=&NameOrSID=&OPPF=0&Recruiting=&Reddit=0&Roleplay=&STAR=0&pagenum=0&primary=0");
};

const loadList = function(resultsContainer, data) {
	resultsContainer.addRow = addRow;
	resultsContainer.appendChild(makeTitleRow());
	data.forEach(dataRow => resultsContainer.addRow(dataRow));
};

const makeTitleRow = function () {
	const row = document.createElement("div");
	row.classList.add("row");
	row.addCell = addCell;
	
	row
		.addCell("sid", "SID")
		.addCell("archetype", "Archetype")
		.addCell("focuses-header", "Focuses")
		.addCell("commitment", "Commitment")
		.addCell("language", "Language")
		.addCell("name", "Name")
		.addCell("size", "Size")
		.addCell("main", "Main")
		.addCell("growth", "Weekly Growth");
	
	return row;
};

const getNumCols = function() {
	const style = getComputedStyle(document.body);
	const minWidth = parseInt(style.getPropertyValue("--size-width-min"));
	const idealWidth = parseInt(style.getPropertyValue("--size-width-ideal"));
	if(minWidth > idealWidth) { idealWidth = minWidth; }
	
	const numCols = Math.floor(window.innerWidth / idealWidth);
	if(numCols >= 1) { return numCols; }
	return 1;
};

const getVariables = function() {
	const style = getComputedStyle(document.getElementById("block-holder"));
	
	const sizeRowBase = parseFloat(style.getPropertyValue("--size-commitment"))
		+ parseFloat(style.getPropertyValue("--size-focus")) * 2
		+ parseFloat(style.getPropertyValue("--size-main"))
		+ parseFloat(style.getPropertyValue("--size-growth"))
		+ parseFloat(style.getPropertyValue("--size-name"))
		+ parseFloat(style.getPropertyValue("--size-grid-border")) * 2;
	
	const sizeGap = parseFloat(style.getPropertyValue("--size-grid-gap"));
	
	const widthRow6 = sizeRowBase + sizeGap * 5;
	const widthRow7 = widthRow6 + sizeGap + parseFloat(style.getPropertyValue("--size-archetype"));
	const widthRow8 = widthRow7 + sizeGap + parseFloat(style.getPropertyValue("--size-size"))
	const widthRow9 = widthRow8 + sizeGap + parseFloat(style.getPropertyValue("--size-sid"))
	
	return {
		widthRow7: widthRow7 * parseFloat(em.clientWidth),
		widthRow8: widthRow8 * parseFloat(em.clientWidth),
		widthRow9: widthRow9 * parseFloat(em.clientWidth),
	};
};

const redefineGrid = function() {
	const numCols = getNumCols();
	blockHolder.style.setProperty("--num-cols", numCols);
	const colWidth = window.innerWidth / numCols;
	
	const listings = Array.from(document.getElementsByClassName("listing"));
	const vars = getVariables();
	
	if(colWidth < vars.widthRow7) {
		listings.forEach(function(listing) {
			listing.classList.remove("grid7", "grid8", "grid9");
		})
	} else if(colWidth < vars.widthRow8) {
		listings.forEach(function(listing) {
			listing.classList.remove("grid8", "grid9");
			listing.classList.add("grid7");
		})
	} else if(colWidth < vars.widthRow9) {
		listings.forEach(function(listing) {
			listing.classList.remove("grid9");
			listing.classList.add("grid7", "grid8");
		})
	} else {
		listings.forEach(function(listing) {
			listing.classList.add("grid7", "grid8", "grid9");
		})
	}
};

const queryListingTable = async function() {
	const data = await fetchOrgsListing();
	
	const table = document.createElement("div");
	table.classList.add("table");
	loadList(table, data);
	
	return table;
}

const blockHolder = document.getElementById("block-holder");
const em = document.getElementById("em");

