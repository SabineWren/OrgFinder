let success = function(r){
	return { success: true, data: r.json() };
};

let fail = function(err){
	return { success: false, error: err };
};

let fetchSizeHistory = async function(sid){
	return await fetch("/backEnd/org_history.php?SID=" + sid)
		.then(r => success(r))
		.catch(err => fail(err));
};

let fetchOrgsListing = async function(){
	return await fetch("/backEnd/selects.php?Activity=&Archetype=&Cog=0&Commitment=&Growth=down&Lang=Any&Manifesto=&NameOrSID=&OPPF=0&Recruiting=&Reddit=0&Roleplay=&STAR=0&pagenum=0&primary=0")
		.then(r => success(r))
		.catch(err => fail(err));
};

let parseResponse = function(response){
	let data = response.data;
	if(!response.success) {
		data = [];
		console.log("request failed: " + response.error);
	}
	return data;
};
