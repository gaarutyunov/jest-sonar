const fs = require('fs');

const formatXmlReport = (filePath, outputPath) => {
    const output = outputPath || filePath;
    const toRemove = '</testExecutions><testExecutions version="1">';
    const xmlFormat = '<?xml version="1.0" encoding="UTF-8"?>';
    const lines = fs
        .readFileSync(filePath)
        .toString()
        .trim()
        .split('\n');
    const newLines = [xmlFormat];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] !== toRemove && lines[i] !== xmlFormat) {
            newLines.push(lines[i]);
        }
    }

    fs.writeFileSync(output, newLines.join('\n'), { encoding: 'utf8' });
};

module.exports = formatXmlReport;
