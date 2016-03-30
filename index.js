#!/usr/bin/env node

// moar modules!
var yargs = require('yargs');
var chalk = require('chalk');
var http = require('http');
var inquirer = require('inquirer');
var open = require('open');

var types = {
	'random64': {
		generator: function () {
			return require('./lib/random64')();
		}
	},
	'uuid': {
		generator: function () {
			return require('uuid')
				.v4();
		}
	},
	'memorable': {
		generator: function () {
			return require('random-words')({
				exactly: 7,
				join: '-'
			});
		}
	}
};

var argv = yargs
	.usage('Create unique available npm module name')
	.describe('type', 'Type of name: ' + Object.keys(types)
		.join(', '))
	.choices('type', Object.keys(types))
	.default('type', 'random64')
	.alias('t', 'type')
	.describe('checkDomain', 'Check availability of domain name at godaddy')
	.alias('c', 'checkDomain')
	.alias('h', 'help')
	.help('help')
	.argv;

function checkIfNameExists() {
	var name = types[argv.type].generator();
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
				console.log('\n' + chalk.yellow('type -h for help'));
				if (argv.checkDomain) {
					inquirer.prompt([{
						type: 'confirm',
						name: 'registerDomain',
						message: 'Would you like to open a browser and for check availability\n' +
							'of domain names for your package on godaddy.com ?'
        }], function (answers) {
						if (answers.registerDomain) {
							open('https://godaddy.com/domains/searchresults.aspx?checkAvail=1&tld=.tech&domainToCheck=' + name);
						}
					});
				}
			}
		})
		.end();
}

checkIfNameExists();
