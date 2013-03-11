// Load modules

var Chai = require('chai');
var InitFactory = require('../../../lib/middleware/initialize');

// Declare internals

var internals = {};


// Test shortcuts

var expect = Chai.expect;


describe('middleware/initialize.js', function () {

    var initialize = InitFactory({})();
    
    it('should set session if no session available', function (done) {

        var request = {};
        initialize(request, function () {

            expect(request._passport.session).to.exist;
            done();
        });
    });
});