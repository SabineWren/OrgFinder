let warning = function(err) {
	console.log("request failed: " + err);
	return [];
};

let fetchSizeHistory = function(sid) {
	return fetch("/backEnd/org_history.php?SID=" + sid)
		.then(r => r.json())
		.catch(err => warning(err));
};

let fetchOrgsListing = function() {
	return fetch("/backEnd/selects.php?Activity=&Archetype=&Cog=0&Commitment=&Growth=down&Lang=Any&Manifesto=&NameOrSID=&OPPF=0&Recruiting=&Reddit=0&Roleplay=&STAR=0&pagenum=0&primary=0")
		.then(r => r.json())
		.catch(warning);
};

