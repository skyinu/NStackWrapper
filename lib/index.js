const fs = require('fs');
const path = require('path');
const os = require('os');
const childProcess = require('child_process');

let handleLog = (projectDir, sourceLog, ndkPath) => {
    console.log("projectDir = " + projectDir + " sourceLog = " + sourceLog);
    if (!ndkPath) {
        let sdkHome = findAndroidSDK();
        console.log('sdkHome is ' + sdkHome);
        ndkPath = findNDKPath(sdkHome);
        console.log('ndk path is ' + ndkPath);
    }
    if (!ndkPath) {
        console.log("can't find ndk path please enter it manually ");
        return;
    }
    let archits = ['armeabi', 'armeabi-v7a'];
    for (let index = 0; index < archits.length; index++) {
        let cmd = buildCommand(projectDir, archits[index], sourceLog, ndkPath);
        if(!cmd){
            console.log("can't find " + archits[index] + " directory");
            continue;
        }
        let result = childProcess.execSync(cmd);
        console.log('result is \n*************************\n' + result + "\n********************************")
    }


};

let buildCommand = (projectDir, archit, sourceLog, ndkPath) => {
    let soDir = projectDir + path.sep + "obj" + path.sep + "local" + path.sep + archit;
    if (!fs.existsSync(soDir)) {
        return undefined;
    }
    let cmd = ndkPath;
    cmd = cmd + " -sym " + soDir + " -dump " + sourceLog;
    return cmd;
}
let findNDKPath = (sdkHome) => {
    const NDK_BUNDLE = "ndk-bundle";
    const NDK_STACK = "ndk-stack";
    let ndkdirs = sdkHome + path.sep + NDK_BUNDLE;
    if (!fs.existsSync(ndkdirs)) {
        return undefined;
    }
    let ndkFils = ndkdirs + path.sep + NDK_STACK;
    if (os.platform() === "win32") {
        ndkFils = ndkFils + ".cmd";
    }
    if (fs.existsSync(ndkFils)) {
        return ndkFils;
    }
    return undefined;

}
let findAndroidSDK = () => {
    let sdkHome = process.env['ANDROID_HOME'];
    if (sdkHome) {
        return;
    }
    const PLATFORM_TOOLS = "platform-tools";
    const PLATFORM = "platform";
    const SOURCES = "sources";
    let osPath = []
    for (let key in process.env) {
        let value = process.env[key]
        let values = value.split(";");
        osPath = osPath.concat(values);
    }
    for (let index = 0; index < osPath.length; index++) {
        let value = osPath[index];
        if (!value.endsWith(PLATFORM_TOOLS)) {
            continue;
        }
        value = path.normalize(value + path.sep + ".." + path.sep);
        let valusStat = fs.statSync(value);
        if (!valusStat.isDirectory()) {
            continue;
        }
        let subDirs = fs.readdirSync(value);
        let merged = subDirs.join('|');
        if (merged.indexOf(PLATFORM_TOOLS) > 0 && merged.indexOf(PLATFORM) > 0 && merged.indexOf(SOURCES) > 0) {
            return value;
        }
    }
    return undefined;
}

exports.handleLog = handleLog;