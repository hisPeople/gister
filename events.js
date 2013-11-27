var filename = null;
var description = null;
var content = null;
var mode = null;
var public = false;
var cmirror = null;

console.log('background page')

function setData(data) {
	alert(data);
	filename = data.filename;
	description = data.description;
	content = data.content;
	mode = data.mode;
	public = data.public;
	cmirror = data.cmirror;
}

function getData() {
	var data = {
		'filename': filename,
		'description': description,
		'content': content,
		'mode': mode,
		'public': public,
		'cmirror': cmirror
	}
	return data;
}