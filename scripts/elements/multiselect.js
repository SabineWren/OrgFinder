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
	
	const label = document.createElement("LABEL");
	
	const checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.value = val;
	
	label.appendChild(checkbox);
	label.innerHTML += val;
	
	li.appendChild(label);
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
	
	const ul = document.createElement("DIV");
	ul.classList.add("ul");
	
	values
		.map(val => createListItem(val))
		.forEach(item => ul.appendChild(item));
	
	anchor.onclick = setActive;
	
	container.appendChild(ul);
	return container;
};

const removeActive = function(element){
	element.classList.remove("active");
};

const setActive = function(event) {
	//clicked to close an open multiselect
	if(event.target.classList.contains("active")){
		removeActive(event.target);
		return;
	}
	
	//clicked other multiselect
	const current = document.getElementsByClassName("active");
	[].forEach.call(current, removeActive);
	
	event.target.classList.add("active");
}

