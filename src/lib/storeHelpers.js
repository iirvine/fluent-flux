const PENDING_TOKEN = "PENDING_TOKEN";

function any(xs, pred) {
	var idx = -1,
		length = xs.length;

	while (++idx < length) {
		if (pred(xs[idx], idx, xs)) {
			return true;
		}
	}

	return false;
}

module.exports = {
	setPending(store) {
		store.pendingToken = PENDING_TOKEN;
	},

	resolve(store) {
		store.pendingToken = null;
	},

	anyPending(...stores) {
		return any(stores, (store) => {
			return store.pendingToken == PENDING_TOKEN;
		});
	}
}