angular.module('ngApp')

.service('WS', function($q, $http, API_ENDPOINT) {

   var  collectionSchema = function(collection) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + "/"+collection).then(function(result) {
                if (result.data.success) {
                    var schema = {
                        'rows' : [] 
                    };
                    schema.name=collection;
                    angular.forEach(result.data.msg, function(value, key) {
                        if(value.options.front) {
                            var row = {}
                            row.name = key;
                            row.required = value.options.required;
                            row.update = value.options.front.update;
                            row.display = value.options.front.display;
                            row.displayName =  value.options.front.displayName;
                            row.type = value.options.front.type;
                            if(value.options.front.min) {
                                row.min = value.options.front.min;
                            }
                            if(value.options.front.max) {
                                row.max = value.options.front.max;
                            }
                            if(value.options.front.enum && row.type == 'select') {
                                row.enum = value.options.front.enum;
                            }
                            schema.rows.push(row);
                        }
                    });

                    resolve(schema);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
   var  collectionRead = function(collection, data, i) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + "/"+collection+"/read",data).then(function(result) {
                if (result.data.success) {
                    if(i != undefined) {
                        result.data.msg[0] = i;
                        resolve(result.data.msg);
                    }else{
                        resolve(result.data.msg);
                    }
                } else {
                     reject(result.data.msg);
                }
            });
        });
    };
     var  collectionId = function(collection, data) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + "/"+collection+"/id",data).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
   var  collectionNew = function(collection, data) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + "/"+collection+"/create", data).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
   var  collectionDelete = function(collection, data) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + "/"+collection+"/delete", data).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
   var  collectionUpdate = function(collection, data) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + "/"+collection+"/update", data).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
    var  collectionFind = function(collection, data) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + "/"+collection+"/find",data).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
  return {
        collectionSchema: collectionSchema,
        collectionNew: collectionNew,
        collectionRead: collectionRead,
        collectionDelete: collectionDelete,
        collectionUpdate: collectionUpdate,
        collectionId: collectionId,
        collectionFind: collectionFind,
//    isAuthenticated: function() {return isAuthenticated;},
  };
});

