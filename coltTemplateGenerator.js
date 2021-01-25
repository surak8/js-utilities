const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

/**
 * blah
 */
// eslint-disable-next-line no-unused-vars
class ColtTemplateGenerator {
        static months = ['JAN',
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
        constructor(props) {
            let {destination,kind,skip,templateDir,verbose} = props;
            this.destName = destination;
            this.isVerbose = verbose;
            this.skipGen = skip;
            this.templKind = kind;
            this.templDir = templateDir;
            this. templPath = path.resolve(this.templDir,this.templKind);
        }
        get destination() { return this.destName;}
        get templatePath() { return this.templPath;}
        get verbose() { return this.isVerbose;}
        get kind() { return this.templKind;}
        get skipGeneration() { return this.skipGen;}
        run() {
            try {
                if (this.verbose) {
                    console.log(
                        `\tdestination=${this.destination}\r\n` +
					`\tkind=${this.kind}\r\n` +
					`\ttemplatePath=${this.templatePath}\r\n` +
					`\tverbose=${this.verbose}`);
                }
                if (!fs.existsSync(this.templatePath)) {
                    console.error(`template-dir '${path.relative(process.cwd(),this.templatePath)}' does not exist!`);
                    process.exit(1);
                }
                if (this.verbose)
                    console.log(`Generating template [from ${this.templateDir}]...`);
                else
                    console.log('Generating template...');
                if (!this.skipGeneration)
                    this.processTemplates(this.templateDir);
                else
                    console.log('skipping file-generation.');
            }catch (errMsg) {
                console.error(errMsg);
            }
        }
        /**
* process files found here.
* @param {string} scriptPath <input-directory className=""></input-directory>
*/
        processTemplates(scriptPath) {
            var fullEntry;
            var allFiles = glob.sync('**/*', {cwd: scriptPath,
                nodir: false,
                ignore: ['/bin',
                    'bin',
                    '**/bin/*']});
            var extensionMap = {'.ejs': '.js', '.etxt': '.txt'};
            var data = {
                scriptPath: scriptPath,
                generationDate: this.generateCurrentDateString()
            };
            allFiles.forEach((anEntry) => {
                if (this.wantTemplateFile(fullEntry = path.resolve(scriptPath, anEntry)))
                    this.processTemplateFile(fullEntry, scriptPath, extensionMap, data);
            });
        }
        generateCurrentDateString() {
            var genDateValue = Date.now();
            var aGenDate = new Date(genDateValue);
            return aGenDate.getDay() + '-' + ColtTemplateGenerator.months[aGenDate.getMonth()] + '-' + aGenDate.getFullYear();
        }
        wantTemplateFile(anEntry) {
            if (anEntry && fs.statSync(anEntry).isFile())
                return true;
            return false;
        }
}
module.exports = {
    ColtTemplateGenerator
};