module.exports = process.env.AUTONOMY_COV
  ? require('./lib-cov/autonomy.js')
  : require('./lib/autonomy.js');
