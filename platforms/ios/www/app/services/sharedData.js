angular.module("ngApp").service("shared", function(){ 

    this.global = {
        mqttClient:0,
        mqttClientIsConnected:false,
        mqttReceivedMessage:"",
        macAddress:"unknown",
        sendBrokerPeriodList : 
        	[
              {"val":10,		"displayVal":"10 ms"},
              {"val":50,		"displayVal":"50 ms"},
              {"val":100,		"displayVal":"100 ms"},
              {"val":200,		"displayVal":"200 ms"},
              {"val":500,		"displayVal":"500 ms"},
              {"val":1000,	"displayVal":"1 s"},
              {"val":5000,	"displayVal":"5 s"}
              ],
       
       brokerHostList :
    	    [
    	    /*  {"val":"www.lifeonmaps.com"},
             {"val":"www.lifeonmaps.com"} */
             {"val":"dev.zlool.com"},
             {"val":"dev.zlool.com"}
            
    	    ],
  	 settings:
  	 	{
               /* "brokerHost" : "www.lifeonmaps.com", */
               "brokerHost" : "dev.zlool.com",  
  		 	"defaultLat":48.576244,  
  		 	"defaultLng":7.807807,
  		 	"defaultPos":false,
  		 	"idVehicle":"56591",
    		"control":1,
         },
		customer: {},
         
        //driverActif : false,
        shuttleActif:false
		 
    };
});

