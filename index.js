#!/usr/bin/env node

var crypto = require('crypto');

function random() {
	var length = 64;
	var chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
	var rnd = crypto.randomBytes(length),
		value = new Array(length),
		len = chars.length;

	for (var i = 0; i < 64; i++) {
		value[i] = chars[rnd[i] % len]
	};

	return value.join('');
}

console.log(random());
