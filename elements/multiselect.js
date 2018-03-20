let createListItem = function(val) {
	let li = document.createElement("DIV");
	li.classList.add("li");
	
	let label = document.createElement("LABEL");
	
	let checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.value = val;
	
	label.appendChild(checkbox);
	label.innerHTML += val;
	
	li.appendChild(label);
	return li;
};

let createMultiselect = function(name, values) {
	let container = document.createElement("DIV");
	container.id = name.toLowerCase();
	container.classList.add("multiselect");
	
	let anchor = document.createElement("SPAN");
	anchor.classList.add("anchor");
	anchor.innerHTML = name;
	container.appendChild(anchor);
	
	let ul = document.createElement("DIV");
	ul.classList.add("ul");
	
	values
		.map(val => createListItem(val))
		.forEach(item => ul.appendChild(item));
	
	anchor.onclick = setActive;
	
	container.appendChild(ul);
	return container;
};

let addControls = function() {
	let options = [
		createMultiselect("Activities", activities),
		createMultiselect("Archetype",  archetype),
		createMultiselect("Commitment", commitment),
		createMultiselect("Languages", languages),
		createMultiselect("Roleplay",   roleplay),
		createMultiselect("Recruiting", recruiting)
	];
	
	options.forEach(element => holder.appendChild(element));
	let multiselects = Array.from(document.getElementsByClassName("multiselect"));
	multiselects.forEach(widenIfScrollbar);
};

let removeActive = function(element){
	element.classList.remove("active");
};

let setActive = function(event) {
	//clicked to close an open multiselect
	if(event.target.classList.contains("active")){
		removeActive(event.target);
		return;
	}
	
	//clicked other multiselect
	let current = document.getElementsByClassName("active");
	[].forEach.call(current, removeActive);
	
	event.target.classList.add("active");
}

let widenIfScrollbar = function(multiselect){
	let anchor = multiselect.getElementsByClassName("anchor")[0];
	
	anchor.classList.add("active");
	if(multiselect.scrollHeight > multiselect.clientHeight){
		multiselect.style.width = parseFloat(multiselect.clientWidth) + 17 + "px";
	}
	anchor.classList.remove("active");
};

let holder = document.getElementById("controls-holder");

let activities = [
	"Bounty Hunting",
	"Engineering",
	"Exploration",
	"Freelancing",
	"Infiltration",
	"Piracy",
	"Resources",
	"Scouting",
	"Security",
	"Smuggling",
	"Social",
	"Trading",
	"Transport"
];

let archetype = [
	"Corporation",
	"Faith",
	"Organization",
	"PMC",
	"Syndicate"
];

let commitment = [
	"Casual",
	"Hardcore",
	"Regular"
];

let languages = [
	"Abkhazian",
	"Amharic",
	"Afar",
	"Afrikaans",
	"Akan",
	"Albanian",
	"Arabic",
	"Aragonese",
	"Armenian",
	"Assamese",
	"Avaric",
	"Avestan",
	"Aymara",
	"Azerbaijani",
	"Bambara",
	"Bashkir",
	"Basque",
	"Belarusian",
	"Bengali",
	"Bihari languages",
	"Bislama",
	"Bokmål, Norwegian",
	"Bosnian",
	"Breton",
	"Bulgarian",
	"Burmese",
	"Catalan",
	"Central Khmer",
	"Chamorro",
	"Chechen",
	"Chichewa",
	"Chinese",
	"Church Slavic",
	"Chuvash",
	"Cornish",
	"Corsican",
	"Cree",
	"Croatian",
	"Czech",
	"Danish",
	"Dutch",
	"Dzongkha",
	"English",
	"Esperanto",
	"Estonian",
	"Ewe",
	"Faroese",
	"Fijian",
	"Finnish",
	"French",
	"Fulah",
	"Gaelic",
	"Galician",
	"Ganda",
	"Georgian",
	"German",
	"Greek, Modern",
	"Guarani",
	"Gujarati",
	"Haitian Creole",
	"Hausa",
	"Hebrew",
	"Herero",
	"Hindi",
	"Hiri Motu",
	"Hungarian",
	"Icelandic",
	"Ido",
	"Igbo",
	"Indonesian",
	"Interlingua",
	"Interlingue",
	"Inuktitut",
	"Inupiaq",
	"Irish",
	"Italian",
	"Japanese",
	"Javanese",
	"Kalaallisut",
	"Kannada",
	"Kanuri",
	"Kashmiri",
	"Kazakh",
	"Kikuyu",
	"Kinyarwanda",
	"Kirghiz",
	"Komi",
	"Kongo",
	"Korean",
	"Kuanyama",
	"Kurdish",
	"Lao",
	"Luba-Katanga",
	"Latin",
	"Latvian",
	"Limburgan",
	"Lingala",
	"Lithuanian",
	"Luxembourgish",
	"Macedonian",
	"Malagasy",
	"Malay",
	"Malayalam",
	"Maldivian",
	"Maltese",
	"Manx",
	"Maori",
	"Marathi",
	"Marshallese",
	"Mongolian",
	"Nauru",
	"Navajo",
	"Ndebele, North",
	"Ndebele, South",
	"Ndonga",
	"Nepali",
	"Northern Sami",
	"Norwegian",
	"Nynorsk, Norwegian",
	"Occitan",
	"Ojibwa",
	"Oriya",
	"Oromo",
	"Ossetian",
	"Pali",
	"Panjabi",
	"Persian",
	"Polish",
	"Portuguese",
	"Pushto",
	"Quechua",
	"Romanian",
	"Romansh",
	"Rundi",
	"Russian",
	"Samoan",
	"Sango",
	"Sanskrit",
	"Sardinian",
	"Serbian",
	"Shona",
	"Sichuan Yi",
	"Sindhi",
	"Sinhala",
	"Slovak",
	"Slovenian",
	"Somali",
	"Sotho, Southern",
	"Spanish",
	"Sundanese",
	"Swahili",
	"Swati",
	"Swedish",
	"Tagalog",
	"Tahitian",
	"Tajik",
	"Tamil",
	"Tatar",
	"Telugu",
	"Thai",
	"Tibetan",
	"Tigrinya",
	"Tonga",
	"Tsonga",
	"Tswana",
	"Turkish",
	"Turkmen",
	"Twi",
	"Uighur",
	"Ukrainian",
	"Urdu",
	"Uzbek",
	"Venda",
	"Vietnamese",
	"Volapük",
	"Walloon",
	"Welsh",
	"Western Frisian",
	"Wolof",
	"Xhosa",
	"Yiddish",
	"Yoruba",
	"Zhuang",
	"Zulu"
];

let recruiting = [
	"Yes",
	"No"
];

let roleplay = [
	"Yes",
	"No"
];

