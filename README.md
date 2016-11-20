# VeraLabs - Node Library for the Vera API's

## Motivation

This is a wrapper around the Vera APIs, however this project is just getting started and should be considered a testing release only. 

This library is intended to provide the basic functionality you need to secure and unsecure files using Vera: This library does not attempt to provide application level support, e.g. administration, auditing, and user management. If you're looking for those kinds of features, you should check with Vera Support.

```js
var vera = new Vera(veraAppID, veraAppSecret, veraEndpoint);

```

```js

vera.protect({file:'myfile.pdf', docName: 'myfile.pdf', destination: './tmp/myfile-secured.html'}).then(function(result){
	console.log(JSON.stringify(result)); // Show the stream returm results from Vera. 
	done();
}).catch(function (err) {
	done(err)
})

```
NOTE: If  "destination" value is not provided to the protect function, the return result will be encoded to a stream.


```js

vera.policy().then(function(result){
	console.log(JSON.stringify(result)); // Show the stream returm results from Vera. 
	done();
}).catch(function (err) {
	done(err)
})

```