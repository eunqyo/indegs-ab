module.exports = {
	validateImageFromFile:function(e){
		var self = this;
		var nativeEvent = e.nativeEvent;


		if(nativeEvent.dataTransfer.files[0]!=null){
			// 로컬에서 가져온 파일이다
			var file = nativeEvent.dataTransfer.files[0];
			var url = URL.createObjectURL(file);
			self.validateImageFromUrl(url,function (result){
				return result;
			})
		} else {
			// 브라우저에서 가져온 파일이다
			var eventUrl = nativeEvent.dataTransfer.getData(nativeEvent.dataTransfer.types[0]);
			var eventText = nativeEvent.dataTransfer.getData('text/plain');
			console.log(eventText)

			self.validateImageFromUrl(url,function (result){
				if(result.status) return result;

				try {
					var eventHtml = nativeEvent.dataTransfer.getData('text/html');
					console.log(eventHtml)
					var	object = $('<div/>').html(eventHtml).contents();
		            if(object){
	                    var url = object.closest('img').prop('src');
	                    console.log(url)
	                    self.validateImageFromUrl(url,function (result){
	                    	console.log(result)
	                    })
		            }
				} catch(_error) {};
			})			
		}


		// var isFromLocal,isFromBrowser;
		// var nativeEvent = e.nativeEvent;
		// var localFile = nativeEvent.dataTransfer.files[0];
		// if(localFile != null){
		// 	var tmpPath = URL.createObjectURL(localFile);
		// 	self.checkImage(tmpPath,function (res){
		// 		if(res.status){
		// 			self.props.onLocalSuccess(localFile,res.body);
		// 		} else {
		// 			self.props.onLocalFailure(localFile);
		// 		}
		// 	});
		// } else {
		// 	// 브라우저에서 가져온 경우
		// 	var url = nativeEvent.dataTransfer.getData(nativeEvent.dataTransfer.types[0]);
		// 	var html = nativeEvent.dataTransfer.getData('text/html');
		// 	var text = nativeEvent.dataTransfer.getData('text/plain');
		// 	console.log(html);
		// 	console.log(text);
		// 	self.checkImage(url,function (res){
		// 		if(res.status){
		// 			self.props.onBrowserSuccess(res.body);
		// 		} else {
		// 			self.props.onBrowserFailure(url);
		// 		}
		// 	})
		// }
	},
	validateImageFromUrl:function(url,callback){
		var timeout = 5000;
	    var timedOut = false, timer;
	    var img = new Image();
	    img.onerror = img.onabort = function() {
	        if (!timedOut) {
	            clearTimeout(timer);
	            callback({status:false});
	        }
	    };
	    img.onload = function() {
	    	var image = this;
	        if (!timedOut) {
	            clearTimeout(timer);

	            var res = {
	            	status:true,
	            	body:{
		            	url:url,
		            	width:image.width,
		            	height:image.height
	            	}
	            }

	            callback(res);
	        }
	    };
	    img.src = url;
	}
}