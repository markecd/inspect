// init.js
const detox = require('detox');
const config = require('./detox.config.js'); 
const adapter = require('detox/runners/jest/adapter');

jest.setTimeout(120000);
beforeAll(async () => {
  await detox.init(config);
});
beforeEach(async () => {
  await adapter.beforeEach();
});
afterAll(async () => {
  await detox.cleanup();
});
