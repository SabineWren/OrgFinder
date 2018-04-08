/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { AddDetails, Resize };
import * as _fetch from "../fetch.js";
import * as _min from "./minimizeIcon.js";

const getClass = function(element) {
	if(element.classList.contains("charter"))   { return "charter"; }
	if(element.classList.contains("history"))   { return "history"; }
	if(element.classList.contains("manifesto")) { return "manifesto"; }
	return null;
};

const activateOption = function(event) {
	const allButtons = event.target.parentElement.getElementsByClassName("details-button");
	[].forEach.call(allButtons, button => button.classList.remove("selected") );
	
	const allItems = event.target.parentElement.parentElement.getElementsByClassName("details-item");
	[].forEach.call(allItems, item => item.classList.remove("selected") );
	
	const classname = getClass(event.target);
	const details = (event.target.parentElement.parentElement);
	const selected = details.getElementsByClassName(classname);
	
	[].forEach.call(selected, item => item.classList.add("selected"));
	Resize(details);
};

const AddDetails = async function(block, sid) {
	const details = await queryDetails(sid).catch(_fetch.Warning);
	block.appendChild(details);
	block.appendChild(_min.Create(Resize, details));
	Resize(details);
};

const createRadioOption = function(text, classname) {
	const button = document.createElement("DIV");
	button .classList.add("details-button", classname);
	button.innerHTML = text;
	button.onclick = activateOption;
	return button;
};

const fetchDetails = function(sid) {
	const err = new Error();
	return _fetch.Fetch(err, "/OrgFinderDeprecated/backEnd/org_description.php?SID=" + sid);
};

const queryDetails = async function(sid) {
	const data = await fetchDetails(sid);
	
	let headlineText = data[0].Headline;
	let manifestoText = data[0].Manifesto;
	
	const details = document.createElement("DIV");
	details.classList.add("details-content");
	
	const title = document.createElement("DIV");
	title.classList.add("details-title");
	title.innerHTML = sid;
	details.appendChild(title);
	
	const headline = document.createElement("DIV");
	headline.classList.add("headline");
	headline.innerHTML = headlineText;
	details.appendChild(headline);
	
	const radio = document.createElement("DIV");
	radio.classList.add("radio");
	details.appendChild(radio);
	
	//visible radio
	const optionHistory = createRadioOption("History", "history");
	radio.appendChild(optionHistory);
	
	const optionManifesto = createRadioOption("Manifesto", "manifesto");
	optionManifesto.classList.add("selected");
	radio.appendChild(optionManifesto);
	
	const optionCharter = createRadioOption("Charter", "charter");
	radio.appendChild(optionCharter);
	
	//display if radio selected
	const history = document.createElement("DIV");
	history.classList.add("details-item", "history");
	history.innerHTML = "NOT SCRAPED";//TODO
	details.appendChild(history);
	
	const manifesto = document.createElement("DIV");
	manifesto.classList.add("details-item", "manifesto");
	manifesto.innerHTML = manifestoText;
	manifesto.classList.add("selected");
	details.appendChild(manifesto);
	
	const charter = document.createElement("DIV");
	charter.classList.add("details-item", "charter");
	charter.innerHTML = "NOT SCRAPED";//TODO
	details.appendChild(charter);
	
	return details;
};

const rowHeight = parseFloat(getComputedStyle(document.body).getPropertyValue("--grid-row-height"));
const Resize = function(content) {
	content.parentElement.style.gridRow = "span " + Math.ceil(content.offsetHeight / rowHeight);
};

