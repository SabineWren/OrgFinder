/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { QueryListingTable, RedefineGrid, ResizeHeight };
import * as _fetch from "../fetch.js";

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

const addLogo = function(sid, isCustom) {
	const cell = document.createElement("img");
	cell.classList.add("logo");
	cell.title = "logo";
	cell.src = "/OrgFinder/images/org_icons/AOTW";
	this.appendChild(cell);
	return this;
};

const addRow = function(data) {
	const row = document.createElement("div");
	row.classList.add("row");
	row.addCell = addCell;
	row.addLogo = addLogo;
	
	row
		.addCell("archetype", data.Archetype)
		.addCell("commitment", data.Commitment)
		.addCell("focus-primary", data.PrimaryFocus)
		.addCell("focus-secondary", data.SecondaryFocus)
		.addCell("growth", data.GrowthRate)
		.addCell("language", data.Language)
		.addLogo(data.SID, data.CustomIcon)
		.addCell("main", data.Main)
		.addCell("name", data.Name)
		.addCell("sid", data.SID)
		.addCell("size", data.Size);
	
	this.appendChild(row);
};

const fetchOrgsListing = function() {
	const err = new Error();
	return _fetch.Fetch(err, "/OrgFinder/backEnd/selects.php?Activity=&Archetype=&Cog=0&Commitment=&Growth=down&Lang=Any&Manifesto=&NameOrSID=&OPPF=0&Recruiting=&Reddit=0&Roleplay=&STAR=0&pagenum=0&primary=0");
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
		.addCell("archetype", "Archetype")
		.addCell("commitment", "Commitment")
		.addCell("focuses-header", "Focuses")
		.addCell("growth", "Weekly Growth")
		.addCell("language", "Language")
		.addCell("logo", "Logo")
		.addCell("main", "Main")
		.addCell("name", "Name")
		.addCell("sid", "SID")
		.addCell("size", "Size");
	
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
	const widthRow8 = widthRow6 + sizeGap * 2
		+ parseFloat(style.getPropertyValue("--size-archetype"))
		+ parseFloat(style.getPropertyValue("--size-focus"));
	const widthRow9 = widthRow8 + sizeGap + parseFloat(style.getPropertyValue("--size-size"))
	const widthRow10 = widthRow9 + sizeGap + parseFloat(style.getPropertyValue("--size-sid"))
	
	return {
		widthRow8: widthRow8 * parseFloat(em.clientWidth),
		widthRow9: widthRow9 * parseFloat(em.clientWidth),
		widthRow10: widthRow10 * parseFloat(em.clientWidth),
	};
};

const RedefineGrid = function() {
	const numCols = getNumCols();
	blockHolder.style.setProperty("--num-cols", numCols);
	const colWidth = window.innerWidth / numCols;
	
	const listings = Array.from(document.getElementsByClassName("listing"));
	const vars = getVariables();
	
	if(colWidth < vars.widthRow8) {
		listings.forEach(function(listing) {
			listing.classList.remove("grid8", "grid9", "grid10");
		})
	} else if(colWidth < vars.widthRow9) {
		listings.forEach(function(listing) {
			listing.classList.remove("grid9", "grid10");
			listing.classList.add("grid8");
		})
	} else if(colWidth < vars.widthRow10) {
		listings.forEach(function(listing) {
			listing.classList.remove("grid10");
			listing.classList.add("grid8", "grid9");
		})
	} else {
		listings.forEach(function(listing) {
			listing.classList.add("grid8", "grid9", "grid10");
		})
	}
	
	ResizeHeight();
};

const rowHeight = parseFloat(getComputedStyle(document.body).getPropertyValue("--grid-row-height"));
const ResizeHeight = function() {
	const lists = document.getElementsByClassName("table");
	if(lists.length > 0) {
		const height = parseFloat(getComputedStyle(lists[0]).height);
		lists[0].parentElement.style.gridRow = "span " + Math.ceil(height / rowHeight);
	}
};

const QueryListingTable = async function() {
	const data = await fetchOrgsListing();
	
	const table = document.createElement("div");
	table.classList.add("table");
	loadList(table, data);
	
	return table;
}

const blockHolder = document.getElementById("block-holder");
const em = document.getElementById("em");

