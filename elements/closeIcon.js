let createCloseIcon = function(onclick) {
	let closeIcon = document.createElement("div");
	closeIcon.classList.add("close-icon");
	closeIcon.onclick = onclick;
	closeIcon.innerHTML = "X";
	return closeIcon;
}

let onclickCloseFactory = function(tab, elements) {
	if(elements === undefined) {
		return event => event.target.parentElement.remove();
	}
	
	let aliveIds = elements.map(e => e.id);
	
	let getNewAliveIds = function(kill) {
		if(kill.id === tab.id) { return []; }
		
		return aliveIds.filter(alive => alive !== kill.id);
	};
	
	return function(event) {
		aliveIds = getNewAliveIds(event.target.parentElement);
		
		elements
			.filter(e => !aliveIds.includes(e.id))
			.forEach(e => e.remove());
		
		if(aliveIds.length === 0) { tab.remove(); }
	};
};

