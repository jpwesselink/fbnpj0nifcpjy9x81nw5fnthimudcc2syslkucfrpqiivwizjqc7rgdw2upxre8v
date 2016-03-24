#!/usr/bin/env node

// moar modules!
var chalk = require('chalk');
var crypto = require('crypto');
var http = require('http');
var inquirer = require('inquirer');
var open = require('open');

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

function checkIfNameExists() {
	var name = random();
	http.request({
			method: 'HEAD',
			host: 'registry.npmjs.org',
			path: '/' + name
		}, function (r) {
			if (r.statusCode !== 404) {
				checkIfNameExists();
			} else {
				console.log('Created an unique available package name for you');
				console.log(chalk.red.bold(name));
				inquirer.prompt([{
					type: 'confirm',
					name: 'registerDomain',
					message: 'Would you like to open a browser and for check availability\nof domain names for your package on godaddy.com ?'
				}], function (answers) {
					if (answers.registerDomain) {
						open('https://godaddy.com/domains/searchresults.aspx?checkAvail=1&tld=.tech&domainToCheck=' + name);
					}
				});
			}
		})
		.end();
}

checkIfNameExists();
