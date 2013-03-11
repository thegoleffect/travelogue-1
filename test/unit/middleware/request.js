// Load modules

var Chai = require('chai');
var AugmentRequestFactory = require('../../../lib/middleware/request');

// Declare internals

var internals = {};


// Test shortcuts

var expect = Chai.expect;


describe('middleware/request.js', function () {

    
    var augmentRequest = AugmentRequestFactory({});
    
    describe('request.login', function () {

        it('should accept callback in place of options', function (done) {

            var request = {
                _passport: {
                    instance: {
                        serializeUser: function (user, next) {
                            next(null, user);
                        }
                    }
                },
                payload: {},
                session: {}
            };
            request._passport.session = request.session;
            
            augmentRequest(request, function () {

                request.login({username: 'van'}, function () {

                    expect(request.body).to.exist;
                    expect(request.session).to.exist;
                    expect(request.session.user).to.exist;
                    done();
                });
            });
        });
        
        it('should just callback if no session set', function (done) {

            var request = {
                _passport: {
                    instance: {
                        serializeUser: function (user, next) {
                            next(null, user);
                        }
                    }
                },
                payload: {},
                session: null
            };
            request._passport.session = request.session;
            
            augmentRequest(request, function () {

                request.login({username: 'van'}, function () {

                    expect(request.body).to.exist;
                    delete request.user;
                    done();
                });
            });
        });
    });
});