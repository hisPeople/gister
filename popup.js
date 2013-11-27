if(localStorage['oauth2_github'] && $.parseJSON(localStorage['oauth2_github']).accessToken) {
	var oauth2_github = $.parseJSON(localStorage['oauth2_github']);
	var accessToken = oauth2_github.accessToken;
	console.log(accessToken)
} else {
	var githubAuth = new OAuth2('github', {
		client_id: 'fd73a3d2274ee7dc2d59',
		client_secret: '328dd08f528d99b715f6e55732f3cd66d7bdb4ec',
		api_scope: 'gist'
	});

	githubAuth.authorize(function() {
		// ready to go. let's get the access token
		var token = githubAuth.getAccessToken();
		console.log(token)
	});
}


for (var i = 0; i < localStorage.length; i++) {
	console.log(localStorage[i])
}

var gists = angular.module('gistApp', ['ngResource', 'ui.codemirror']);

gists.factory('Gist', function($resource) {
	return $resource('https://api.github.com/gists?access_token=' + accessToken,{})
});

gists.controller('AppCtrl', ['$scope', 'Gist', function($scope, Gist) {
	$('#filename').hide()
	$('#description').hide()
	fileExtensions = {'python': 'py', 'javascript': 'js', 'java': 'java', 'c': 'c', 'c++': 'cpp', 'c#': 'cs', 'markdown': 'md', 'ruby': 'rb'}
	defLang = localStorage["default_language"]
	var clikelangs = ['java', 'c', 'c++', 'c#']
	$scope.modes = ['python', 'java', 'javascript', 'ruby', 'c', 'c++', 'c#', 'markdown'];
	defLangIndex = $.inArray(defLang, $scope.modes);
	if(defLangIndex > -1) {
		$scope.mode = $scope.modes[defLangIndex].toLowerCase();
	} else {
		$scope.mode = $scope.modes[0].toLowerCase();
	}

	$scope.description = '';
	$scope.filename = '';
	$scope.content = '';
	$scope.cmirror = null;
	$scope.public = false;

	$scope.showExtras = function() {
		$('#filename').toggle();
		$('#description').toggle();
	}

	$scope.editorOptions = {
		lineNumbers: true,
		mode: defLang,
		autofocus: true,
		onLoad: function(cm) {
			$scope.cmirror = cm;
			$scope.modeChanged = function() {
				if ($.inArray($scope.mode, clikelangs) > -1) {
					cm.setOption("mode", "clike");
				} else {
					cm.setOption("mode", $scope.mode);
				}
				cm.focus();
			};
			console.log('cmirror loaded');
			console.log($scope.cmirror)
			$scope.cmirror.focus();
		}
	};

	var getFileExtension = function(mode) {
		return fileExtensions[mode]
	}

	$scope.savegist = function() {
		var file = {};
		if ($scope.filename == '') {
			ext = getFileExtension($scope.mode)
			$scope.filename = 'mygist.' + ext;
		}
		file[$scope.filename] = {"content": $scope.content}

		var gist = new Gist();
		gist.description = $scope.description;
		gist.public = $scope.public;
		gist.files = file;
		gist.$save().then(function(resp) {
			$scope.url = resp['html_url'];
		});
	}
}]);