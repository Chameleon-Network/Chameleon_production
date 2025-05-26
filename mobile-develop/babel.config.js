module.exports = {
  presets: ['babel-preset-expo', 'module:react-native-dotenv'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          '@src': './src',
          '@models': './src/models',
          '@services': './src/services',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@components': './src/components',
          '@screens': './src/screens',
          '@routers': './src/router',
          '@hooks': './src/hooks',
          '@dictionary': './src/dictionary',
          '@constants': './src/constants',
          '@resources': './src/resources',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
