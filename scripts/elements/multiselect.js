/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/

/* Two copies of data: one that shows all data (master),
 * and one that only shows selected data (doppelganger).
 * Shadow encapsulates everything to isolate styling and IDs.
*/
export { Create };
const Create = function(name, items) {
	const shadowAnchor = document.createElement("DIV");
	shadowAnchor.classList.add("multiselect");
	shadowAnchor.id = name.toLowerCase();
	
	const shadow = shadowAnchor.attachShadow({mode: "open"});
	shadow.appendChild(getStyle());
	
	const container = document.createElement("DIV");
	container.id = "container";
	shadow.appendChild(container);
	
	const header = document.createElement("DIV");
	header.id = "header";
	header.innerText = name;
	header.onclick = setActive;
	container.appendChild(header);
	
	const ulMaster = document.createElement("DIV");
	const ulDoppel = document.createElement("DIV");
	ulMaster.id = "master";
	ulDoppel.id = "doppelganger";
	
	items
		.map(getListItem)
		.forEach(function(item) {
			item.onclick = toggleSelectMaster;
			ulMaster.appendChild(item);
		});
	items
		.map(getListItem)
		.forEach(function(item) {
			item.onclick = toggleSelectDoppel;
			ulDoppel.appendChild(item);
		});
		
	container.appendChild(ulMaster);
	container.appendChild(ulDoppel);
	return shadowAnchor;
};

const getListItem = function(item) {
	const li = document.createElement("DIV");
	li.innerText = item;
	li.classList.add("li");
	return li;
};

const getStyle = function() {
	const style = document.createElement("STYLE");
	style.textContent = `
	#container {
		border: 1px solid var(--colour-orange-interactive);
		border-radius: 0.3em;
		box-shadow: 0 0 0.3em 0.3em var(--colour-orange-interactive-glow),
	          inset 0 0 0.3em 0.3em var(--colour-orange-interactive-glow);
		box-sizing: border-box;
		color: var(--colour-orange-interactive);
		display: inline-block;
		font-size: var(--font-size-tab);
		font-weight: bold;
		margin: 0 0 auto 0;
		padding: 0.2em 0.4em;
		position: relative;
	}
	
	#header:hover {
		color: var(--colour-orange-hovered);
		cursor: pointer;
	}
	
	#master {
		box-sizing: border-box;
		display: block;
		max-height: 0;
		overflow-y: auto;
		padding-right: 20px;/* for scrollbar */
		position: relative;
		visibility: hidden;
	}
	.active #master {
		max-height: 10em;
		visibility: visible;
		margin-top: 0.3em;
		padding-top: 0.3em;
		border-top: 0.1em solid var(--colour-orange-interactive);
	}
	
	#doppelganger {
		margin-top: 0.3em;
		padding-top: 0.3em;
		border-top: 0.1em solid var(--colour-orange-interactive);
	}
	
	#master .li:hover,
	#doppelganger .li:hover {
		color: var(--colour-orange-hovered);
		cursor: pointer;
	}
	
	#master .li.selected,
	#doppelganger .li.selected {
		color: rgb(0, 220, 80);
	}
	
	#master .li.selected:hover,
	#doppelganger .li.selected:hover {
		color: rgb( 255, 60, 0);
	}
	
	#doppelganger .li.selected {
		display: block;
	}
	#doppelganger .li:not(.selected) {
		display: none;
	}
	`;
	return style;
};

//close other multiselects and toggle the one clicked
const setActive = function(e) {
	const container = e.target.parentElement;
	const isActive = container.classList.contains("active");
	
	Array.from(document.getElementsByClassName("multiselect"))
		.map(m => m.shadowRoot.getElementById("container") )
		.forEach(function(c) { c.classList.remove("active"); });
		
	if(!isActive) { container.classList.add("active"); }
}

const toggleSelectDoppel = function(e) {
	const container = e.target.parentElement.parentElement;
	const ulMaster = Array.from(container.childNodes)
		.filter(node => node.id === "master")[0];
	const liMaster =
		Array.from(ulMaster.getElementsByClassName("li"))
		.filter(li => li.innerText === e.target.innerText)[0];
		
	e.target.classList.remove("selected");
	liMaster.classList.remove("selected");
};

const toggleSelectMaster = function(e) {
	const container = e.target.parentElement.parentElement;
	const ulDoppel = Array.from(container.childNodes)
		.filter(node => node.id === "doppelganger")[0];
	const liDoppel =
		Array.from(ulDoppel.getElementsByClassName("li"))
		.filter(li => li.innerText === e.target.innerText)[0];
		
	if(e.target.classList.contains("selected")) {
		e.target.classList.remove("selected");
		liDoppel.classList.remove("selected");
	} else {
		e.target.classList.add("selected");
		liDoppel.classList.add("selected");
	}
};

