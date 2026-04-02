const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blacklistRE = /electron-main\.js/;

module.exports = config;