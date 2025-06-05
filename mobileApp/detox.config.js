/** @type {Detox.DetoxConfig} */
module.exports = {
    testRunner: {
      $0: 'jest',
      args: {
        config: 'jest.e2e.config.js', 
        _: ['tests/e2e'],             
      },
      jest: {
        setupTimeout: 120000,
      },
    },
    apps: {
      'android.debug': {
        type: 'android.apk',
        binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
        build: 'cd android && gradlew.bat assembleDebug assembleAndroidTest -DtestBuildType=debug',
      },
    },
    devices: {
      emulator: {
        type: 'android.emulator',
        device: {
          avdName: 'Pixel_9_Pro_API_35',
        },
      },
    },
    configurations: {
      'android.emu.debug': {
        device: 'emulator',
        app: 'android.debug',
      },
    },
  };
  