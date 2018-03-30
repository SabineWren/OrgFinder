/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { Create, OnclickFactory };

const Create = function(onclick) {
	const closeIcon = document.createElement("img");
	closeIcon.classList.add("close-icon");
	closeIcon.onclick = onclick;
	//closeIcon.src = "images/icons.svg#icon-x";
	closeIcon.src = "/OrgFinder/images/icons.svg#icon-x";
	return closeIcon;
}

const OnclickFactory = function(tab, elements) {
	if(elements === undefined) {
		return event => event.target.parentElement.remove();
	}
	
	let aliveIds = Object.freeze(elements.map(e => e.id));
	
	const getNewAliveIds = function(kill) {
		if(kill.id === tab.id) { return Object.freeze([]); }
		return Object.freeze(aliveIds.filter(alive => alive !== kill.id));
	};
	
	return function(event) {
		aliveIds = Object.freeze(getNewAliveIds(event.target.parentElement));
		
		elements
			.filter(e => !aliveIds.includes(e.id))
			.forEach(e => e.remove());
		
		if(aliveIds.length === 0) { tab.remove(); }
	};
};

