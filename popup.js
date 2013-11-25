var gists = angular.module('gistApp', ['ngResource', 'ui.codemirror']);

gists.factory('Gist', function($resource) {
	return $resource('https://api.github.com/gists',{})
});

gists.controller('AppCtrl', ['$scope', 'Gist', function($scope, Gist) {

	$scope.modes = ['Python', 'Java', 'Javascript', 'Ruby', 'Markdown'];
	$scope.mode = $scope.modes[0];

	$scope.description = '';
	$scope.filename = '';
	$scope.content = '';
	console.log($scope.mode)

	$scope.editorOptions = {
		lineNumbers: true,
		onLoad: function(cm) {
			$scope.modeChanged = function() {
				console.log($scope.mode)
				cm.setOption("mode", $scope.mode.toLowerCase());
			};
		}
	};

	$scope.filenamestring = function() {
		return '"' + $scope.filename + '"';
	} 

	$scope.savegist = function() {
		console.log('clicked')
		var file = {};
		file[$scope.filename] = {"content": $scope.content}

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

// window.onload = function() {
// 	defLang = localStorage["default_language"];
// 	console.log(localStorage)
// 	console.log(defLang)
// 	var modescript = document.createElement("script");
// 	modescript.type = "text/javascript"
// 	modescript.src = "codemirror/mode/" + defLang + "/" + defLang + ".js"
// 	document.body.appendChild(modescript)
// 	cmirror = CodeMirror.fromTextArea(codecontent, {
// 	     mode: "python",
// 	     lineNumbers: true
//     });
//     $(cmirror).focus()
// }