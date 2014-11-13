var { define } = require('./dispatched');

class FluentDispatchCycle {
	dispatchTo(id, {ctx, table}) {
		if (table.has(this.action)) {
			table.get(this.action).call(ctx, this.params);
		}
	}
}

module.exports = define.DispatchCycle(FluentDispatchCycle);