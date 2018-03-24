const logError = function(reason) {
	setTimeout(() => { throw new Error(reason)});
};

let queueSize = 3;//list fetching aborts on intial load if queueSize > 3
export const fetchGlobal = async function(err, url) {
	while(queueSize < 1) { await sleep(50); }
	queueSize--;
	
	const throwError = function(reason){
		err.message = reason;
		window.setTimeout(function() {
			queueSize++;
			throw err;
		});
	};
	
	return fetch(url)
		.then(function(resp) {
			if(resp.ok){
				const result = resp.json();
				queueSize++;
				return result;
			}
			throwError("error retrieving json from url: " + url);
		})
		.catch(throwError);
};

const sleep = function(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
};

const warning = function(err) {
	console.log("placeholder until user-visible error block: " + err);
	return [];
};

window.onerror = function(message, source, lineno, colno, err){
	console.log("source: " + source);
	console.log("line number: " + lineno);
	console.log("reason: " + err.message);
}

window.onunhandledrejection = function(err) {
	console.log("Failed to catch error!");
	console.log(err.message);
}
