export { QueryDetails };
import * as _fetch from "../fetch.js";

const fetchDetails = function(sid) {
	const err = new Error();
	return _fetch.Fetch(err, "/OrgFinderDeprecated/backEnd/org_description.php?SID=" + sid);
};

const QueryDetails = async function(sid) {
	const data = await fetchDetails(sid);
	
	const regexLongWords = /\S{40,}/g;
	let headlineText = data[0].Headline;
	let manifestoText = data[0].Manifesto;
	
	headlineText  = headlineText
		.replace(regexLongWords, "----------------------------------------");
	manifestoText = manifestoText
		.replace(regexLongWords, "----------------------------------------");
	
	const details = document.createElement("DIV");
	details.classList.add("details");
	
	const headline = document.createElement("P");
	headline.innerHTML = headlineText;
	details.appendChild(headline);
	
	const manifesto = document.createElement("P");
	manifesto.innerHTML = manifestoText;
	details.appendChild(manifesto);
	
	return details;
};

