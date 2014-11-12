var DispatchCycle = require('./dispatched/DefaultDispatchCycle');

class FluentDispatchCycle extends DispatchCycle {
	dispatchTo(id, {ctx, table}) {
		if (table.has(this.action)) {
			table.get(this.action).call(ctx, this.params);
		}
	}
}

module.exports = FluentDispatchCycle;