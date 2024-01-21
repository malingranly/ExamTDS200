module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-env', { loose: true }],
      'babel-preset-expo',
      '@babel/preset-typescript'
    ],
    plugins: [
      'nativewind/babel',
     
      ['module:react-native-dotenv', {
        'envName': 'APP_ENV',
        'moduleName': '@env',
        'path': '.env',
        'blocklist': null,
        'allowlist': null,
        'safe': false,
        'allowUndefined': true,
        'verbose': false,
      }],
    ],
  };
};
