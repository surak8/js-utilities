// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);// 'use strict';

const fs = require('fs-extra');
const ejs = require('ejs');
const argv = require('yargs-parser')(process.argv.slice(2));
const path = require('path');
// const env = require('dotenv').config;
var glob = require('glob');

/*
* RIK -- be sure to add "windows":{"args":["--out=out.js","--fn"="main"]}
to the launch node/nodemon configuration in launch.json
*/

/**
 * Show the contents of some vector
 * @param {Array} v a vector to display.
 */
// eslint-disable-next-line no-unused-vars
const logVector = (v) => {
	try {
		console.log(v);
	} catch (err){
		console.error(err);
	}
};
/** main-line function */
const main = () => {
	console.log('Generating template...');
	try {
		var scriptPath = path.dirname(process.argv[1]);

		if (path.basename(scriptPath) === 'bin')
			scriptPath = path.dirname(scriptPath);
		processTemplates(scriptPath);
		// eslint-disable-next-line no-unused-vars
		const { _: leftovers, verbose, v, t, template_dir } = argv;
		// const data = {
		//	leftovers,
		//	...{scriptPath: scriptPath}
		// };
		// const options = {};

		// console.log(data);
		// createMain(data, options);
	} catch (err){
		console.error(err);
	}
};

function processTemplates(scriptPath){
	var fullEntry;
	var allFiles = glob.sync('**/*', { cwd: scriptPath,
		nodir: false,
		ignore: ['/bin',
			'bin',
			'**/bin/*'] });
	var extensionMap = { '.ejs': '.js', '.etxt': '.txt' };

	// "}
	// var dateStr =
	var data = {
		scriptPath: scriptPath,
		generationDate: generateCurrentDateString()
	};

	allFiles.forEach((anEntry) => {
		if (wantTemplateFile(fullEntry = path.resolve(scriptPath, anEntry)))
			processTemplateFile(fullEntry, scriptPath, extensionMap, data);
	});
// console.log(`allFiles=${allFiles}`);
}

function generateCurrentDateString(){
	var genDateValue = Date.now();
	var aGenDate = new Date(genDateValue);
	var months = ['JAN',
		'FEB',
		'MAR',
		'APR',
		'MAY',
		'JUN',
		'JUL',
		'AUG',
		'SEP',
		'OCT',
		'NOV',
		'DEC'];

	return aGenDate.getDay() + '-' + months[aGenDate.getMonth()] + '-' + aGenDate.getFullYear();

}

function wantTemplateFile(anEntry){
	if (anEntry && fs.statSync(anEntry).isFile())
		return true;
	return false;
}

function processTemplateFile(aFile, scriptPath, extMap, data){
	var tmp, outputFile, currentExt, data, options;
	var extChanged = false;

	tmp = path.relative(scriptPath, aFile);
	currentExt = path.extname(aFile);
	if (extMap[currentExt]){
		tmp = path.join(path.dirname(tmp), path.basename(tmp, currentExt) + extMap[currentExt]);
		// eslint-disable-next-line no-unused-vars
		extChanged = true;
	}
	outputFile = path.resolve(process.cwd(), tmp);
	// data.pu
	// data = { ...data, ...{ isData: true } };
	options = { ...options, ...{ isOptions: true } };

	ejs.renderFile(aFile, data, options, function (err, str){
		// str => Rendered HTML string
		if (err)
			console.error(`Error creating ${outputFile}:\r\n${err}`);
		else
			try {
				fs.ensureFileSync(outputFile);
				fs.outputFileSync(outputFile, str);
				console.log(`read ${aFile}\r\nwrote ${outputFile}.`);
			} catch (anError){
				console.error('here');
			}

	});

	console.log(`read:\r\n\t${aFile}\r\nwrite:\r\n\t${outputFile}\r\n`);
}

// eslint-disable-next-line no-unused-vars
function writeOutfile1(filename, data, options){
	var outputFile = data.outFile;

	console.log(`Convert input-file:\r\n\t${filename}\r\nto output-file:\r\n\t${outputFile}.`);

	ejs.renderFile(filename, data, options, function (err, str){
		// str => Rendered HTML string
		if (err)
			console.error(err);
		else {
			fs.ensureFileSync(outputFile);
			fs.outputFileSync(outputFile, str);
			console.log(`read ${filename}\r\nwrote ${outputFile}.`);
		}
	});
}

main();