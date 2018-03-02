module.exports = {
  extends: 'airbnb-base',

  env: {
    'es6': true,
    'node': true,
  },

  globals: {
    'atom': true,
  },

  rules: {
    'prefer-rest-params': 0, // unavailable
    'strict': 0,

    'import/no-unresolved': [2, { commonjs: true, ignore: ['atom'] }],
  },
};
