const Reporter = require('./reporter');
const fs = require('fs');
const path = require('path');
const formatXmlReport = require('./format-xml-report');

const DEFAULT_OPTIONS = {
    outputDirectory: '',
    outputName: 'sonar-report.xml'
};

class JestSonar {
    constructor(globalConfig, options) {
        this.config = this.getConfig(globalConfig);
        this.options = this.getOptions(options);
    }

    onRunComplete(contexts, results) {
        const reporter = new Reporter(
            this.options.rootDir || this.config.rootDir || ''
        );
        const fileName = this.getFileName();
        this.createDirectory(path.dirname(fileName));
        fs.appendFileSync(fileName, reporter.toSonarReport(results), 'utf8');
        formatXmlReport(fileName).then(console.log).catch(console.error);
    }

    getFileName() {
        return path.resolve(
            this.options.outputDirectory,
            this.options.outputName,
            this.options.rootDir
        );
    }

    getConfig(config) {
        return Object.assign({}, config);
    }

    getOptions(options) {
        return Object.assign({}, DEFAULT_OPTIONS, options);
    }

    createDirectory(pathToCreate) {
        pathToCreate.split(path.sep).reduce((prevPath, folder) => {
            const currentPath = path.join(prevPath, folder, path.sep);
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
            return currentPath;
        }, '');
    }
}

module.exports = JestSonar;
