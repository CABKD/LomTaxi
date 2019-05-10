angular.module('ngApp')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {
  //url: 'http://127.0.0.1:8100/api' */
	/* url: 'https://www.lifeonmaps.com/api', 
	urlUpload: "https://www.lifeonmaps.com/upload",
	urlImages: "https://www.lifeonmaps.com/uploads",
	broker: 'www.lifeonmaps.com', */
	url: 'https://dev.zlool.com/api', 
	urlUpload: "https://dev.zlool.com/upload",
	urlImages: "https://dev.zlool.com/uploads",
	broker: 'dev.zlool.com',
	mqttPort: '8081'	
});
