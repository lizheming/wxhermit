require('dotenv').config();

const path = require('path');
const Application = require('thinkjs');
const watcher = require('think-watcher');

const instance = new Application({
  ROOT_PATH: __dirname,
  APP_PATH: path.join(__dirname, 'src'),
  RUNTIME_PATH: path.join(__dirname, 'runtime'),
  watcher: watcher,
  env: 'development'
});

instance.run();
