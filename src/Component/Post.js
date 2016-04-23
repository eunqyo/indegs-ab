var React = require('react');
var AppAPI = require('../API/AppAPI.js');
var AppAction = require('../Action/AppAction.js');
var AppStore = require('../Store/AppStore.js');

const PostSection = React.createClass({
	getInitialState:function(){
		return({
			opacity:0,
			src:null,
			srcHeight:null,
			srcWidth:null,
			classStyle:'w'
		})
	},
	handleClick:function(e){
		$(e.target).next().click()
	},
	handleChange:function(e){
		var self = this;
		var file = e.target.files[0];
		this.checkExtension(file)
		e.target.value = null;
	},
	checkExtension:function(file){
		var self = this;
		var extObj = file.name.split('.');
		var ext = extObj[extObj.length-1];
		var lower = ext.toLowerCase(ext);
		if(lower == 'png' || lower == 'jpg' || lower == 'jpeg'){
			self.checkImage(file)
		} else {

		}
	},
	checkImage:function(file){
		var self = this;
		var tmpPath = URL.createObjectURL(file);
		var obj = {};
		if(this.props.idx == 1){
			AppAction.updatePostImage(file,'a')
		} else {
			AppAction.updatePostImage(file,'b')
		}
		var img = new Image();
	    img.onload = function(){
	    	var imgWidth = this.width;
	    	var imgHeight = this.height;
	    	self.setState({
	    		opacity:0,
	    		src:null,
	    		srcWidth:imgWidth,
	    		srcHeight:imgHeight
	    	},function(){
				self.setState({
					opacity:1,
					src:tmpPath
				},function(){
					URL.revokeObjectURL(tmpPath)
					self.props.change({
						section:self.props.idx,
						width:imgWidth,
						height:imgHeight
					})
				});
	    	})
	    };
	    img.src = tmpPath;
	},
	render:function(){
		var image;
		var src = this.state.src;
		var opacity = this.state.opacity;

		if(this.props.idx == 1){
			var imgId = "post-image-a"
			var sectionId = "post-section-a"
			var sectionTitle = "A"
		} else {
			var imgId = "post-image-b"
			var sectionId = "post-section-b"
			var sectionTitle = "B"
		}

		if(src == null){
			image = <div className="post-image-holder"></div>;
		} else {
			image = <div className="post-image-holder"><img src={src} className="post-image" style={{"opacity":opacity}} id={imgId} /></div>
		}
		return (
			<div className="post-section" id={sectionId} >
				<div className="header">
					<div className="left">
						<div className="title">{'Version '+ sectionTitle}</div>
						<div className="guide">Upload jpeg or png file</div>
						<div className="cb"></div>
					</div>
					<div className="submit" onClick={this.handleClick}>+</div>
					<input type="file" className="post-image-input" onChange={this.handleChange} />
				</div>
				{image}
			</div>
		)
	}
})
const PostTitle = React.createClass({
	getInitialState:function(){
		return({
			title:null
		})
	},
	submitInput:function(e){
		var title = this.state.title;
		if(title != null){
			AppAction.updatePostTitle(title);
		}
		$(e.target).attr('placeholder','Title of your AB test');
	},
	handleEnter:function(e){
		if(e.which == 13){
			$(e.target).blur()
		}
	},
	handleChange:function(e){
		this.setState({
			title:e.target.value
		});
	},
	changePlaceholder:function(e){
		$(e.target).attr('placeholder','ex) Movie Poster AB test');
	},
	resize:function(e){
		var obj = $(e.target).context;
		obj.style.height = "1px";
		obj.style.height = (20+obj.scrollHeight)+"px";
	},
	render:function(){
		return (
			<div id="post-title">
				<textarea type="text" id="post-title-input" name="post-title" placeholder="Title of your AB test" onClick={this.changePlaceholder} onBlur={this.submitInput} onKeyPress={this.handleEnter} onKeyUp={this.resize} onChange={this.handleChange} value={this.state.title} spellCheck="false" autoCorrect="off" autoComplete="off" />
			</div>
		)
	}
});

const PostText = React.createClass({
	getInitialState:function(){
		return({
			text:null
		})
	},
	submitInput:function(e){
		var text = this.state.text;
		if(text != null){
			function replaceAll(str, target, replacement) {
			    return str.split(target).join(replacement);
			};
			var replacement = replaceAll(text, '\n', '<br/>');
			AppAction.updatePostText(replacement)
		}
		$(e.target).attr('placeholder','Detailed explanation of your test (optional)');
	},
	handleEnter:function(e){
		// if(e.which == 13){
		// 	$(e.target).blur()
		// }
	},
	handleChange:function(e){
		this.setState({
			text:e.target.value
		});
	},
	changePlaceholder:function(e){
		$(e.target).attr('placeholder','I want to see how you think on two versions of my movie poster.');
	},
	resize:function(e){
		var obj = $(e.target).context;
		obj.style.height = "1px";
		obj.style.height = (20+obj.scrollHeight)+"px";
	},	
	render:function(){
		return (
			<div id="post-text">
				<textarea id="post-text-input" name="post-text" placeholder="Detailed explanation of your test (optional)" onClick={this.changePlaceholder} onBlur={this.submitInput} onKeyUp={this.resize} onKeyPress={this.handleEnter} onChange={this.handleChange} value={this.state.text} spellCheck="false" autoCorrect="off" autoComplete="off"/>
			</div>
		)
	}
})


const PostAlert = React.createClass({
	getInitialState:function(){
		return ({
			message:this.props.message
		})
	},
	handleClick:function(){
		this.props.alertAnswer(true)
	},
	componentWillUnmount:function(){
		this.setState({
			message:null
		})
	},
	render:function(){
		var message = this.state.message;
		return (
			<div id="post-alert-holder">
				<div id="post-alert-drag"></div>
				<div id="post-alert-info">
					<div id="post-alert-logo"></div>
					<div id="post-alert-message">{message}</div>
				</div>
				<div id="post-alert-btn" onClick={this.handleClick} >Okay</div>
			</div>
		)
	}
});

const PostChart = React.createClass({
	render:function(){
		return (
			<div id="chart">
				<div id="title-holder">
					<div id="title">Graph of likes</div>
					<div id="go-data">Experience data-powered design</div>
					<div className="cb"></div>
				</div>
				<div id="graph"></div>
			</div>
		)
	}
})

const Post = React.createClass({
	getInitialState:function(){
		return ({
			a:null,
			b:null
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
		$('#post').css('min-height',windowHeight);
	},
	handleChange:function(data){
		var self = this;
		if(data.section == 1){
			self.setState({
				a:data
			},function(){
				self.changeBorder()
			})
		} else {
			self.setState({
				b:data
			},function(){
				self.changeBorder()
			})
		}
	},
	changeBorder:function(){
		var a = this.state.a;
		var b = this.state.b;
		if(a!=null){
			if(b==null){
				$('#post-section-b').css('border','none');
				$('#post-section-a').css('border-right','1px solid #efefef');
			} else {
				var aRatio = a.width/a.height;
				var bRatio = b.width/b.height;
				if(aRatio>bRatio){
					$('#post-section-a').css('border','none')
					$('#post-section-b').css('border-left','1px solid #efefef')
				} else {
					$('#post-section-b').css('border','none');
					$('#post-section-a').css('border-right','1px solid #efefef');
				}
			}
		} else {
			if(b=!null){
				$('#post-section-a').css('border','none')
				$('#post-section-b').css('border-left','1px solid #efefef')
			}
		}
	},
	render:function(){
		var self = this;
		return (
			<div id="post">
				<div className="c1190">
					<div id="post-header">
						<div id="left">
							<PostTitle />
							<PostText />
						</div>
						<div id="right">
							<PostChart />
						</div>
						<div className="cb"></div>
					</div>
					<PostSection idx={1} key={1} change={this.handleChange} />
					<PostSection idx={2} key={2} change={this.handleChange} />
					<div className="cb"></div>
				</div>
			</div>
		)
	}
})

module.exports = Post;