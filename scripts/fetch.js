window.onerror = function(message, source, lineno, colno, err){
	console.log("Error successully caught:");
	console.log(message);
	console.log("source: " + source);
	console.log("line number: " + lineno);
	console.log("reason: " + err.reason);
}

let warning = function(err) {
	console.log("request failed: " + err);
	return [];
};

window.onunhandledrejection = function(err) {
	console.log("Failed to catch error!");
	console.log(err.reason);
}

let logError = function(reason) {
	setTimeout(() => { throw new Error(reason)});
};

let fetchGlobal = function(err, url) {
	let throwError = function(reason){
		err.message = reason;
		window.setTimeout(() => {throw err});
	};
	
	return fetch(url)
		.then(function(resp) {
			if(resp.ok){ return resp.json(); }
			throwError("error retrieving json from url: " + url);
		})
		.catch(throwError);
};
