import { DetoxCircusEnvironment } from 'detox/runners/jest-circus';
import { adapter } from 'detox/runners/jest/adapter';

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();
    this.handleTestEvent = adapter.handleTestEvent;
  }

  async teardown() {
    await super.teardown();
  }
}

module.exports = CustomDetoxEnvironment;
