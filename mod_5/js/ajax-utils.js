(function(global){
	var ajaxutil={};

	function getRequestObject(){
		if(global.XMLHttpRequest){
			return(new XMLHttpRequest());
		}
		else if(global.ActiveXOject){
			return(new ActiveXObject("Microsoft.XMLHTTP"));
		}
		else{
			console.log("Ajax not supported");
			return(null)
		}
	}
	ajaxutil.sendRequest=function(requestUrl,responseHandler,isJSON){
		var request = getRequestObject();
		request.onreadystatechange=function(){
			if(isJSON==undefined){
				isJSON=true;
			}		
			handleResponse(request,responseHandler,isJSON)
		}
        request.open("GET",requestUrl,true);
        request.send(null);
	}
	function handleResponse(request, responseHandler,isJSON){
		if((request.status==200)&&(request.readyState==4)){
			if(isJSON==true){
				responseHandler(JSON.parse(request.responseText));
			}
			else{
				responseHandler(request.responseText);
			}
			}
	}
	global.$ajaxutil=ajaxutil;
})(window);