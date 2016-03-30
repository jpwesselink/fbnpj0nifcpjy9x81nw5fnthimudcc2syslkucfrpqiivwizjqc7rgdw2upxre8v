#!/usr/bin/env node

// moar modules!
var chalk = require('chalk');
var crypto = require('crypto');
var http = require('http');
var inquirer = require('inquirer');
var open = require('open');
var randomWords = require('random-words');
var UUIDgen = require('uuid');
var useUUID = (process.argv[2] === "true");

function createNamePackage(){
  var namePackage;

  if(useUUID){
    namePackage = UUIDgen.v4();
  } else {
    namePackage = randomWords({ exactly: 7, join: '-' });
  }

  return namePackage;
}



function checkIfNameExists() {
	var name = createNamePackage();
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
