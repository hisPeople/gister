if(localStorage['oauth2_github'] && $.parseJSON(localStorage['oauth2_github']).accessToken) {
	var oauth2_github = $.parseJSON(localStorage['oauth2_github']);
	var accessToken = oauth2_github.accessToken;
} else {
	var githubAuth = new OAuth2('github', {
		client_id: 'fd73a3d2274ee7dc2d59',
		client_secret: '328dd08f528d99b715f6e55732f3cd66d7bdb4ec',
		api_scope: 'gist'
	});

	githubAuth.authorize(function() {
		var token = githubAuth.getAccessToken();
	});
}

var gists = angular.module('gistApp', ['ngResource', 'ui.ace']);

gists.factory('Gist', function($resource) {
	return $resource('https://api.github.com/gists?access_token=' + accessToken, {}, {
		'getGists': {method:'GET', isArray:true, responseType:'json'}
	})
});

gists.controller('AppCtrl', ['$scope', 'Gist', '$resource', function($scope, Gist, $resource) {
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
	// $scope.cmirror = null;
	$scope.public = false;
	$scope.tags = {};

	var query = Gist.getGists(function (response) {
		angular.forEach(response, function(item, index) {
			var innergist = {}
			angular.forEach(item, function(val, key) {
				if (key == 'description') {
					parseTags(val, item);
				}
			})
		})
	});

	var tags = [];
	var categories = [];
	var hashtagPattern = /(^|\s)#([^\s]+)/g;

	var parseTags = function(desc, obj) {
		if(desc != '') {
			tags = desc.match(hashtagPattern);
			if (tags != null) {
				// console.log(desc)
				// console.log(tags)
				createTags(tags, obj);
				// console.log(obj)
			}
		}
	}

	var createTags = function(tags, obj) {
		// console.log("TAGS " + tags)
		for (var t in tags) {
			var tag = tags[t]
			// console.log(tag)
			var trimmedtag = $.trim(tag);
			// console.log(trimmedtag)
			var dehashedtag = trimmedtag.replace('#', '')
			// console.log(tags[t] + ' ==> ' + dehashedtag)

			if(!$scope.tags[dehashedtag]) {
				console.log(dehashedtag + " was not found... creating tag")
				$scope.tags[dehashedtag]= []
			} else {
				console.log(dehashedtag + " was found")
			}

			$scope.tags[dehashedtag].push(obj)
			// console.log("tags." + dehashedtag + ": " + $scope.tags[dehashedtag])
		}
		// console.log($scope.tags)
	}

	console.log($scope.tags)

	$scope.showExtras = function() {
		$('#filename').toggle();
		$('#description').toggle();
	}

	$scope.popout = function() {
		chrome.windows.create(
			{
				type: 'popup',
				focused: true,
				url: 'popup.html',
				width: 415,
				height:425
			}	
		)
	}

	$scope.aceLoaded = function(editor) {
		var renderer = editor.renderer;

		editor.setReadOnly(false);
		renderer.setShowGutter(true);
	}

	// $scope.editorOptions = {
	// 	lineNumbers: true,
	// 	mode: defLang,
	// 	autofocus: true,
	// 	onLoad: function(cm) {
	// 		$scope.cmirror = cm;
	// 		$scope.modeChanged = function() {
	// 			if ($.inArray($scope.mode, clikelangs) > -1) {
	// 				cm.setOption("mode", "clike");
	// 			} else {
	// 				cm.setOption("mode", $scope.mode);
	// 			}
	// 			cm.focus();
	// 		};
	// 		$scope.cmirror.focus();
	// 	}
	// };

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
			$scope.tags = {};
			var query = Gist.getGists(function (response) {
				angular.forEach(response, function(item, index) {
					var innergist = {}
					angular.forEach(item, function(val, key) {
						if (key == 'description') {
							parseTags(val, item);
						}
					})
				})
			});
		});
	}
}]);