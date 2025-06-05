const { DetoxCircusEnvironment } = require('detox/runners/jest-circus');
const { execSync } = require('child_process');

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();
   
  }

  async teardown() {
    await super.teardown();

  }
}

module.exports = CustomDetoxEnvironment;
