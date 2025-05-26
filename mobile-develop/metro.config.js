const { getDefaultConfig } = require('@react-native/metro-config');
const extraNodeModules = {
  http: require.resolve('@tradle/react-native-http'),
  https: require.resolve('https-browserify'),
  'stream': require.resolve('stream-browserify'),
  'crypto': require.resolve('react-native-crypto'),
  'vm': require.resolve('vm-browserify'),
  'zlib': require.resolve('browserify-zlib'),
  'console': require.resolve('console-browserify'),
  'constants': require.resolve('constants-browserify'),
  'dns': require.resolve('dns.js'),
  'net': require.resolve('react-native-tcp'),
  'domain': require.resolve('domain-browser'),
  'os': require.resolve('react-native-os'),
  'path': require.resolve('path-browserify'),
  'querystring': require.resolve('querystring-es3'),
  'fs': require.resolve('react-native-level-fs'),
  'dgram': require.resolve('react-native-udp'),
  'timers': require.resolve('timers-browserify'),
  'tty': require.resolve('tty-browserify'),
};

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  return {
    ...config,
    resolver: {
      ...config.resolver,
      extraNodeModules
    },
  };
})();
