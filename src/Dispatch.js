class Dispatch {
	constructor(payload) {
		this.payload = payload;
		this.isPending = {};
		this.isHandled = {};
	}

	dispatchToTable(id, table) {
		var {action, params} = this.payload;
		if (table.has(action)) {
			this.isPending[id] = true;
			table.get(action).call(action, params);
			this.isHandled[id] = true;
			this.isPending[id] = false;
		}
	}
}

module.exports = Dispatch