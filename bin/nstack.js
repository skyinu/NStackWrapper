#! /usr/bin/env node
const PROJECT_DIR = "--p";
const SOURCE_LOG = "--s";
const NDK_PATH = "--n";
const library = require('../lib/index');
let argvs = process.argv;
let projectDir;
let sourceLog;
let ndkPath;
console.log("args = " + argvs);
for (let index = 0; index < argvs.length; index++) {
    if (argvs[index].toLocaleLowerCase().startsWith(PROJECT_DIR.toLocaleLowerCase())) {
        projectDir = argvs[index].split("=")[1];
    }
    else if (argvs[index].toLocaleLowerCase().startsWith(SOURCE_LOG.toLocaleLowerCase())) {
        sourceLog = argvs[index].split("=")[1];
    }
    else if (argvs[index].toLocaleLowerCase().startsWith(NDK_PATH.toLocaleLowerCase())) {
        ndkPath = argvs[index].split("=")[1];
    }
}
library.handleLog(projectDir, sourceLog, ndkPath);