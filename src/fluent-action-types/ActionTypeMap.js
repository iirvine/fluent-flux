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

module.exports = ActionTypeMap;