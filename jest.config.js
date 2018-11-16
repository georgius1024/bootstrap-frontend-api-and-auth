module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  setupFiles: ['<rootDir>/tests/unit/setup'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
    // '**/tests/unit/**/api.spec.js'
    // '**/tests/unit/**/breadcrumbs.spec.js'
    // '**/tests/unit/**/login.spec.js'
    // '**/tests/unit/**/store-account.spec.js'
    //'**/tests/unit/**/activator.spec.js'
    //'**/tests/unit/**/reset-password.spec.js'
    // '**/tests/unit/**/change-password.spec.js'
    // '**/tests/unit/**/about.spec.js'
    // '**/tests/unit/**/formatting.spec.js'
    // '**/tests/unit/**/initialization.spec.js',
    // '**/tests/unit/**/testing-pending-item.spec.js',
    // '**/tests/unit/**/testing-plan-item.spec.js',
    // '**/tests/unit/**/testing-plan-section.spec.js',
    // '**/tests/unit/**/testing-info.spec.js',
    // '**/tests/unit/**/testing-plan-view.spec.js',
    // '**/tests/unit/**/testing-session-view-methods.spec.js',
    // '**/tests/unit/**/testing-navigation.spec.js'
    // '**/tests/unit/**/testing-indicator.spec.js',
    // '**/tests/unit/**/testing-paused-view.spec.js',
    // '**/tests/unit/**/testing-interaction-m-of-n.spec.js',
    // '**/tests/unit/**/testing-interaction-1-of-n.spec.js',
    // '**/tests/unit/**/testing-interaction-inline.spec.js',
    // '**/tests/unit/**/testing-interaction-sequence.spec.js',
    // '**/tests/unit/**/testing-interaction-match.spec.js',
    // '**/tests/unit/**/testing-session-view-presentation.spec.js',
    // '**/tests/unit/**/testing-process-view.spec.js',
    // '**/tests/unit/**/consts.spec.js',
    // '**/tests/unit/**/testing-completed-view.spec.js',
    // '**/tests/unit/**/router.spec.js',
    // '**/tests/unit/**/app-events.spec.js',
    // '**/tests/unit/**/root-view.spec.js',
    // '**/tests/unit/**/testing-index-view.spec.js',

  ],
  testURL: 'http://localhost/'
}
