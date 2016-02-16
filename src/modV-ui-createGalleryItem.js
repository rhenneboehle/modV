(function(bModule) {
	'use strict';
	/*jslint browser: true */

	// from here: http://stackoverflow.com/a/728400
	// function clone(obj) {
	// 	if(obj === null || typeof(obj) != 'object')
	// 		return obj;	
	// 	var temp = new obj.constructor();
	// 	for(var key in obj) {

	// 		try {
	// 			temp[key] = clone(obj[key]);
	// 		} catch(e) {

	// 		}

	// 	}
	// 	return temp;
	// }

	modV.prototype.createGalleryItem = function(Module) {
		var self = this;

		if(!(Module instanceof self.Module2D)) return;

		// Clone module -- afaik, there is no better way than this
		Module = self.cloneModule(Module, true);
		console.log(Module);

		//Module = new Module();

		self.galleryModules = [];
		
		var template = self.templates.querySelector('#gallery-item');
		var galleryItem = document.importNode(template.content, true);

		var previewCanvas = galleryItem.querySelector('canvas');
		var titleElement = galleryItem.querySelector('span.title');

		// Module variables
		var previewCtx = previewCanvas.getContext('2d'),
			name = Module.info.name,
			type;

		if(Module instanceof self.ModuleShader) {
			type = 'ModuleShader';
		} else if(Module instanceof self.Module2D) {
			type = 'Module2D';
		}

		// init cloned Module
		if('init' in Module) {
			console.log(name);
			Module.init(previewCanvas, previewCtx);
		}

		var interval;


		document.querySelector('.gallery').appendChild(galleryItem);

		// Pull back initialised node from DOM
		galleryItem = document.querySelector('.gallery .gallery-item:last-child');

		// Set data
		// TODO: make sure this follows the HTML5 attributes spec: https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
		galleryItem.dataset.moduleName = Module.info.name.replace(' ', '-');

		// Draw preview
		giMouseEnter(Module, type, previewCanvas, previewCtx, self);

		// Draw name
		giMouseOut(interval, Module, type, previewCanvas, previewCtx, self);

		previewCanvas.addEventListener('mouseenter', function() {
			var loop = giMouseEnter(Module, type, previewCanvas, previewCtx, self);
			interval = setInterval(loop, 1000/60);
		});

		previewCanvas.addEventListener('mouseout', function() {
			giMouseOut(interval, Module, type, previewCanvas, previewCtx, self);
		});

/*		previewCanvas.addEventListener('mousemove', function(evt) {
			mousePos = getMousePos(previewCanvas, evt, true);
	   	}, false);*/

	};

	var mousePos = {x: 0, y: 0};

	function giMouseEnter(Module, type, canvas, ctx, self) {

		console.log('mouse enter');

		return function(delta) {
			//ctx.clearRect(0, 0, mousePos.x, canvas.height);
			//ctx.clearRect(0, 0, Math.round(canvas.width/2), canvas.height);
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var positionInfo = canvas.getBoundingClientRect();

			var largeWidth = Math.round(Math.map(mousePos.x, 0, positionInfo.width, 0, self.canvas.width));
			console.log(mousePos.x, positionInfo.width, largeWidth, self.canvas.width);

			if(Module.info.previewWithOutput) {
				ctx.drawImage(self.canvas, 0, 0, canvas.width, canvas.height);
			}

			//ctx.drawImage(self.canvas, largeWidth, 0, self.canvas.width, self.canvas.height, mousePos.x, 0, canvas.width, canvas.height);
			//ctx.drawImage(self.canvas, Math.round(self.canvas.width/2), 0, self.canvas.width, self.canvas.height, Math.round(canvas.width/2), 0, canvas.width, canvas.height);
			ctx.save();
			Module.draw(canvas, ctx, self.video, self.myFeatures, self.meyda, delta, self.bpm);
			ctx.restore();
		};

	}

	function giMouseOut(interval, Module, type, canvas, ctx, self) {
		clearInterval(interval);

		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'white';
		var textWidth = ctx.measureText(Module.info.name).width;
		ctx.fillText(Module.info.name, canvas.width/2 - textWidth/2, canvas.height/2);

		return undefined;
	}

	function getMousePos(canvas, evt, round) {
		var rect = canvas.getBoundingClientRect();
		if(round) {
			return {
				x: Math.floor(evt.clientX - rect.left),
				y: Math.floor(evt.clientY - rect.top)
			};
		} else {
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}
	}

})(module);