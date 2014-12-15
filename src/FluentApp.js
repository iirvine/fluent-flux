class FluentApp {
  constructor() {

  }
  
  initialize() {

  }
}

FluentApp.create = function(Application) {
  var app = new Application();
  app.initialize();
  return app;
}

module.exports = FluentApp