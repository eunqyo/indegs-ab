var React = require('react');
var AppAPI = require('../API/AppAPI.js');

var Sex = React.createClass({
	getInitialState:function(){
		return ({
			sex:null
		})
	},
	handleClick:function(e){
		var sex = $(e.target).text().toLowerCase();
		this.setState({
			sex:sex
		});
		this.props.answer({
			status:true,
			body:sex
		})
	},
	render:function(){
		var sex = this.state.sex;
		var maleClass;
		var femaleClass;
		if(sex == 'male'){
			maleClass="join-sex-choose join-sex-chosen"
			femaleClass = "join-sex-choose"
		} else if (sex == 'female') {
			femaleClass="join-sex-choose join-sex-chosen"
			maleClass = "join-sex-choose"
		} else {
			maleClass = "join-sex-choose";
			femaleClass = "join-sex-choose"
		}
		return (
			<div id="join-sex">
				<div id="join-sex-box">
					<div onClick={this.handleClick} className={maleClass} id="join-male">Male</div>
					<div onClick={this.handleClick} className={femaleClass} id="join-female">Female</div>
				</div>
			</div>
		)
	}
});

var Age = React.createClass({
	getInitialState:function(){
		return ({
			toggle:false,
			value:false
		})
	},
	componentDidMount:function(){
		document.body.addEventListener('click',this.handleBodyClick)
	},
	componentWillUnmount:function(){
		document.body.removeEventListener('click',this.handleBodyClick)
	},
	handleBodyClick:function(e){
		var self = this;
		var a = $('#join #age-box');
	    if(!a.is(e.target)&& a.has(e.target).length === 0){
	    	self.setState({
	    		toggle:false
	    	})
	    } else {
	    	return null;
	    };
	},
	toggle:function(e){
		var self = this;
		var a = $('#join #age-box');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			self.setState({
				toggle:true
			})
		}
	},
	ageChoose:function(e){
		var value = $(e.target).text()
		this.setState({
			toggle:false,
			value:value
		});
		this.props.answer({
			status:true,
			body:value
		})
	},
	render:function(){
		var self = this;
		var value = this.state.value;
		var toggle = this.state.toggle;
		var ageValue,ageToggle;
		var array = [];
		for(var i=2010;i>1960;i--){
			array.push(i)
		};
		var choose = array.map(function(v,idx){
			return <div onClick={self.ageChoose} key={idx} className="age-item">{v}</div>
		});

		if(value == false){
			ageValue='Age'
		} else {
			ageValue=value
		}

		if(toggle){
			ageToggle = <div id="age-box">{choose}</div>
		} else {
			ageToggle = null
		}

		return (
			<div id="age" onClick={this.toggle}>
				<div id="age-input">
					<div id="age-value">{ageValue}</div>
					<div id="age-btn"></div>
					{ageToggle}
				</div>
			</div>
		)
	}
});


const Username = React.createClass({
	getInitialState:function(){
		return ({
			success:null,
			error:null
		})
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		if(nextProps.message != null){
			self.setState({
				error:nextProps.message
			})
		}
	},
	submitInput:function(e){
		var self = this;
		var value = $(e.target).val();
		if(value == null || value.length == 0){
			self.props.answer({
				status:false,
				body:"Fill your name"
			})
			self.setState({
				success:null,
				error:'Fill your name'
			})
		} else {
			AppAPI.checkName(value,function (bool){
				if(bool){
					self.props.answer({
						status:true,
						body:value
					});
					self.setState({
						error:null
					})
				} else {
					self.props.answer({
						status:false,
						body:'Already taken'
					})
					self.setState({
						error:'Already taken',
						success:null
					})
				}
			})
		}
	},
	handleEnter:function(e){
		if(e.which == 13){
			$(e.target).blur()
		}
	},
	handleChange:function(){
		this.setState({
			error:null,
			success:null
		})
	},
	render:function(){
		var self = this;
		var success,error;
		if(this.state.success == null){
			success = null;
		} else {
			success = <div className="success">{this.state.success}</div>
		}
		if(this.state.error == null){
			error = null;
		} else {
			error = <div className="error">{this.state.error}</div>
		}
		return (
			<div id="username">
				<input type="text" name="username" id="join-username-input" placeholder="Username" onBlur={this.submitInput} onKeyPress={this.handleEnter} onChange={this.handleChange} autoComplete="off" autoCorrect="off" spellCheck="false"></input>
				{success}
				{error}
				<div className="cb"></div>
			</div>			
		)
	}
})

const Email = React.createClass({
	getInitialState:function(){
		return({
			success:null,
			error:null
		});
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		if(nextProps.message != null){
			self.setState({
				error:nextProps.message
			})
		}
	},
	submitInput:function(e){
		var self = this;
		var vd = require('validator');
		var value = $(e.target).val();
		if(value.length == 0 || value == null){
			self.props.answer({
				status:false,
				body:'Fill your email'
			});
			self.setState({
				error:'Fill your email'
			});
		} else {
			if(vd.isEmail(value)){
				AppAPI.checkEmail(value,function (bool){
					if(bool){
						self.props.answer({
							status:true,
							body:value
						})
					} else {
						self.props.answer({
							status:false,
							body:'Already signed up'
						})
						self.setState({
							error:'Already signed up'
						});
					}
				})
			} else {
				self.props.answer({
					status:false,
					body:'Wrong email format'
				})
				self.setState({
					error:'Wrong email format'
				})
			}
		}
	},
	handleEnter:function(e){
		if(e.which == 13){
			$(e.target).blur()
		}
	},
	handleChange:function(e){
		this.setState({
			success:null,
			error:null
		})
	},
	render:function(){
		var self = this;
		var error,success;
		if(this.state.success == null){
			success = null;
		} else {
			success = <div className="success">{self.state.success}</div>
		}

		if(this.state.error == null){
			error = null;
		} else {
			error = <div className="error">{self.state.error}</div>
		}

		return (
			<div id="email">
				<input type="email" name="email" id="email-input" placeholder="Email address" onBlur={this.submitInput} onKeyPress={this.handleEnter} onChange={this.handleChange} autoComplete="off" autoCorrect="off" spellCheck="false"></input>
				{success}
				{error}
				<div className="cb"></div>
			</div>
		)
	}
});

var Password = React.createClass({
	getInitialState:function(){
		return({
			error:null
		});
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		if(nextProps.message != null){
			self.setState({
				error:nextProps.message
			})
		}
	},
	submitInput:function(e){
		var self = this;
		var value = $(e.target).val();
		if(value.length == 0 || value == null){
			self.props.answer({
				status:false,
				body:'Fill your password'
			});
			self.setState({
				error:'Fill your password'
			})
		} else {
			self.props.answer({
				status:true,
				body:value
			})
			self.setState({
				error:null
			})
		}
	},
	handleEnter:function(e){
		if(e.which == 13){
			$(e.target).blur()
		}
	},
	handleChange:function(e){
		this.setState({
			error:null
		})
	},
	render:function(){
		var self = this;
		var error;
		if(this.state.error == null){
			error = null;
		} else {
			error = <div className="error">{this.state.error}</div>
		}
		return (
			<div id="password">
				<input type="password" name="pw" id="join-pw-input" placeholder="Password" onBlur={this.submitInput} onKeyPress={this.handleEnter} onChange={this.handleChange} value={this.state.value} ></input>
				{error}
				<div className="cb"></div>
			</div>
		)
	}
});

var Join = React.createClass({
	getInitialState:function(){
		return ({
			message:null,
			email:{
				status:false,
				body:'Fill your email'
			},
			password:{
				status:false,
				body:'Fill your password'
			},
			username:{
				status:false,
				body:'Fill your username'
			},
			age:{
				status:false,
				body:'Select your age'
			},
			sex:{
				status:false,
				body:'Select your sex'
			}
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout()
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	_onResize:function(){
		this.layout()
	},
	layout:function(){
		var windowHeight = $(window).outerHeight();
		var headerHeight = 60;
		$('#join').css('min-height',windowHeight - headerHeight);
	},
	submit:function(){
		var self = this;
		var email = this.state.email;
		var username = this.state.username;
		var password = this.state.password;
		var age = this.state.age;
		var sex = this.state.sex;
		var cnt = 0;
		if(email.status){
			cnt ++;
		} else {
			self.setState({
				emailMsg:email.body
			})
		}
		if(password.status){
			cnt ++;
		} else {
			self.setState({
				passwordMsg:password.body
			})
		}
		if(username.status){
			cnt ++;
		} else {
			self.setState({
				usernameMsg:username.body
			})
		}
		if(age.status){
			cnt ++;
			self.setState({
				ageError:false
			})
		} else {
			self.setState({
				ageError:true
			})
		}
		if(sex.status){
			cnt ++;
			self.setState({
				sexError:false
			})
		} else {
			self.setState({
				sexError:true
			})
		}
		if(cnt==5){
			var json = {}
			json.name = username.body;
			json.email = email.body;
			json.pw = password.body;
			json.age = age.body;
			json.sex = sex.body;
			AppAPI.handleJoin(json)
		}
	},
	handleUsername:function(username){
		this.setState({
			username:username,
			usernameMsg:null
		})
	},
	handleEmail:function(email){
		this.setState({
			email:email,
			emailMsg:null
		})
	},
	handlePassword:function(password){
		this.setState({
			password:password,
			passwordMsg:null
		})
	},
	handleAge:function(age){
		var self = this;
		if(age.status){
			self.setState({
				age:age,
				ageError:false
			})
		} else {
			self.setState({
				age:age,
				ageError:true
			})
		}
	},
	handleSex:function(sex){
		var self = this;
		if(sex.status){
			self.setState({
				sex:sex,
				sexError:false
			})
		} else {
			self.setState({
				sex:sex,
				sexError:true
			})
		}
	},
	render:function(){
		var usernameMsg = this.state.usernameMsg;
		var emailMsg = this.state.emailMsg;
		var passwordMsg = this.state.passwordMsg;
		var ageError = this.state.ageError;
		var sexError = this.state.sexError;
		var error;
		if(ageError || sexError){
			error = <div className="error">Please answer both</div>
		} else {
			error = null;
		}
		return (
			<div id="join">
				<div id="join-wrapper">
					<div id="title">You are the early bird.</div>
					<div id="form">
						<input type="email" name="email" style={{'display':'none'}} />
						<Username answer={this.handleUsername} message={usernameMsg} />
						<Email answer={this.handleEmail} message={emailMsg}/>
						<Password answer={this.handlePassword} message={passwordMsg} />
						<div id="age-sex">
							<Age answer={this.handleAge}/>
							<Sex answer={this.handleSex}/>
							{error}
							<div className="cb"></div>
						</div>
					</div>
					<div id="submit" onClick={this.submit}>Sign Up ></div>
				</div>
			</div>
		)
	}
})



module.exports = Join;