import { defineConfig } from 'vitest/config'

export default {
  test: {
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.js'],
      exclude: [
        'src/services/advancedauthservice.js',  // dead code
        'src/server.js',                         // entry point, not testable
        'src/cron/**',                           // not tested
        'src/validators/**',                     // not tested
      ]
    }
  }
}
