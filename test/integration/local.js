// Load modules

var Chai = require('chai');
var Travelogue = require('../..');
var Hapi = require('hapi');
var Passport = require('passport');
var LocalStrategy = require('passport-local');

var GenerateServer = require('../examples/local');
var CreateFollowRedirect = require('../helpers/redirect').FollowRedirect;

// Declare internals

var internals = {};


// Test shortcuts

var expect = Chai.expect;


describe('passport-local', function () {

    var config = {
        "port": 8000,
        "yar": {
            "cookieOptions": {
                "password": "worldofwalmart"
            },
            "session": true
        },
        "passport": {
            "urls": {
                "failureRedirect": "/login",
                "successRedirect": "/",
                "failureFlash": true
            }
        }
    };
    var Example = GenerateServer(config);
    var FollowRedirect = CreateFollowRedirect(Example.server);
    
    describe('login', function () {

        it('should allow for login via POST', function (done) {

            var body = {
                username: 'van',
                password: 'walmart'
            };
            var request = { 
                method: 'POST',
                url: '/login',
                payload: JSON.stringify(body)
            };
            Example.server.inject(request, FollowRedirect(function (res) {

                expect(res.result).to.equal(Example.successMessage);
                done();
            }));
        });
        
        describe('with failureFlash', function () {

            it('should flash error if invalid credentials used', function (done) {

                var body = {
                    username: 'van',
                    password: 'xwalmartx'
                };
                var request = { 
                    method: 'POST',
                    url: '/login',
                    payload: JSON.stringify(body)
                };
                Example.server.inject(request, FollowRedirect(function (res, cookie) {

                    var readSession = {
                        method: 'GET',
                        url: '/session',
                        headers: {
                            cookie: cookie
                        }
                    };
                    Example.server.inject(readSession, FollowRedirect(function (res) {

                        var body = JSON.parse(res.result);
                        expect(body.flash).to.exist;
                        expect(body.flash.error).to.exist;
                        expect(body.flash.error.length).to.be.above(0);
                        done();
                    }));
                }));
            });
        });

        describe('with failureMessage', function () {

            var configFM = {
                "port": 8000,
                "yar": {
                    "cookieOptions": {
                        "password": "worldofwalmart"
                    },
                    "session": true
                },
                "passport": {
                    "urls": {
                        "failureRedirect": "/login",
                        "successRedirect": "/",
                        "failureMessage": true
                    }
                }
            };
            var ExampleFM = GenerateServer(configFM);
            var FollowRedirectFM = CreateFollowRedirect(ExampleFM.server);
            
            it('should flash messages if invalid credentials used', function (done) {

                var body = {
                    username: 'van',
                    password: 'xwalmartx'
                };
                var request = { 
                    method: 'POST',
                    url: '/login',
                    payload: JSON.stringify(body)
                };
                ExampleFM.server.inject(request, FollowRedirectFM(function (res, cookie) {

                    var readSession = {
                        method: 'GET',
                        url: '/session',
                        headers: {
                            cookie: cookie
                        }
                    };
                    ExampleFM.server.inject(readSession, FollowRedirectFM(function (res) {

                        var body = JSON.parse(res.result);
                        expect(body.messages).to.exist;
                        expect(body.messages.length).to.be.above(0);
                        done();
                    }));
                }));
            });
        });
    });

    describe('logout', function () {

        it('should logout properly', function (done) {

            var ExampleLogout = GenerateServer(config);
            var FollowRedirectLogout = CreateFollowRedirect(ExampleLogout.server);
            
            var body = {
                username: 'van',
                password: 'walmart'
            };
            var loginReq = { 
                method: 'POST',
                url: '/login',
                payload: JSON.stringify(body)
            };
            ExampleLogout.server.inject(loginReq, FollowRedirectLogout(function (res, cookie) {

                var logoutReq = {
                    method: 'GET',
                    url: '/logout',
                    headers: {
                        cookie: cookie
                    }
                };
                ExampleLogout.server.inject(logoutReq, FollowRedirectLogout(function (res) {

                    var body = JSON.parse(res.result);
                    done();
                }));
            }));
        });
    });
});