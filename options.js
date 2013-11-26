function save_options() {
	var select = document.getElementById("def-lang");
	var defLang = select.children[select.selectedIndex].value.toLowerCase();
	console.log("default_language: " + defLang)
	localStorage["default_language"] = defLang;

	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
	status.innerHTML = "";
	}, 750);
}

function restore_options() {
	var defLang = localStorage["default_language"];
	if (!defLang) {
		return;
	}
	var select = document.getElementById("defLang");
	for(var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == defLang) {
			child.selected = "true";
			break;
		}
	}
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);