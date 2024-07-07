module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?@?react-native|@react-native-community|expo(nent)?|@expo(nent)?|react-navigation|@react-navigation|@unimodules|unimodules-(core|react-native-adapter|react-native-font-loader)|sentry-expo|native-base|react-native-svg|react-native-safe-area-context|react-native-screens|@gorhom/bottom-sheet|@notifee/react-native|react-native-reanimated|@react-native-async-storage/async-storage|@react-native-masked-view/masked-view|react-native-webview|react-native-gesture-handler)',
    ],
    testEnvironment: 'node',
  };
  