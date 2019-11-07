define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    //var messages = require('./messages');

    // Load library/vendor modules using
    // full IDs, like:
    //var print = require('print');

    //print(messages.getHello());

    require("./Base_D3.js");
    require("./Histogram.js");
    require("./Bargraph.js");
    require("./test.js");
});
