var gists = angular.module('gistApp', ['ngResource']);

gists.factory('Gist', function($resource) {
	return $resource('https://api.github.com/gists',{})
});

gists.controller('AppCtrl', ['$scope', 'Gist', function($scope, Gist) {
	$scope.description = '';
	$scope.filename = '';
	$scope.content = '';
	$scope.filenamestring = function() {
		return '"' + $scope.filename + '"';
	} 

	$scope.savegist = function() {
		console.log('clicked')
		var file = {};
		file[$scope.filename] = {"content": cmirror.getValue()}

		var gist = new Gist();
		gist.description = $scope.description;
		gist.public = true;
		gist.files = file;
		console.log(gist);
		gist.$save().then(function(resp) {
			$scope.url = resp['html_url'];
		});
	}
}]);

window.onload = function() {
	defLang = localStorage["default_language"];
	console.log(localStorage)
	console.log(defLang)
	var modescript = document.createElement("script");
	modescript.type = "text/javascript"
	modescript.src = "codemirror/mode/" + defLang + "/" + defLang + ".js"
	document.body.appendChild(modescript)
	cmirror = CodeMirror.fromTextArea(codecontent, {
	     mode: "python",
	     lineNumbers: true
    });
    $(cmirror).focus()
}