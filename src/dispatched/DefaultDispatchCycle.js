class DefaultDispatchCycle {
	constructor() {
		this._isPending = {};
		this._isHandled = {};
	}

	start({action, params}) {
		this.action = action;
		this.params = params;
	}

	dispatchTo(id, cb) {
		cb(this.action, this.params);
	}

	willDispatchTo(id, cb, dispatch) {
		this.setPending(id, true);
		dispatch();
		this.setHandled(id, true);
		this.setPending(id, false);
	}

	isPending(id) {
		return Boolean(this._isPending[id]);
	}

	isHandled(id) {
		return Boolean(this._isHandled[id]);
	}

	setPending(id, bool) {
		return this._isPending[id] = bool;
	}

	setHandled(id, bool) {
		return this._isHandled[id] = bool;
	}
}

module.exports = DefaultDispatchCycle;