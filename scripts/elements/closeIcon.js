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
	const stack = MASTER.cloneNode(true);
	stack.classList.add("close-icon");
	stack.onclick = onclick;
	//const closeIcon = stack.getElementsByClassName("icon-x")[0];
	//closeIcon.classList.remove("hide");
	stack.classList.remove("hide");
	return stack;
}

const getRealParent = function(child){
	//SVGs delegate onclick to their child components
	if(child.tagName === "circle"){
		return child.parentElement.parentElement;
	}
	return child.parentElement;
};

const OnclickFactory = function(tab, elements) {
	if(elements === undefined) {
		return event => getRealParent(event.target).remove();
	}
	
	let aliveIds = Object.freeze(elements.map(e => e.id));
	
	const getNewAliveIds = function(kill) {
		if(kill.id === tab.id) { return []; }
		return aliveIds.filter(alive => alive !== kill.id);
	};
	
	return function(event) {
		aliveIds = Object.freeze(getNewAliveIds(getRealParent(event.target)));
		
		elements
			.filter(e => !aliveIds.includes(e.id))
			.forEach(e => e.remove());
		
		if(aliveIds.length === 0) { tab.remove(); }
	};
};

const MASTER = Object.freeze(document.getElementsByClassName("stack")[0]);

