const fs = require('fs-extra');
const ejs = require('ejs');
const path = require('path');
var glob = require('glob');
const genMod = require('./coltTemplateGenerator');
/*
* RIK -- be sure to add "windows":{"yargs":["--out=out.js","--fn"="main"]}
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
    }catch (err) {
        console.error(err);
    }
};
/** main-line function */
const main = () => {
    var yargs,yargObj;
    try {
        yargs = require('yargs/yargs')(process.argv.slice(2))
            .usage('usage: $0 blah')
            .version()
            .option('template-dir',{
                alias:'t',
                describe:'template directory (source)',
                default:path.resolve(process.cwd(),'templates')
            })
            .option('destination',{
                alias:'d',
                describe:'output directory (destination)',
                default:process.cwd()
            })
            .option('kind',{
                alias:'k',
                default:'colt',
                describe:'kind of template to use'
            })
            .option('s',{
                alias:'skip',
                describe:'skip file-generation step'
            })
            .option('verbose',{
                alias:'v',
                describe:'verbose processing'
            })
            .demandOption(['t','template-dir','k','kind'])
            .help('h');
        yargObj = yargs.argv;
        const {destination,kind,skip,templateDir,verbose} = yargObj;
        //let templatePath = path.resolve(templateDir,kind);
        if (verbose) {
            console.log(
                `\tdestination=${destination}\r\n` +
`\tkind=${kind}\r\n` +
`\ttemplateDir=${templateDir}\r\n` +
`\tverbose=${verbose}`);
            //console.log(`SRC=${yargObj.templateDir}\r\n` +
            //	`DEST=${yargObj.destination}`);
        }

        //if (!fs.existsSync((templateDir = yargObj.templateDir))) {
        if (!fs.existsSync(templateDir)) {
            console.error(`template-dir '${path.relative(process.cwd(),templateDir)}' does not exist!`);
            process.exit(1);
        }
        if (verbose)
            console.log(`Generating template [from ${templateDir}]...`);
        else
            console.log('Generating template...');
        if (!skip)
            processTemplates(templateDir);
        else
            console.log('skipping file-generation.');

        /*********************************
* processTemplates(scriptPath);
*/
        // eslint-disable-next-line no-unused-vars
        //const {_: leftovers, verbose, v, t, template_dir} = argv;
        //const {_: leftovers, verbose, v, t, template_dir} = yargs;
        // const data = {
        //	leftovers,
        //	...{scriptPath: scriptPath}
        // };
        // const options = {};

        // console.log(data);
        // createMain(data, options);
    }catch (err) {
        console.error(err);
    }
};

/**
* process files found here.
* @param {string} scriptPath <input-directory className=""></input-directory>
*/
function processTemplates(scriptPath) {
    var fullEntry;
    var allFiles = glob.sync('**/*', {cwd: scriptPath,
        nodir: false,
        ignore: ['/bin',
            'bin',
            '**/bin/*']});
    var extensionMap = {'.ejs': '.js', '.etxt': '.txt'};

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

function generateCurrentDateString() {
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

function wantTemplateFile(anEntry) {
    if (anEntry && fs.statSync(anEntry).isFile())
        return true;
    return false;
}

function processTemplateFile(aFile, scriptPath, extMap, data) {
    var tmp, outputFile, currentExt, options;
    var extChanged = false;

    tmp = path.relative(scriptPath, aFile);
    currentExt = path.extname(aFile);
    if (extMap[currentExt]) {
        tmp = path.join(path.dirname(tmp), path.basename(tmp, currentExt) + extMap[currentExt]);
        // eslint-disable-next-line no-unused-vars
        extChanged = true;
    }
    outputFile = path.resolve(process.cwd(), tmp);
    // data.pu
    // data = { ...data, ...{ isData: true } };
    options = {...options, ...{isOptions: true}};

    ejs.renderFile(aFile, data, options, function (err, str) {
        // str => Rendered HTML string
        if (err)
            console.error(`Error creating ${outputFile}:\r\n${err}`);
        else
            try {
                fs.ensureFileSync(outputFile);
                fs.outputFileSync(outputFile, str);
                console.log(`read ${aFile}\r\nwrote ${outputFile}.`);
            }catch (anError) {
                console.error('here');
            }

    });

    console.log(`read:\r\n\t${aFile}\r\nwrite:\r\n\t${outputFile}\r\n`);
}

// eslint-disable-next-line no-unused-vars
function writeOutfile1(filename, data, options) {
    var outputFile = data.outFile;

    console.log(`Convert input-file:\r\n\t${filename}\r\nto output-file:\r\n\t${outputFile}.`);

    ejs.renderFile(filename, data, options, function (err, str) {
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

try {
    let yargs = require('yargs/yargs')(process.argv.slice(2))
        .usage('usage: $0 blah')
        .version()
        .option('template-dir',{
            alias:'t',
            describe:'template directory (source)',
            default:path.resolve(process.cwd(),'templates')
        })
        .option('destination',{
            alias:'d',
            describe:'output directory (destination)',
            default:process.cwd()
        })
        .option('kind',{
            alias:'k',
            default:'colt',
            describe:'kind of template to use'
        })
        .option('s',{
            alias:'skip',
            describe:'skip file-generation step'
        })
        .option('verbose',{
            alias:'v',
            describe:'verbose processing'
        })
        .demandOption(['t','template-dir','k','kind'])
        .help('h');
    new genMod.ColtTemplateGenerator (yargs.argv).run();
}catch (errMsg) {
    console.error(errMsg);
    process.exit(1);
}
console.log('process complete');
process.exit(0);
