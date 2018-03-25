export { Create };

const Create = function(name, id) {
	const newTab = document.createElement("div");
	newTab.classList.add("tab");
	newTab.id = "tab-" + id;
	newTab.innerHTML = name;
	return newTab;
};
