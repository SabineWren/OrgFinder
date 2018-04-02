/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { AddDetails, ResizeDetails };
import * as _fetch from "../fetch.js";

const AddDetails = async function(block, sid) {
	const details = await queryDetails(sid).catch(_fetch.Warning);
	block.appendChild(details);
	ResizeDetails(details);
};

const fetchDetails = function(sid) {
	const err = new Error();
	return _fetch.Fetch(err, "/OrgFinderDeprecated/backEnd/org_description.php?SID=" + sid);
};

const queryDetails = async function(sid) {
	const data = await fetchDetails(sid);
	
	const regexLongWords = /\S{40,}/g;
	let headlineText = data[0].Headline;
	let manifestoText = data[0].Manifesto;
	
	headlineText  = headlineText
		.replace(regexLongWords, "----------------------------------------");
	manifestoText = manifestoText
		.replace(regexLongWords, "----------------------------------------");
	
	const details = document.createElement("DIV");
	details.classList.add("details-content");
	
	const headline = document.createElement("DIV");
	headline.innerHTML = headlineText;
	details.appendChild(headline);
	
	const manifesto = document.createElement("DIV");
	manifesto.innerHTML = manifestoText;
	details.appendChild(manifesto);
	
	return details;
};

const ResizeDetails = function(content) {
	content.parentElement.style.gridRow = "span " + content.offsetHeight;
};

