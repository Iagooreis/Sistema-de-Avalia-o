module.exports = {
  default: {
    require: ['tests/step_definitions/**/*.js'],
    requireModule: ['@babel/register'],
    format: ['progress-bar', 'html:cucumber-report.html'],
    formatOptions: {
      snippetInterface: 'async-await',
    },
  },
};
