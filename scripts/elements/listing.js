let addActivityImage = function(cell, activity) {
	cell.classList.add(activity.toLowerCase().replace(' ', '-'));
	cell.innerHTML = "";
	cell.title = activity;
};


let addCell = function(classCSS, text) {
	let cell = document.createElement("div");
	cell.innerHTML = text;
	cell.classList.add(classCSS);
	let isImage = classCSS === "focus-primary" || classCSS === "focus-secondary";
	if(isImage) { addActivityImage(cell, text); }
	this.appendChild(cell);
	return this;
};

let addRow = function(data) {
	let row = document.createElement("div");
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

let fetchOrgsListing = function() {
	return fetch("/backEnd/selects.php?Activity=&Archetype=&Cog=0&Commitment=&Growth=down&Lang=Any&Manifesto=&NameOrSID=&OPPF=0&Recruiting=&Reddit=0&Roleplay=&STAR=0&pagenum=0&primary=0")
		.then(r => r.json())
		.catch(warning);
};

let loadList = function(resultsContainer, data) {
	resultsContainer.addRow = addRow;
	resultsContainer.appendChild(makeTitleRow());
	data.forEach(dataRow => resultsContainer.addRow(dataRow));
};

let makeTitleRow = function () {
	let row = document.createElement("div");
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

let getNumCols = function() {
	let style = getComputedStyle(document.body);
	let minWidth = parseInt(style.getPropertyValue("--size-width-min"));
	let idealWidth = parseInt(style.getPropertyValue("--size-width-ideal"));
	if(minWidth > idealWidth) { idealWidth = minWidth; }
	
	let numCols = Math.floor(window.innerWidth / idealWidth);
	if(numCols >= 1) { return numCols; }
	return 1;
};

let getVariables = function() {
	let style = getComputedStyle(document.body);
	
	let sizeRowBase = parseFloat(style.getPropertyValue("--size-commitment"))
		+ parseFloat(style.getPropertyValue("--size-focus")) * 2
		+ parseFloat(style.getPropertyValue("--size-main"))
		+ parseFloat(style.getPropertyValue("--size-growth"))
		+ parseFloat(style.getPropertyValue("--size-name"))
		+ parseFloat(style.getPropertyValue("--size-grid-border")) * 2;
	
	let sizeGap = parseFloat(em.clientWidth) * parseFloat(style.getPropertyValue("--size-grid-gap"));
	
	return {
		sizeArch   : parseFloat(em.clientWidth) * parseFloat(style.getPropertyValue("--size-archetype")),
		sizeGap:     sizeGap,
		sizeRowBase: parseFloat(em.clientWidth) * sizeRowBase + sizeGap * 5,
		sizeSid:     parseFloat(em.clientWidth) * parseFloat(style.getPropertyValue("--size-sid")),
		sizeSize:    parseFloat(em.clientWidth) * parseFloat(style.getPropertyValue("--size-size")),
	};
};

let redefineGrid = function() {
	let numCols = getNumCols();
	blockHolder.style.setProperty("--num-cols", numCols);
	let colWidth = window.innerWidth / numCols;
	
	let vars = getVariables();
	
	var listings = Array.from(document.getElementsByClassName("listing"));
	let widthRow7 = vars.sizeRowBase + vars.sizeGap + vars.sizeArch;
	let widthRow8 = widthRow7        + vars.sizeGap + vars.sizeSize;
	let widthRow9 = widthRow8        + vars.sizeGap + vars.sizeSid;
	
	if(colWidth < widthRow7) {
		listings.forEach(function(listing) {
			listing.classList.remove("grid7", "grid8", "grid9");
		})
	} else if(colWidth < widthRow8) {
		listings.forEach(function(listing) {
			listing.classList.remove("grid8", "grid9");
			listing.classList.add("grid7");
		})
	} else if(colWidth < widthRow9) {
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

let queryListingTable = async function() {
	let data = await fetchOrgsListing();
	
	let table = document.createElement("div");
	table.classList.add("table");
	loadList(table, data);
	
	return table;
}

let blockHolder = document.getElementById("block-holder");
let em = document.getElementById("em");

