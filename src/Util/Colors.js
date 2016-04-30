module.exports = {
	getColorSchema:function(url){
		var img = new Image();
		img.src = url;
		var colorThief = new ColorThief();
		var dominantColor = colorThief.getColor(img);
		var palette = colorThief.getPalette(img);
		return {
			dominantColor:dominantColor,
			palette:palette
		}
	}
}
