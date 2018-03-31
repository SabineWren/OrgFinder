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
	const applyHover = function(e) {
		closeIcon.style.setProperty("--colour-ambient", "rgb( 190, 0, 0)");
		closeIcon.style.setProperty("--colour-diffuse", "rgb( 255, 0, 0)");
	};
	const removeHover = function(e){
		closeIcon.style.setProperty("--colour-ambient", "rgb( 196,  98, 0)");
		closeIcon.style.setProperty("--colour-diffuse", "rgb( 240, 145, 5)");
	};
	
	const closeIcon = MASTER.cloneNode(true);
	closeIcon.classList.add("close-icon");
	const top = closeIcon.getElementsByClassName("top")[0];
	top.onclick     = onclick;
	top.onmouseover = applyHover;
	top.onmouseout  = removeHover;
	closeIcon.classList.remove("hide");
	return closeIcon;
}

const getRealParent = function(child) {
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

const MASTER = Object.freeze(document.getElementsByClassName("icon-x")[0]);

