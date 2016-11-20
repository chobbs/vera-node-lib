var fs = require('fs');
var assert = require('assert');
var veraAppID = '8d8cfa3a-a72b-33e9-b55a-9870fb68101e';
var veraAppSecret = 'QXZMQVVoZElpSm1uZ0FpZXhCelVIM0pmaklRPXw4ZDhjZmEzYS1hNzJiLTMzZTktYjU1YS05ODcwZmI2ODEwMWV8OWFmMjMyMmYtOGIxYS0zOTMyLWI2ZTUtZGZiZjllM2IxYTU2fDE0NjMzNTcwMjIyNTR8REVWSUNFfFJPTEVfREVWSUNFfDB8MTQ2MjQ5MzAyMjI1NHxmYWxzZQ;';

var veraEndpoint ='https://veramktg.vera.com/api';

var Vera = require('../index.js');

try { fs.mkdirSync('./tmp'); } catch (err) {}


describe('Vera', function() {
    this.timeout(10000);

    describe('policy list', function() {

        it('get policy', function(done) {
            var vera = new Vera(veraAppID, veraAppSecret, veraEndpoint);
            vera.policy().then(function(result){
                console.log(result);
                done();
            }).catch(function (err) {
                done(err)
            });
          });
    });

    describe('protect', function() {

          it('encode to a file', function(done) {
            var vera = new Vera(veraAppID, veraAppSecret, veraEndpoint);
            vera.protect({file:'test/asset/testasset.png', docName: 'testasset.png', destination: './tmp/testasset-secured.html'}).then(function(result){
                console.log(JSON.stringify(result));
                done();
            }).catch(function (err) {
                done(err)
            });
        });

        it('encode to a stream', function(done) {
            var vera = new Vera(veraAppID, veraAppSecret, veraEndpoint);
            vera.protect({file:'test/asset/testasset.png', docName: 'testasset.png'}).then(function(result){
                console.log(JSON.stringify(result));
                assert.ok(result.stream, 'No stream object received');

                done();
            }).catch(function (err) {
                done(err)
            });
        });
    });

     describe('metadata', function() {

        it('get metadata', function(done) {
            var vera = new Vera(veraAppID, veraAppSecret, veraEndpoint);
            vera.meta({file:'./tmp/testasset-secured.html'}).then(function(result){
                console.log(result);
                done();
            }).catch(function (err) {
                done(err)
            });
          });
       });

    describe('unprotect', function() {

        it('encode to file', function(done) {
            var vera = new Vera(veraAppID, veraAppSecret, veraEndpoint);
            vera.unprotect({file:'./tmp/testasset-secured.html', destination: './tmp/testasset-unnsecured.png'}).then(function(result){
                //console.log(JSON.stringify(result));
                console.log(result);
                done();
            }).catch(function (err) {
                done(err)
            });
          });

        it('encode to stream', function(done) {
            var vera = new Vera(veraAppID, veraAppSecret, veraEndpoint);
            vera.unprotect({file:'./tmp/testasset-secured.html'}).then(function(result){
                console.log(JSON.stringify(result));
                assert.ok(result.stream, 'No stream object received');
                //console.log(result);
                done();
            }).catch(function (err) {
                done(err)
            });
        });
    });
});