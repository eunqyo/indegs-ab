import React from 'react';
import AppAPI from '../API/AppAPI';
import AppAction from '../Action/AppAction';
import AppStore from '../Store/AppStore';

import PostStore from '../Store/PostStore';
import PostAction from '../Action/PostAction';
import PostAPI from '../API/PostAPI';

import Files from '../Util/Files';


const PostDrop = React.createClass({
	handleClick:function(e){
		if($(e.target).hasClass('drop-title')){
			$(e.target).parent().children('.image-input').click()
		} else {
			$(e.target).children('.image-input').click()
		}
	},
	handleChange:function(e){
		var self = this;
		var file = e.target.files[0];
		var url = URL.createObjectURL(file);
		Files.validateImageFromUrl(url,function (result){
			if(result.status){
				self.props.onLocalSuccess(file,result.body);
			} else {
				self.props.onLocalFailure(file);
			}
		})
		e.target.value = null;
	},
	onFileDrop:function(e){
		var self = this;
		e.preventDefault();
		$(e.target).hide();

		var nativeEvent = e.nativeEvent;
		var file = nativeEvent.dataTransfer.files[0];

		if(file != null){
			var url = URL.createObjectURL(file);
			Files.validateImageFromUrl(url,function (result){
				if(result.status){
					self.props.onLocalSuccess(file,result.body);
				} else {
					self.props.onLocalFailure(file);
				}
			});
		}
	},
	onFileDragOver:function(e){
		$(e.target).children('.drop-box').show();
	},
	onFileDragLeave:function(e){
		$(e.target).hide();
	},
	render:function(){
		return (
			<div className="drop" onClick={this.handleClick} onDrop={this.onFileDrop} onDragOver={this.onFileDragOver}>
				<div className="drop-title">Click this box or drag an image from your PC</div>
				<div className="drop-box" onDragLeave={this.onFileDragLeave}></div>
				<input type="file" className="image-input" onChange={this.handleChange} />
			</div>
		)
	}
});

const PostImage = React.createClass({
	handleClick:function(e){
		$(e.target).parent().children('.image-input').click();
	},
	handleChange:function(e){
		var self = this;
		var file = e.target.files[0];
		var url = URL.createObjectURL(file);
		Files.validateImageFromUrl(url,function (result){
			if(result.status){
				self.props.onLocalSuccess(file,result.body);
			} else {
				self.props.onLocalFailure(file);
			}
		})
		e.target.value = null;
	},
	onFileDrop:function(e){
		var self = this;
		e.preventDefault();
		$(e.target).hide();

		var nativeEvent = e.nativeEvent;
		var file = nativeEvent.dataTransfer.files[0];

		if(file != null){
			var url = URL.createObjectURL(file);
			Files.validateImageFromUrl(url,function (result){
				if(result.status){
					self.props.onLocalSuccess(file,result.body);
				} else {
					self.props.onLocalFailure(file);
				}
			});
		}
	},
	onFileDragOver:function(e){
		$(e.target).prev().show();
	},
	onFileDragLeave:function(e){
		$(e.target).hide();
	},
	render:function(){
		var src = this.props.src;
		return (
			<div className="post-image" onClick={this.handleClick} onDrop={this.onFileDrop} onDragOver={this.onFileDragOver}>
				<div className="drop-box" onDragLeave={this.onFileDragLeave}></div>
				<img src={src} />
				<input type="file" className="image-input" onChange={this.handleChange} />
			</div>
		)
	}
})

const PostSection = React.createClass({
	getInitialState:function(){
		return({
			src:null
		})
	},
	handleDropSuccess:function(url){
		var self = this;
		this.setState({
			src:url
		});
		this.getImageData(url,function (imageData){
			console.log(imageData)
		})
	},
	handleDropFail:function(file){
		console.log(file)
	},
	getImageData:function(url,callback){
		var img = new Image();
		img.onload = function(){
			var imageData = {}
			imageData.width = this.width;
			imageData.height = this.height;
			callback(imageData);
			URL.revokeObjectURL(url);
		}
		img.src = url;
	},
	handleLocalSuccess:function(file,image){
		var idx = this.props.idx;
		this.setState({
			src:image.url
		});
		var data = {
			idx:idx,
			file:file,
			image:image
		}
		PostAction.updatePostSection(data);
	},
	handleLocalFailure:function(file){
		console.log(file);
	},
	handleBrowserSuccess:function(image){
		var idx = this.props.idx;
		this.setState({
			src:image.url
		});
		var data = {
			idx:idx,
			image:image
		}
		PostAction.updatePostSection(data);
	},
	handleBrowserFailure:function(url){
		console.log(url)
	},
	render:function(){
		var body;
		var src = this.state.src;

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
			body = <PostDrop onLocalSuccess={this.handleLocalSuccess} onLocalFailure={this.handleLocalFailure} onBrowserSuccess={this.handleBrowserSuccess} onBrowserFailure={this.handleBrowserFailure} />;
		} else {
			body = <PostImage src={src} onLocalSuccess={this.handleLocalSuccess} onLocalFailure={this.handleLocalFailure} onBrowserSuccess={this.handleBrowserSuccess} onBrowserFailure={this.handleBrowserFailure} />;
		}

		return (
			<div className="post-section" id={sectionId}>
				<div className="header">
					<div className="category">{sectionTitle}</div>
					<div className="cb"></div>
				</div>
				{body}
			</div>
		)
	}
});


const PostSections = React.createClass({
	render:function(){
		return (
			<div id="post-sections">
				<PostSection idx={1} key={1} />
				<PostSection idx={2} key={2} />
				<div className="cb"></div>
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
			PostAction.updatePostTitle(title);
		}
		$(e.target).attr('placeholder','ex) Facebook layout vs Twitter layout');
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
		$(e.target).attr('placeholder','How about font AB? "Helvetica vs Open Sans"');
	},
	render:function(){
		return (
			<div id="post-title">
				<div className="category">Title</div>
				<input type="text" id="post-title-input" name="post-title" placeholder="ex) Facebook layout vs Twitter layout" onClick={this.changePlaceholder} onBlur={this.submitInput} onKeyPress={this.handleEnter} onChange={this.handleChange} value={this.state.title} spellCheck="false" autoCorrect="off" autoComplete="off" />
			</div>
		)
	}
});

const PostDescription = React.createClass({
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
			PostAction.updatePostDescription(replacement);
		}
		$(e.target).attr('placeholder','Detailed explanation of your test (optional)');
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
			<div id="post-description">
				<div className="category">Description</div>
				<textarea name="post-description" placeholder="Detailed explanation of your test (optional)" onFocus={this.changePlaceholder} onBlur={this.submitInput} onKeyUp={this.resize} onChange={this.handleChange} value={this.state.text} spellCheck="false" autoCorrect="off" autoComplete="off"/>
			</div>
		)
	}
})


const PostForm = React.createClass({
	render:function(){
		return (
			<div id="post-form">
				<PostTitle />
				<PostDescription />
				<PostSections />
			</div>
		)
	}
});



const PostSubmit = React.createClass({
	getInitialState:function(){
		return ({
			title:'Create',
			_post:PostStore.getPost(),
			_session:AppStore.getSession(),
			canPost:false
		})
	},
	componentDidMount:function(){
		AppStore.addChangeListener(this._onSessionChange);
		PostStore.addChangeListener(this._onChange);
	},
	componentWillUnmount:function(){
		AppStore.removeChangeListener(this._onSessionChange);
		PostStore.removeChangeListener(this._onChange);
	},
	_onChange:function(){
		var self = this;
		this.setState({
			_post:PostStore.getPost()
		},function(){
			self.checkStatus()
		})
	},
	_onSessionChange:function(){
		var self = this;
		this.setState({
			_session:AppStore.getSession()
		},function(){
			self.checkStatus()
		})
	},
	checkStatus:function(){
		var self = this;
		var _session = this.state._session;
		var _post = this.state._post;
		if(_session == false || _session == null){
			return null;
		} else {
			if(_post == null || _post.A == null || _post.B == null || _post.title == null){
				return null;
			} else {
				self.setState({
					canPost:true
				})
			}
		}
	},
	handleSubmit:function(){
		var canPost = this.state.canPost;
		if(!canPost) return null;

		var _session = this.state._session;
		var _post = this.state._post;
		this.setState({
			title:'Creating ...',
			canPost:false
		})
		PostAPI.post(_post,_session);
	},
	render:function(){
		var id;
		var canPost = this.state.canPost;
		var title = this.state.title;
		if(canPost) id = "post-submit";
		else id = "post-submit-disabled";

		return (
			<div id={id} onClick={this.handleSubmit}>{title}</div>
		)
	}
})

const PostHeader = React.createClass({
	render:function(){
		return (
			<div id="post-header">
				<div id="title">Create a New AB test</div>
				<div id="exp">Create your ABs using your design or any other images</div>
				<PostSubmit />
				<div className="cb"></div>
			</div>
		)
	}
});

const Post = React.createClass({
	componentWillUnmount:function(){
		PostAction.emptyPost();
	},
	render:function(){
		var self = this;
		return (
			<div id="post">
				<div id="post-body">
					<PostHeader />
					<PostForm />
				</div>
			</div>
		)
	}
})

module.exports = Post;