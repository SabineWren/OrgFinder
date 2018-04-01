/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { Create };

const createListItem = function(val) {
	const li = document.createElement("DIV");
	li.classList.add("li");
	li.innerHTML = val;
	li.dataset.value = val;
	return li;
};

const Create = function(name, values) {
	const container = document.createElement("DIV");
	container.id = name.toLowerCase();
	container.classList.add("multiselect");
	
	const anchor = document.createElement("SPAN");
	anchor.classList.add("anchor");
	anchor.innerHTML = name;
	container.appendChild(anchor);
	
	const ulMaster = document.createElement("DIV");
	ulMaster.classList.add("ul");
	ulMaster.classList.add("master");
	
	const ulShadow = document.createElement("DIV");
	ulShadow.classList.add("ul");
	ulShadow.classList.add("doppelganger");
	
	values
		.map(val => createListItem(val))
		.forEach(function(item) {
			item.onclick = toggleSelectMaster;
			ulMaster.appendChild(item);
		});
	
	values
		.map(val => createListItem(val))
		.forEach(function(item) {
			item.onclick = toggleSelectShadow;
			ulShadow.appendChild(item);
		});
	
	anchor.onclick = setActive;
	
	container.appendChild(ulMaster);
	container.appendChild(ulShadow);
	return container;
};

const removeActive = function(element) {
	element.classList.remove("active");
};

const setActive = function(event) {
	//clicked to close an open multiselect
	if(event.target.classList.contains("active")) {
		removeActive(event.target);
		return;
	}
	
	//clicked other multiselect
	const current = document.getElementsByClassName("active");
	[].forEach.call(current, removeActive);
	
	event.target.classList.add("active");
}

const toggleSelect = function(master, doppelganger) {
	if(master.classList.contains("selected")) {
		master.classList.remove("selected");
		doppelganger.classList.remove("selected");
	}
	else {
		master.classList.add("selected");
		doppelganger.classList.add("selected");
	}
};

const toggleSelectMaster = function(event) {
	const master = event.target;
	const doppelganger = Array.from(master
			.parentElement.parentElement
			.getElementsByClassName("doppelganger")[0]
			.getElementsByClassName("li"))
			.filter(doppel => doppel.dataset.value === master.dataset.value)[0];
	toggleSelect(master, doppelganger);
};

const toggleSelectShadow = function(event) {
	const doppelganger = event.target;
	const master = Array.from(doppelganger
			.parentElement.parentElement
			.getElementsByClassName("master")[0]
			.getElementsByClassName("li"))
			.filter(master => master.dataset.value === doppelganger.dataset.value)[0];
	toggleSelect(master, doppelganger);
};

