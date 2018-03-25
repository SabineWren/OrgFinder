/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { Create };

const Create = function(name, id) {
	const newTab = document.createElement("div");
	newTab.classList.add("tab");
	newTab.id = "tab-" + id;
	newTab.innerHTML = name;
	return newTab;
};
