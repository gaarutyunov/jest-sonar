const readline = require('readline');
const fs = require('fs');

const writeFile = function(path, data, write) {
    return new Promise(function(resolve, reject) {
        if (write) {
            fs.writeFile(path, data, 'utf8', function(err) {
                if (err) {
                    reject('Writing file error!');
                } else {
                    resolve('Writing file succeeded!');
                }
            });
        } else {
            fs.appendFile(path, data, 'utf8', function(err) {
                if (err) {
                    reject('Writing file error!');
                } else {
                    resolve('Writing file succeeded!');
                }
            });
        }
    });
};

const readFile = function(file) {
    return new Promise(function(resolve, reject) {
        let lines = [];
        const rl = readline.createInterface({
            input: fs.createReadStream(file)
        });

        rl.on('line', function(line) {
            lines.push(line);
        });

        rl.on('close', function() {
            resolve(lines);
        });
    });
};

const formatXmlReport = (filePath, outputPath) => {
    return new Promise((resolve, reject) => {
        const output = outputPath || filePath;
        const toRemove = '</testExecutions><testExecutions version="1">';
        const xmlFormat = '<?xml version="1.0" encoding="UTF-8"?>';

        return readFile(filePath).then(lines => {
            try {
                const newLines = [xmlFormat];
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] !== toRemove && lines[i] !== xmlFormat) {
                        newLines.push(lines[i]);
                    }
                }

                return writeFile(output, newLines.join('\n'), true)
                    .then(() => {
                        resolve('Done processing xml');
                    })
                    .catch(err => {
                        reject(err);
                    });
            } catch (e) {
                reject(e);
            }
        });
    });
};

module.exports = formatXmlReport;
