/*
launch.json
-- "env" object (process.env. e.g. process.env['riktest'] )
-- "args" array (process.argv)
-- YARGS: "--input=file=blah"
*/
// https://github.com/yargs/yargs/blob/master/docs/examples.md
const yargs = require('yargs/yargs');
const fs = require('fs');
/**
 * class
 */
class DependencyClass {
/**
 * main routine.
 */
    run() {
        var allResults,errMsg;
        try {
            var yargStuff = yargs(process.argv.slice(2))
                .usage('usage: $0 <command> [options]')
                .describe('input-file','infile-desc')
                .describe('i','i-desc')
                .alias('i','input-file')
                .nargs('i',1)
                .demandOption(['i','input-file'])
                .help('h')
                .argv;
            var inFile = yargStuff['i'].trim();
            if (!fs.existsSync(inFile)) {
                errMsg	= `inputfile '${inFile}' does not exist.\r\n`;
                process.stderr.write(errMsg);
                console.error(errMsg);
                process.exit(1);
            }
            process.stdout.write(`processing ${inFile}.\r\n`);
            if ((allResults = this.readDependencyFile(require('fs'), inFile)))
                allResults.forEach(aResult=>{
                    console.log(`${aResult.name} ${aResult.isDev}`);
                });
            else
                console.log('nothing found.');
        }catch (errmsg) {
            console.error(`error processing ${inFile}:\r\n\t${errmsg}`);
        }
    }
    /**
	 * Read dependencies from a file.
	 *
	 * @param {fs} fs file-system object
	 * @param {string} filename a file open and search for dependencies
	 */
    readDependencyFile(fs, filename) {
        var fileContent;
        try {
            if ((fileContent = JSON.parse(fs.readFileSync(filename))))
                return this.readDependencyData(fileContent);
        }catch (errmsg) {
            console.error(`error processing ${ filename }:\r\n${ errmsg }!`);
        }
        return [];
    }
    /**
	 * Read the data-object, flatten out the collection.
	 * @param {string} data the JSON to scan
	 */
    readContent(data) {
        var ret = [];
        if (data)
            for (const [ key ]of Object.entries(data)) ret.push(key);
        return ret;
    }
    /**
	 *
	 * @param {string} data
	 */
    readDependencyData(data) {
        var deps, devDeps, ret = [];
        if (data) {
            if (data.dependencies) deps = this. readContent(data.dependencies);
            if (data.devDependencies) devDeps = this. readContent(data.devDependencies);
            if (deps) deps.forEach(aDep => ret.push({name: aDep, isDev: false}));
            if (devDeps) devDeps.forEach(aDep => { if (!this.haveDep2(aDep, ret)) ret.push({name:aDep,isDev:true}); });
        }
        return ret.length > 1 ? this. sortResults(ret) : ret;
    }
    /**
	 * order the results.
	 * @param {Array} ret an array of dependency objects.
	 */
    sortResults(ret) {
        if (!ret)return [];
        else if (ret.length === 1)return ret;
        return ret.sort((a,b)=>{
            if (a.name < b.name)return -1;
            else if (a.name > b.name)return 1;
            return 0;
        });
    }
    /**
	 * Determine if the given dependency exists in the vector.
	 * @param {string} dep a dependency to test
	 * @param {Array} vector collection to search.
	 */
    // https://stackoverflow.com/questions/45349328/javascript-findindex-callback-arguments
    haveDep2(dep, vector) {
        return vector.findIndex(function (currentValue) {
            return currentValue.name !== dep;
        });
    }
}
/**
 * create the dependency-checker
 */
new DependencyClass().run();
console.log('complete');
