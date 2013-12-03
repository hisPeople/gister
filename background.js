// var oauth = ChromeExOAuth.initBackgroundPage({
// 	'request_url': "https://github.com/login/oauth/authorize"
// 	'authorize_url': <OAuth authorize URL>,
// 	'access_url': <OAuth access token URL>,
// 	'consumer_key': 'fd73a3d2274ee7dc2d59',
// 	'consumer_secret': '328dd08f528d99b715f6e55732f3cd66d7bdb4ec',
// 	'scope': 'gist',
// });

chrome.browserAction.onClicked.addListener(function() {
	chrome.windows.create(
			{
				type: 'popup',
				focused: true,
				url: 'popup.html',
				width: 415,
				height:425
			}	
		)
})