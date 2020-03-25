# Jest Reporter For SonarQube

Forked from [jest-sonar](https://github.com/sh33dafi/jest-sonar)

- In Nx Nrwl tests are run from root directory sequentially for each module (library or application).
- Original reporter replaced report file after each run.
- Paths for each test were relative to the root folder of each app or library. Therefore SonarQube could not see them.

## Known issues

### Problem 1
Reporter appends the file each time, so you need to delete it first.

#### Workaround
You can configure a pretest npm script in package.json to remove report file

### Problem 2
Paths are absolute, they contain Users/... You will have to format them anyway

#### Workaround
Consider something like this
```javascript
const fs = require("fs");
const path = require("path");

const fixXmlReport = (filePath, outputPath) => {
    const output = outputPath || filePath;
    const regex = new RegExp(/(?<=path=")(.*)(?=")/);
    const lines = fs.readFileSync(filePath).toString().trim().split("\n");
    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(regex);

        if (!!match) {
            const newLine = match[0];
            // Use process.cwd to get directory where node.js is executed (root of the project)
            lines[i] = lines[i].replace(newLine, path.relative(process.cwd(), newLine));
        }
        newLines.push(lines[i]);
    }
    fs.writeFileSync(output, newLines.join("\n"));
};
```
