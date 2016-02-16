(function(bModule) {
	'use strict';
	/*jslint browser: true */

	modV.prototype.createControls = function(Module) {
		var self = this;
		var controlPanelWrapperNode = document.querySelector('.control-panel-wrapper');
		var panelNode = document.createElement('div');

		panelNode.classList.add('control-panel', 'pure-u-1-1');
		panelNode.dataset.moduleName = Module.info.safeName;

		Module.info.controls.forEach(function(control, idx) {
			if(!control.makeNode) return;
			var inputNode;

			console.log('createControls', control.variable);

			inputNode = control.makeNode(Module);

			var labelNode = document.createElement('label');
			labelNode.textContent = control.label;
			labelNode.appendChild(inputNode);
			panelNode.appendChild(labelNode);
			panelNode.appendChild(document.createElement('br'));
		});

		controlPanelWrapperNode.appendChild(panelNode);

	};

})(module);