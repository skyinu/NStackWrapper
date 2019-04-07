const fs = require('fs');
const path = require('path');
let handleLog = (projectDir, sourceLog, ndkPath) => {
    console.log("projectDir = " + projectDir + " sourceLog = " + sourceLog);
    if (!ndkPath) {
        let sdkHome = findAndroidSDK();
        console.log('sdkHome is ' + sdkHome);
        ndkPath = findNDKPath(sdkHome);
    }
};
let findNDKPath = (sdkHome) => {

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