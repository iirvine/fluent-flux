var ESMap = require('es6-map');
var assign = require('object-assign');

function proxy(dest, src, methods) {
	methods.forEach((method) => {
		if (src[method]) {
			dest[method] = function() {
				return src[method].apply(src, arguments);
			};
		}
	});
}

class DispatchTable {
	constructor(handlers, spec) {
		this.handlers = new ESMap(handlers);
		proxy(this, this.handlers, ['has', 'get', 'clear']);
		assign(this, spec);
	}
}

module.exports = DispatchTable;