import React from 'react';
import Servers from '../../Util/Servers';


const ImageBox = React.createClass({
	componentDidMount:function(){
		this.X = window.scrollX;
		this.Y = window.scrollY;

		window.addEventListener('scroll',this._onScroll)
	},
	componentWillUnmount:function(){
		window.removeEventListener('scroll',this._onScroll)
	},
	_onScroll:function(e){
		e.preventDefault()
		window.scrollTo(this.X,this.Y)
	},
	toggleImageBox:function(e){
		var self = this;
		var a = $(e.target).children();
		if(!a.is(e.target)||a.has(e.target).length == 0){
			self.props.toggle()
		}
	},
	render:function(){
		var image = this.props.image;
		var src = Servers.s3Image + image.hash;
		return (
			<div id="image-box" onClick={this.toggleImageBox}>
				<img src={src} />
			</div>
		)
	}
})

module.exports = ImageBox;
