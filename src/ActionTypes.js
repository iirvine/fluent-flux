class ActionTypeMap {
  constructor(namespace, hash) {
    this._namespace = namespace;
    this._hash = hash || {}
  }

  tryPutAction(name) {
    if (this._hash[name]) {
      throw new Error(`Action with name ${name} already exists in namespace`)
    }
    var fullName = this.generateFullName(name);
    this._hash[name] = function() { return fullName; }
  }

  tryPutNamespace(namespace, hash) {
    if (this._hash[namespace]) {
      throw new Error(`Namespace ${namespace} already exists.`);
    }

    this._hash[namespace] = {};

    for (var key in hash) {
      var fullName = `${this._namespace}:${hash[key]()}`
      this._hash[namespace][key] = function() { return fullName; }
    }
  }
  
  generateFullName(name) {
    return `${this._namespace}:${name}`
  }

  build() {
    return this._hash;
  }
}

class DSL {
  constructor(namespace, fn) {
    this._namespace = namespace;
    this.typeMap = new ActionTypeMap(namespace);
    this.fn = fn;
  }

  actions(...actions) {
    for (var i = 0; i < actions.length; i++) {
      this.typeMap.tryPutAction(actions[i]);
    }
  }

  namespace(namespace, fn) {
    this.typeMap
      .tryPutNamespace(
        namespace, 
        new DSL(namespace, fn).generate());
  }

  generate() {
    this.fn.call(this);
    return this.typeMap.build();
  }
}

function ActionTypes(namespace, fn) {
  return new DSL(namespace, fn).generate();
}

module.exports = ActionTypes;