/**
 * Created by mrstark on 11/6/16.
 */

var fs = require('fs');
var request = require('request');
var Promise = require('bluebird');

function Vera(appID, appSecret, endpoint) {
    this.appID = appID;
    this.appSecret = appSecret;
    this.endpoint = endpoint;
}

Vera.prototype.policy = function(options) {
    var self = this;

    return new Promise(function (resolve, reject) {
        var policyList = [];


        var stream = request.get({
            url: self.endpoint + '/ext/policy',
            auth: {
                'user': self.appID,
                'pass': self.appSecret,
                'sendImmediately': true
            }
        }).on('response', function (response) {

            if (response.statusCode !== 200) {
                reject('Response status was ' + response.statusCode + ':' + response.statusMessage);
            }
        }).on('data', function (chunk) {
            policyList += chunk;

        }).on('end', function () {
            resolve({stream: policyList});

        }).on('error', function (err) {
            reject(err)
        });
    });

};

Vera.prototype.meta = function(options) {

    var self = this;
    var docData = fs.createReadStream(options.file);

    var formData = {
        'docData': docData
    };

    return new Promise(function (resolve, reject) {
        var docMeta = [];


        var stream = request.post({
            url: self.endpoint + '/ext/doc/meta',
            auth: {
                'user': self.appID,
                'pass': self.appSecret,
                'sendImmediately': true
            },
            formData: formData

        }).on('response', function (response, body) {

            if (response.statusCode !== 200) {
                reject('Response status was ' + response.statusCode + ':' + response.statusMessage);
            }
        }).on('data', function (chunk) {
            docMeta += chunk;

        }).on('end', function () {
            resolve({stream: docMeta});

        }).on('error', function (err) {
            reject(err)
        });
    });

};

Vera.prototype.protect = function(options) {
    var self = this;
    var docData = options.fileStream || fs.createReadStream(options.file);
    var docName = options.docName;
    var path = options.path || options.file;

    var destination = options.destination; // CH: file destination

    // CH: really need toadd logic to  check these values at some point. 

    var formData = {
        'docName': docName,
        // CH: pass data via streams vs destination
        'docData': docData,
        path: path
    };

    return new Promise(function (resolve, reject) {
        var veraDocId;

        var stream = request.post({
            url: self.endpoint + '/ext/doc/protect',
            auth: {
                'user': self.appID,
                'pass': self.appSecret,
                'sendImmediately': true
            },
            headers: {
                'Accept': 'application/octet-stream; version=1;'
            },
            formData: formData
        }).on('response', function (response) {
            if (response.statusCode !== 200) {
                reject('Response status was ' + response.statusCode + ':' + response.statusMessage);
            }
        }).on('response', function (response) {
            if (response && response.headers && response.headers['x-vds-doc-id']) {
                veraDocId = response.headers['x-vds-doc-id'];
                if (!destination) {
                    resolve({stream: stream, docId: veraDocId});
                } 
            } else {
                reject("No Vera header found");
            }
        }).on('error', function (err) {
            reject(err);
        });

        if (destination) {
            var securedFile = fs.createWriteStream(destination);

            securedFile.on('finish', function() {
                securedFile.close(function() { 
                    resolve({docId: veraDocId, destination: destination});
                });
            });

            securedFile.on('error', function(err) { // CH: dude , you really need to handle errors
                fs.unlink(securedFile); 
                reject(err);
            });
            stream.pipe(securedFile);
        }
    });
};

Vera.prototype.unprotect = function(options) {
    var self = this;
    var docData = fs.createReadStream(options.file);
    var destination = options.destination; // CH: file destination


    var formData = {
        'docData': docData
    };

    return new Promise(function (resolve, reject) {

        var stream = request.post({
            url: self.endpoint + '/ext/doc/unprotect',
            auth: {
                'user': self.appID,
                'pass': self.appSecret,
                'sendImmediately': true
            },
            headers: {
                'Accept': 'application/octet-stream; version=1;'
            },
            formData: formData
        }).on('response', function (response) {
            if (response.statusCode !== 200) {
                reject('Response status was ' + response.statusCode + ':' + response.statusMessage);
            }
        }).on('response', function (response) {
            if (!destination) {
                    resolve({stream: stream});
                }
        }).on('error', function (err) {
            reject(err);
        });

        if (destination) {
            var unsecuredFile = fs.createWriteStream(destination);

            unsecuredFile.on('finish', function() {
                unsecuredFile.close(function() {
                    resolve({destination: destination});
                });
            });

            unsecuredFile.on('error', function(err) { // CH: dude , you really need to handle errors
                fs.unlink(unsecuredFile);
                reject(err);
            });
            stream.pipe(unsecuredFile);
        }
    });
};

module.exports = Vera;