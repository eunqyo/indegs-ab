module.exports = {
	getColorSchema:function(url,callback){
		var img = new Image();
		img.onload = function(){
			var colorThief = new ColorThief();
			var dominantColor = colorThief.getColor(img);
			var palette = colorThief.getPalette(img);
			callback({
				dominantColor:dominantColor,
				palette:palette
			})
		}
		img.src = url;

	}
}
