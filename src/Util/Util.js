module.exports = {
	sortByDate:function(a,b){
		var aTime = new Date(a.date).getTime();
		var bTime = new Date(b.date).getTime();
		if(aTime < bTime){return 1}
		if(aTime > bTime){return -1}
		return 0;
	}
}