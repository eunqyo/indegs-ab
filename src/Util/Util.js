module.exports = {
	getParsedDate:function(string){
		var date = new Date(string);
		var year = date.getFullYear();
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var sign,month;
		if(hour==0){
			hour = 12;
			sign = 'AM';
		} else if(hour>12){
			hour = (hour-12)
			sign = 'PM';
		} else if(hour<12){
			sign = 'AM';
		} else if(hour==12){
			sign = 'PM'
		};
		if(minute<10){
			minute = '0' + minute;
		}
		switch((date.getMonth()+1).toString()){
			case '1':
				month = 'Jan'
				break;
			case '2':
				month = 'Feb'
				break;
			case '3':
				month = 'Mar'
				break;
			case '4':
				month = 'Apr'
				break;
			case '5':
				month = 'May'
				break;
			case '6':
				month = 'Jun'
				break;
			case '7':
				month = 'Jul'
				break;
			case '8':
				month = 'Aug'
				break;
			case '9':
				month = 'Sept'
				break;
			case '10':
				month = 'Oct'
				break;
			case '11':
				month = 'Nov'
				break;
			case '12':
				month = 'Dec'
				break;
			default:
				return true;
		}
		var res = hour + ':' + minute + ' ' + sign + ' - ' + day + ' ' + month + ' ' + year;
		return res;
	}
}