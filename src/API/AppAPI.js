var credentials = require('../../credentials.js');
var AppAction = require('../Action/AppAction.js');
var AppStore = require('../Store/AppStore.js');
import AppHistory from '../Util/AppHistory';

module.exports = {
	receiveUser:function(_id){
		$.ajax({
			url: credentials.api_server + '/users/'+_id,
			type: 'GET',
			success:function(result){
				if(result.status){
					AppAction.updateUser(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	receiveAB:function(id){
		var data = {'card_id':id}
		$.ajax({
			url:credentials.api_server + '/cards/'+id,
			type:'GET',
			data:data,
			dataType:'json',
			success:function(result){
				var AB = result.data;
				AB.imageA = JSON.parse(result.data.imageA)
				AB.imageB = JSON.parse(result.data.imageB)
				AppAction.sendAB(AB)
			}
		})
	},
	getSession:function(){
		$.ajax({
			url:credentials.host_server + '/users/session',
			type:'GET',
			success:function(result){
				if(result.status){
					AppAction.updateSession(result.body)
				} else {
					AppAction.updateSession(result.body)
				}
			}
		})
	},
	updateSession:function(session){
		var data = session;
		$.ajax({
			url:credentials.host_server + '/users/session',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					AppAction.updateSession(result.body)
				}
			}
		})
	},
	handleLogin:function(data,callback){
		var self = this;
		$.ajax({
			url: credentials.api_server + '/users/login',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(result){
				if(result.status){
					self.updateSession(result.body)
				} else {
					callback(result.message)
				}
			}
		});
	},
	handleSignout:function(){
		$.ajax({
			url: credentials.host_server + '/users/logout',
			type: 'POST',
			success: function(result){
				if(result.status){
					AppAction.updateSession(null)
				}
			}
		});
	},
	checkEmail:function(email,callback){
		var data = {'email':email}
		$.ajax({
			url:credentials.api_server + '/users/email',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					callback(result.message)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	checkName:function(name,callback){
		var data = {'name':name}
		$.ajax({
			url:credentials.api_server + '/users/name',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					callback(result.message)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	handleJoin:function(json){
		var self = this;
	    var data = {
	        'email':json.email,
	        'name':json.name,
	        'pw':json.pw,
	        'age':json.age,
	    };
		if(json.sex.toLowerCase() == "male"){
			data.sex = 0
		} else {
			data.sex = 1
		};

	    $.ajax({
	    	url:credentials.api_server + '/users/join',
	    	type:'POST',
	    	data:data,
	    	dataType:'json',
	    	success:function(result){
	    		if(result.status){
	    			var json = {};
	    			json.email = result.body.email;
	    			json.pw = result.body.pw;
	    			self.handleLogin(json)
	    			// AppAction.updateSession(result.body)
	    			AppHistory.push('/')
	    		} else {
	    			console.log(result.body)
	    		}
	    	}
	    })
	},
	updatePublished:function(cardObj){
		var self = this;
		var data = {
			date:cardObj.date,
			card_id:cardObj._id,
			session_id:cardObj.author._id
		}
		$.ajax({
			url:credentials.api_server + '/users/published',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					self.updateSessionByPublished(result.body)
				} else {
					console.log(result.body)
				}
			}

		})
	},
	updateSessionByPublished:function(published){
		var data = {
			published:JSON.stringify(published)
		}
		$.ajax({
			url:credentials.host_server + '/users/published',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					AppAction.updateSession(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	addParticipated:function(session_id,card_id){
		var self = this;
		var data = {
			session_id:session_id,
			card_id:card_id
		}
		$.ajax({
			url:credentials.api_server + '/users/participate',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					self.updateParticipated(result.body)
				} else {
					console.log(result.body)
				}
			}
		})
	},
	removeParticipated:function(session,card_id){
		var self = this;
		var participated = session.participated;
		for(var i=0;i<participated.length;i++){
			if(participated[i].card == card_id){
				participated.splice(i,1);
				break;
			}
		}
		var data = {
			session_id:session._id,
			participated:JSON.stringify(participated)
		}
		$.ajax({
			url:credentials.api_server + '/users/participate/remove',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					self.updateParticipated(result.body)
				}
			}
		})
	},
	updateUserPic:function(pic){
		var data = {
			pic:pic
		}
		$.ajax({
			url:credentials.host_server + '/users/pic',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					AppAction.updateSession(result.body)
				}
			}
		})
	},
	updateParticipated:function(participated){
		var data = {
			participated:JSON.stringify(participated)
		}
		$.ajax({
			url:credentials.host_server + '/users/participate',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.status){
					AppAction.updateSession(result.body)
				}
			}
		})
	}






}