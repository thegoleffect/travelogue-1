// Load modules

var Chai = require('chai');
var AuthFactory = require('../../../lib/middleware/authenticate');

// Declare internals

var internals = {};


// Test shortcuts

var expect = Chai.expect;


describe('middleware/authenticate.js', function () {

    var authenticate = AuthFactory({});
    
    it('should accept callback in place of options', function (done) {

        var name = 'local';
        var cb = function () { };
        var complete = function (err) { 

            expect(err).to.exist;
            expect(err.message).to.exist;
            done();
        };
        var request = {
            reply: function (msg) { 

                console.log('reply', msg);
            }
        };
        
        var auth = authenticate(name, cb);
        global._strategy = function () { return null; }; // hack to avoid initializing multiple modules
        auth(request, complete);
    });
});