const createCloseIcon = function(onclick) {
	const closeIcon = document.createElement("div");
	closeIcon.classList.add("close-icon");
	closeIcon.onclick = onclick;
	closeIcon.innerHTML = "X";
	return closeIcon;
}

const onclickCloseFactory = function(tab, elements) {
	if(elements === undefined) {
		return event => event.target.parentElement.remove();
	}
	
	const aliveIds = elements.map(e => e.id);
	
	const getNewAliveIds = function(kill) {
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

