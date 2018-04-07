/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { Create };

const Create = function() {
	const applyHover = function(e) {
		minIcon.style.setProperty("--colour-ambient", "rgb( 20, 140, 20)");
		minIcon.style.setProperty("--colour-diffuse", "rgb( 50, 210, 20)");
	};
	const removeHover = function(e){
		minIcon.style.setProperty("--colour-ambient", "rgb( 196,  98, 0)");
		minIcon.style.setProperty("--colour-diffuse", "rgb( 240, 145, 5)");
	};
	
	const minIcon = MASTER.cloneNode(true);
	minIcon.classList.add("min-icon");
	const top = minIcon.getElementsByClassName("top")[0];
	top.onclick     = onclick;
	top.onmouseover = applyHover;
	top.onmouseout  = removeHover;
	minIcon.classList.remove("hide");
	return minIcon;
}

const onclick = function(event) {
	const container = event.target.parentElement.parentElement;
	if(container.classList.contains("minimized")) {
		container.classList.remove("minimized");
	}
	else {
		container.classList.add("minimized");
	}
};

const MASTER = Object.freeze(document.getElementsByClassName("icon-m")[0]);
