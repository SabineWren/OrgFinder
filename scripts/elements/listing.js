let addActivityImage = function(cell, activity){
	cell.classList.add(activity.toLowerCase().replace(' ', '-'));
	cell.innerHTML = "";
	cell.title = activity;
};


let addCell = function(classCSS, text) {
	let cell = document.createElement("div");
	cell.innerHTML = text;
	cell.classList.add(classCSS);
	let isImage = classCSS === "focus-primary" || classCSS === "focus-secondary";
	if(isImage){ addActivityImage(cell, text); }
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

let makeTitleRow = function (){
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

let queryListingTable = async function(){
	let data = await fetchOrgsListing();
	
	let table = document.createElement("div");
	table.classList.add("table");
	loadList(table, data);
	
	return table;
}
