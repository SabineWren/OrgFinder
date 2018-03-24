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

const createMultiselect = function(name, values) {
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

const addControls = function() {
	const options = Object.freeze([
		createMultiselect("Activities", activities),
		createMultiselect("Archetype",  archetype),
		createMultiselect("Commitment", commitment),
		createMultiselect("Languages", languages),
		createMultiselect("Roleplay",   roleplay),
		createMultiselect("Recruiting", recruiting)
	]);
	
	options.forEach(element => holder.appendChild(element));
	return options;
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

const holder = document.getElementById("controls-holder");

const activities = [
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

const archetype = [
	"Corporation",
	"Faith",
	"Organization",
	"PMC",
	"Syndicate"
];

const commitment = [
	"Casual",
	"Hardcore",
	"Regular"
];

const languages = Object.freeze([
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
]);

const recruiting = Object.freeze([
	"Yes",
	"No"
]);

const roleplay = Object.freeze([
	"Yes",
	"No"
]);

