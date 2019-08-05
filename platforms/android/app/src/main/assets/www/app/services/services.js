angular.module('ngApp')

.service('AuthService', function($q, $http, API_ENDPOINT, shared) {
  var LOCAL_TOKEN_KEY = 'TokenKey';
  var LOCAL_USER_KEY = 'UserKey';
  var isAuthenticated = false;
  var config= {
		firstname		: "",
		lastname		: "",
		email	 		: "",
		phone			: "",
		avatar			: "",
		id				: "",
    customerId		: "",
    code : ""
  }			
  var HTTP_TIMEOUT = 3000;	
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token, customerId, firstname, lastname, phone, email, avatar, id,code) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    config.firstname 	= firstname;
    config.lastname 	= lastname;
    config.phone 		= phone;
    config.email	 	= email;
    config.avatar	 	= avatar;
    config.id			= id;
    config.customerId		= customerId;
    config.code		= code;
    window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(config));
    setCookie("v_user", email, 30);    
    
    useCredentials(token);
  }

  function useCredentials(token ) {
    isAuthenticated = true;
    authToken = token;
    config = JSON.parse(window.localStorage.getItem(LOCAL_USER_KEY));
    shared.global.customer = config;
   

    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    userRole = 0;
    userName = "";
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    window.localStorage.removeItem(LOCAL_USER_KEY);
  }

  var register = function(user) {
   
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/customersignup', user, { timeout: HTTP_TIMEOUT })
      	.then(function(result) {
        if (result.data.success) {
            storeUserCredentials(result.data.token, result.data.customerId,  result.data.firstname, result.data.lastname, result.data.phone, result.data.email, result.data.avatar,  result.data._id,result.data.code);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      },
      function(result){
    	  reject("Can't register");
      });
    });
  };

  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/customerauthenticate', user,{ timeout: HTTP_TIMEOUT })
      .then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token, result.data.customerId,  result.data.firstname, result.data.lastname, result.data.phone, result.data.email, result.data.avatar, result.data._id);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      },
      function(result){
    	  reject("Can't login");
      });
    });
  };

  var logout = function() {
       destroyUserCredentials();
  };

 var forgot = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/forgot', user).then(function(result) {
        if (result.data.succes) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
  loadUserCredentials();

  return {
    login: login,
    register: register,
    logout: logout,
    forgot: forgot,
    isAuthenticated: function() {return isAuthenticated;},
    userAvatar : function() {
    	var avatar = config.avatar;
    	if(avatar) {
    		return ( avatar);
    	}
        return( "");
    },
    userFirstName: function() {
    	var name = config.firstname;
    	if(name) {
    		return ( name);
    	}
        return( "");
    },
    userLastName: function() {
    	var name = config.lastname;
    	if(name) {
    		return ( name);
    	}
        return( "");
    },
    userEmail: function() {
    	var email = config.email;
    	if(email) {
    		return ( email);
    	}
        return( "");
    },
    userPhone: function() {
    	var email = config.phone;
    	if(email) {
    		return ( email);
    	}
        return( "");
    },
    userId: function() {
    	var id = config.id;
    	if(id) {
    		return ( id);
    	}
        return( "");
    },
    customerId: function() {
    	var id = config.customerId;
    	if(id) {
    		return ( id);
    	}
        return( "");
    },
    code: function() {
    	var code = config.code;
    	if(code) {
    		return ( code);
    	}
        return( "");
    },
  };
  
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
