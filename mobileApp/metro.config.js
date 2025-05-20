const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("bin");
config.resolver.unstable_enablePackageExports = false;

module.exports = config