const path = require('path');
const genMod = require('./coltTemplateGenerator');
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
