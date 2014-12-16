var ActionTypes = require('fluent-action-types');
var {ActionNamespace} = ActionTypes

class FluentApp {
  constructor() {
    this.actionTypes = new ActionNamespace(this.displayName || "FluentApp")
  }

  addActionTypes(namespace, fn) {
    var hash = ActionTypes(namespace, fn);
    this.actionTypes.tryPutNamespace(namespace, hash)
    return this.actionTypes
      .getNamespace(namespace)
      .build();
  }
}

module.exports = FluentApp