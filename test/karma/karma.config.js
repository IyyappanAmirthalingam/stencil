var path = require('path');
const browserStack = true;
process.env.CHROME_BIN = require('puppeteer').executablePath()

var browserStackLaunchers = {
  bs_chrome: {
    base: 'BrowserStack',
    browser: 'chrome',
    os: 'WINDOWS',
    os_version: '10'
  }
};

const localLaunchers = {
  ChromeHeadless: {
    base: 'Chrome',
    flags: [
			'--no-sandbox',
			// See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
			'--headless',
			'--disable-gpu',
			// Without a remote debugging port, Google Chrome exits immediately.
			'--remote-debugging-port=9333'
		]
  },
  Chrome: {
    base: 'Chrome',
    flags: [
			// Without a remote debugging port, Google Chrome exits immediately.
			'--remote-debugging-port=9333'
		]
  }
};

module.exports = function(config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-browserstack-launcher',
      'karma-jasmine',
      'karma-typescript'
    ],
    browsers: browserStack
      ? Object.keys(browserStackLaunchers)
      : Object.keys(localLaunchers),

    singleRun: true, // set this to false to leave the browser open

    frameworks: ['jasmine', 'karma-typescript'],


    browserStack: {
      project: 'stencil_core'
    },

    preprocessors: {
      "**/*.ts": "karma-typescript"
    },

    customLaunchers: browserStack ? browserStackLaunchers : localLaunchers,

    files: [
      'src/**/*.spec.ts',
      'src/util.ts',
      'www/build/app.js',
      { pattern: 'www/build/app/*.js', watched: false, included: false, served: true, nocache: false },
      { pattern: 'www/**/*.html', watched: false, included: false, served: true, nocache: false },
    ],

    colors: true,

    logLevel: config.LOG_INFO,

    proxies: {
      '/www/app/*.js': '/base/www/app/*.js',
      '/www/**/*.html': '/base/www/**/*.html'
    },

    reporters: [
      'progress',
      'BrowserStack'
    ],

    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    },
  });
};